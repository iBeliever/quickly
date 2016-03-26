/*
 * Quickly - ES6 and Node.js-like environment for QML
 *
 * Copyright (C) 2016 Michael Spencer <sonrisesoftware@gmail.com>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

#include "plugin.h"

#include <QtQml>
#include <QDebug>

#include "nodejs/filesystem.h"
#include "nodejs/path.h"

void Plugin::registerTypes(const char *uri)
{
    // @uri Quickly
    Q_ASSERT(uri == QStringLiteral("Quickly"));

    qDebug() << "Registering singletons...";

    qmlRegisterSingletonType<FileSystem>(uri, 0, 1, "FileSystem", FileSystem::qmlSingleton);
    qmlRegisterSingletonType<Path>(uri, 0, 1, "Paths", Path::qmlSingleton);
}
