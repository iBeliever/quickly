QT += qml quick quick_private

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

RESOURCES += $$PWD/resources.qrc
