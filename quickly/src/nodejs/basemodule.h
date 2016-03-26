/*
 * Quickly - ES6 and Node.js-like environment for QML
 *
 * Copyright (C) 2016 Michael Spencer <sonrisesoftware@gmail.com>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

#ifndef BASE_MODULE_H
#define BASE_MODULE_H

#include <QObject>

#include <QString>
#include <QQmlEngine>

class BaseModule : public QObject
{
    Q_OBJECT

public:
    BaseModule(QQmlEngine *engine = nullptr) : QObject(engine), m_engine(engine) {}

protected:
    void throwException(const QString &message) const;

private:
    QQmlEngine *m_engine;
};

#endif // BASE_MODULE_H
