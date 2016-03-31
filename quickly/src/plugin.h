/*
 * Quickly - ES6 and Node.js-like environment for QML
 *
 * Copyright (C) 2016 Michael Spencer <sonrisesoftware@gmail.com>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

#ifndef QUICKLY_PLUGIN_H
#define QUICKLY_PLUGIN_H

#include <QQmlExtensionPlugin>

class QuicklyPlugin : public QQmlExtensionPlugin
{
    Q_OBJECT
    Q_PLUGIN_METADATA(IID "com.sonrisesoftware.Quickly")

public:
    void registerTypes(const char *uri);
};

#endif // QUICKLY_PLUGIN_H
