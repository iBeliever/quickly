/*
 * Quickly - ES6 and Node.js-like environment for QML
 *
 * Copyright (C) 2016 Michael Spencer <sonrisesoftware@gmail.com>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

#include "path.h"

#include <QFileInfo>
#include <QDir>

QString Path::basename(const QString &path, const QString &ext) const
{
    QString basename = QFileInfo(path).fileName();

    if (!ext.isEmpty() && basename.endsWith(ext))
        basename = basename.left(basename.size() - ext.size());

    return basename;
}

QString Path::delimiter() const
{
#if QT_VERSION >= QT_VERSION_CHECK(5, 6, 0)
    return QDir::listSeparator();
#else
#if defined(Q_OS_WIN)
    return ";";
#else
    return ":";
#endif
#endif
}

QString Path::dirname(const QString &path) const
{
    return QFileInfo(path).path();
}

QString Path::extname(const QString &path) const
{
    if (path.startsWith(".") || !path.contains(".")) {
        return "";
    } else {
        return "." + QFileInfo(path).suffix();
    }
}

QString Path::format(const QVariantMap &pathObject) const
{
    QString root = pathObject["root"].toString();
    QString dirname = pathObject["dir"].toString();
    QString base = pathObject["base"].toString();
    QString ext = pathObject["ext"].toString();
    QString name = pathObject["name"].toString();

    if (base.isEmpty())
        base = name + ext;
    else if (!ext.isEmpty() && !name.isEmpty())
        Q_ASSERT(base == name + ext);

    if (!root.isEmpty())
        Q_ASSERT(dirname.startsWith(root));

    QDir dir(dirname);

    return dir.filePath(base);
}

QVariantMap Path::parse(QString path) const
{
    QFileInfo info(path);
    QVariantMap pathObject;

    // TODO: Implement resolve
    // path = resolve("", path);

    pathObject["ext"] = extname(path);
    pathObject["name"] = basename(path, pathObject["ext"].toString());
    pathObject["dir"] = dirname(path);
    // TODO: Implement root

    return pathObject;
}

bool Path::isAbsolute(const QString &path) const
{
    return QFileInfo(path).isAbsolute();
}

QString Path::join(const QStringList &paths) const
{
    QString joinedPath = QDir::cleanPath(paths.join("/"));

    return joinedPath.isEmpty() ? "." : joinedPath;
}

QObject *Path::qmlSingleton(QQmlEngine *engine, QJSEngine *scriptEngine)
{
    Q_UNUSED(engine)
    Q_UNUSED(scriptEngine)

    return new Path(engine);
}
