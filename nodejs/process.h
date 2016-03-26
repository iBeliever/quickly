/*
 * Quickly - ES6 and Node.js-like environment for QML
 *
 * Copyright (C) 2016 Michael Spencer <sonrisesoftware@gmail.com>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

 #ifndef PROCESS_H
 #define PROCESS_H

#include <QObject>

#include <QString>
#include <QFileInfo>
#include <QDir>
#include <QCoreApplication>

class Process : public QObject
{
    Q_OBJECT

    Q_PROPERTY(QString arch READ arch CONSTANT)

public:
    QString arch() const {
        return QSysInfo::currentCpuArchitecture();
    }

    QStringList argv() const {
        QStringList args = QCoreApplication::arguments();

        // On Node.js, the first argument is node, so we need to add our own first argument
        args.prepend("quickly");

        return args;
    }

    void chdir(const QString &directory) {
        if (!QDir::setCurrent(directory)) {
            // TODO: Throw error
        }
    }

    QString cwd() const {
        return QDir::currentPath();
    }

    // QVariantMap env() const {
    //
    // }
};

#endif // PROCESS_H
