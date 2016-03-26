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
#include <private/qv8engine_p.h>

QString FileSystem::readFile(const QString &path) const
{
    QString resolvedPath = resolve(path);

    QFile file(resolvedPath);
    if (!file.open(QIODevice::ReadOnly | QIODevice::Text)) {
        throwException(QStringLiteral("File does not exist or is not readable: %1").arg(resolvedPath));
        return "";
    }

    QTextStream in(&file);

    return in.readAll();
}

QString FileSystem::resolve(const QString &pathOrUrl) const
{
    if (pathOrUrl.startsWith("file://")) {
        return pathOrUrl.right(pathOrUrl.length() - 7);
    } else {
        return pathOrUrl;
    }
}

QObject *FileSystem::qmlSingleton(QQmlEngine *engine, QJSEngine *scriptEngine)
{
    Q_UNUSED(scriptEngine)

    return new FileSystem(engine);
}
