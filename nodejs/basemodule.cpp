/*
 * Quickly - ES6 and Node.js-like environment for QML
 *
 * Copyright (C) 2016 Michael Spencer <sonrisesoftware@gmail.com>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

#include "basemodule.h"

#include <QFile>
#include <QTextStream>
#include <private/qv8engine_p.h>

void BaseModule::throwError(const QString &message) const
{
    QV8Engine::getV4(m_engine)->throwError(message);
}
