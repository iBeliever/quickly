INSTALL_DIR = $(shell qmake -query QT_INSTALL_QML)/QuickFill

.PHONY: build install check example

build:
	qmlify --no-pollyfills src build

install: build
	mkdir -p $(INSTALL_DIR)
	cp build/* $(INSTALL_DIR)

check: install
	qmlify tests tests/build
	qmltestrunner -input tests/build
