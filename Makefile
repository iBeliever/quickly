QML_DIR = $(shell qmake -query QT_INSTALL_QML)/QuickFill
DEST_DIR = /usr/local/bin

.PHONY: build install check example

build:
	./qmlify --no-polyfills -o build src

install: build
	mkdir -p $(QML_DIR)
	cp -r build/* package.yml $(QML_DIR)
	cp qmlify $(DEST_DIR)

check_qmlify:
	python3 tests/qmlify/tests.py

check_polyfills: install
	./qmlify -o tests/polyfills/build tests/polyfills
	qmltestrunner -input tests/polyfills/build

check: check_qmlify check_polyfills
