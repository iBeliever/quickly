TEMPLATE = lib

VERSION = 0.1

CONFIG += c++11

QT += qml quick

HEADERS += $$PWD/src/plugin.h \
           $$PWD/src/nodejs/filesystem.h \
           $$PWD/src/nodejs/path.h \
           $$PWD/src/nodejs/process.h

SOURCES += $$PWD/src/plugin.cpp \
           $$PWD/src/nodejs/filesystem.cpp \
           $$PWD/src/nodejs/path.cpp \
           $$PWD/src/nodejs/process.cpp

QMLIFY += src

qmlify.output  = qmlify/resources.qrc
qmlify.commands = qmlify --no-polyfills -d qmlify ${QMAKE_FILE_NAME}
qmlify.input = QMLIFY
qmlify.depend_command = ls $$PWD/src/*
qmlify.variable_out = RESOURCES
qmlify.CONFIG += target_predeps
QMAKE_EXTRA_COMPILERS += qmlify

target.path = $$[QT_INSTALL_QML]/Quickly

qml.files += src/qmldir \
             build/qmlify/*
qml.path = $$[QT_INSTALL_QML]/Quickly

INSTALLS += target qml

OTHER_FILES += $$qml.files
