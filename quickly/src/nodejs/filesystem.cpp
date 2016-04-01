/*
 * Quickly - ES6 and Node.js-like environment for QML
 *
 * Copyright (C) 2016 Michael Spencer <sonrisesoftware@gmail.com>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

#include "filesystem.h"

#include <QFile>
#include <QTextStream>
#include <QDebug>

#define ASSERT_NOT_NULL(value) { auto v = value; Q_ASSERT(!v.isNull() && !v.isUndefined()); }

#define JS_CALL(obj, method, args) (obj).property(method).callWithInstance(obj, args)

QMap<QQmlEngine *, QJSValue> eventEmitter;

Filesystem::Filesystem(QQmlEngine *engine)
    : BaseModule(engine)
{
    // TODO: Figure out rename vs change
    connect(&m_watcher, &QFileSystemWatcher::fileChanged, [this](const QString &path) {
        QJSValueList args = {"change", "change", path};
        JS_CALL(m_watchEmitters[path], "emit", args);
    });

    connect(&m_watcher, &QFileSystemWatcher::directoryChanged, [this](const QString &path) {
        QJSValueList args = {"change", "change", path};
        JS_CALL(m_watchEmitters[path], "emit", args);
    });
}

QString Filesystem::readFileSync(const QString &path) const
{
    QString resolvedPath = resolve(path);

    QFile file(resolvedPath);
    if (!file.open(QFile::ReadOnly | QFile::Text)) {
        throwError(QStringLiteral("File does not exist or is not readable: %1").arg(resolvedPath));
        return "";
    }

    QTextStream in(&file);

    return in.readAll();
}

void Filesystem::writeFileSync(const QString &path, const QString &data) const
{
    QString resolvedPath = resolve(path);

    QFile file(resolvedPath);

    if (!file.open(QFile::WriteOnly | QFile::Text)) {
        throwError(QStringLiteral("File is not writable: %1").arg(resolvedPath));
        return;
    }

    QTextStream out(&file);
    out << data;
}

QString Filesystem::resolve(const QString &pathOrUrl) const
{
    if (pathOrUrl.startsWith("file://")) {
        return pathOrUrl.right(pathOrUrl.length() - 7);
    } else {
        return pathOrUrl;
    }
}

QJSValue Filesystem::watch(const QString &path)
{
    QString resolvedPath = resolve(path);

    if (!m_watchEmitters.contains(resolvedPath)) {
        qDebug() << resolvedPath;
        m_watcher.addPath(resolvedPath);
        m_watchEmitters[resolvedPath] = eventEmitter[m_engine].callAsConstructor();
    }

    return m_watchEmitters[resolvedPath];
}

void Filesystem::setEventEmitter(QJSValue emitterClass)
{
    Q_ASSERT(emitterClass.isCallable());
    ASSERT_NOT_NULL(emitterClass.callAsConstructor());

    eventEmitter[m_engine] = emitterClass;
}

QObject *Filesystem::qmlSingleton(QQmlEngine *engine, QJSEngine *scriptEngine)
{
    Q_UNUSED(scriptEngine)

    return new Filesystem(engine);
}
