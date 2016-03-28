include(qmlify.pri)

QT += core-private qml qml-private

HEADERS += $$PWD/plugin.h \
           $$PWD/nodejs/filesystem.h \
           $$PWD/nodejs/path.h \
           $$PWD/nodejs/process.h \
           $$PWD/nodejs/basemodule.h

SOURCES += $$PWD/plugin.cpp \
           $$PWD/nodejs/filesystem.cpp \
           $$PWD/nodejs/path.cpp \
           $$PWD/nodejs/process.cpp \
           $$PWD/nodejs/basemodule.cpp

RESOURCES += $$PWD/resources.qrc
