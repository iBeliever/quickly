/*
 * Quickly - ES6 and Node.js-like environment for QML
 *
 * Copyright (C) 2016 Michael Spencer <sonrisesoftware@gmail.com>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

#ifndef PATH_H
#define PATH_H

#include "basemodule.h"

#include <QString>
#include <QVariantMap>
#include <QQmlEngine>

class Path : public BaseModule
{
    Q_OBJECT

    Q_PROPERTY(QString delimiter READ delimiter CONSTANT)

public:
    Path(QQmlEngine *engine) : BaseModule(engine) {}

    QString delimiter() const;

    Q_INVOKABLE QString basename(const QString &path, const QString &ext = "") const;
    Q_INVOKABLE QString dirname(const QString &path) const;
    Q_INVOKABLE QString extname(const QString &path) const;
    Q_INVOKABLE QString format(const QVariantMap &pathObject) const;
    Q_INVOKABLE QVariantMap parse(QString path) const;
    Q_INVOKABLE bool isAbsolute(const QString &path) const;

    Q_INVOKABLE QString join() const { return join(QStringList()); }
    Q_INVOKABLE QString join(const QString &path1) const { return join(QStringList() << path1); }
    Q_INVOKABLE QString join(const QString &path1, const QString &path2) const {
        return join({path1, path2});
    }
    Q_INVOKABLE QString join(const QString &path1, const QString &path2,
                             const QString &path3) const {
        return join({path1, path2, path3});
    }
    Q_INVOKABLE QString join(const QString &path1, const QString &path2, const QString &path3,
                             const QString &path4) const {
        return join({path1, path2, path3, path4});
    }
    Q_INVOKABLE QString join(const QString &path1, const QString &path2, const QString &path3,
                             const QString &path4, const QString &path5) const {
        return join({path1, path2, path3, path4, path5});
    }
    Q_INVOKABLE QString join(const QString &path1, const QString &path2, const QString &path3,
                             const QString &path4, const QString &path5,
                             const QString &path6) const {
        return join({path1, path2, path3, path4, path5, path6});
    }
    Q_INVOKABLE QString join(const QStringList &paths) const;

    Q_INVOKABLE QString normalize(const QString path) const;

    static QObject *qmlSingleton(QQmlEngine *engine, QJSEngine *scriptEngine);
};

#endif // PATH_H
