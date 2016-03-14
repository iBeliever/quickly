QML_DIR = $(shell qmake -query QT_INSTALL_QML)/QuickFill
DEST_DIR = /usr/local/bin

.PHONY: build install check example

build:
	./qmlify --no-polyfills -o build src
	# Apply patches as necessary
	-patch -N build/dependencies/querystring/decode.js patches/querystring_decode.patch

install: build
	mkdir -p $(QML_DIR)
	cp -r build/* src/qmldir package.yml $(QML_DIR)
	cp qmlify $(DEST_DIR)

check_qmlify:
	python3 tests/qmlify/tests.py

check_polyfills: install
	./qmlify -o tests/polyfills/build tests/polyfills
	qmltestrunner -input tests/polyfills/build

check_core: install
	./qmlify -o tests/core/build tests/core
	qmltestrunner -input tests/core/build

check: check_qmlify check_polyfills check_core
