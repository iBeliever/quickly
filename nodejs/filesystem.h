/*
 * Quickly - ES6 and Node.js-like environment for QML
 *
 * Copyright (C) 2016 Michael Spencer <sonrisesoftware@gmail.com>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

#ifndef FILE_SYSTEM_H
#define FILE_SYSTEM_H

#include "basemodule.h"

#include <QString>
#include <QQmlEngine>

class FileSystem : public BaseModule
{
    Q_OBJECT

public:
    FileSystem(QQmlEngine *engine) : BaseModule(engine) {}

    Q_INVOKABLE QString readFile(const QString &path) const;
    // Q_INVOKABLE void writeFile(const QString &path, const QString &data) const;
    // Q_INVOKABLE bool exists(const QString &path) const;
    // Q_INVOKABLE void mkdir(const QString &path) const;
    // Q_INVOKABLE void rmdir(const QString &path) const;

    static QObject *qmlSingleton(QQmlEngine *engine, QJSEngine *scriptEngine);

private:
    QString resolve(const QString &pathOrUrl) const;
};

#endif // FILE_SYSTEM_H
