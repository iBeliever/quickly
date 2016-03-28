include(qmlify.pri)

TEMPLATE = lib

VERSION = 0.1

CONFIG += c++11

QT += core-private qml qml-private

HEADERS += $$PWD/src/plugin.h \
           $$PWD/src/nodejs/filesystem.h \
           $$PWD/src/nodejs/path.h \
           $$PWD/src/nodejs/process.h \
           $$PWD/src/nodejs/basemodule.h

SOURCES += $$PWD/src/plugin.cpp \
           $$PWD/src/nodejs/filesystem.cpp \
           $$PWD/src/nodejs/path.cpp \
           $$PWD/src/nodejs/process.cpp \
           $$PWD/src/nodejs/basemodule.cpp

QMLIFY += src
target.path = $$[QT_INSTALL_QML]/Quickly

qml.files += src/qmldir \
             build/src-qmlified/*
qml.path = $$[QT_INSTALL_QML]/Quickly

INSTALLS += target qml

OTHER_FILES += $$qml.files
