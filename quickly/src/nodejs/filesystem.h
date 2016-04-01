/*
 * Quickly - ES6 and Node.js-like environment for QML
 *
 * Copyright (C) 2016 Michael Spencer <sonrisesoftware@gmail.com>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

#ifndef FILESYSTEM_H
#define FILESYSTEM_H

#include "basemodule.h"

#include <QString>
#include <QQmlEngine>
#include <QFileSystemWatcher>
#include <QJSValue>

class Filesystem : public BaseModule
{
    Q_OBJECT

public:
    Filesystem(QQmlEngine *engine);

    Q_INVOKABLE QString readFileSync(const QString &path) const;
    Q_INVOKABLE void writeFileSync(const QString &path, const QString &data) const;
    // Q_INVOKABLE bool existsSync(const QString &path) const;
    // Q_INVOKABLE void mkdir(const QString &path) const;
    // Q_INVOKABLE void rmdir(const QString &path) const;

    Q_INVOKABLE QJSValue watch(const QString &path);

    Q_INVOKABLE void setEventEmitter(QJSValue emitterClass);

    static QObject *qmlSingleton(QQmlEngine *engine, QJSEngine *scriptEngine);

private:
    QString resolve(const QString &pathOrUrl) const;

    QFileSystemWatcher m_watcher;
    QMap<QString, QJSValue> m_watchEmitters;
};

#endif // FILESYSTEM_H
