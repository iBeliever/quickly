import QtQuick 2.3
import QtTest 1.0
import Quickly 0.1

TestCase {
    name: "FilesystemTests"

    function test_readFile_valid_file_works() {
        compare(Filesystem.readFileSync(Qt.resolvedUrl("../assets/sample_file.txt")), "Sample File\n")
    }

    function test_readFile_no_file_throws_exception() {
        try {
            Filesystem.readFileSync("missing_file.txt")
            fail("An error should have been thrown!")
        } catch (error) {
            compare(error.message, "File does not exist or is not readable: missing_file.txt")
        }
    }

    function test_writeFile() {
        Filesystem.writeFileSync(Qt.resolvedUrl("out_file.txt"), "OUTPUT")

        compare(Filesystem.readFileSync(Qt.resolvedUrl("out_file.txt")), "OUTPUT")
    }

    function test_watch_file() {
        var filename = Qt.resolvedUrl("out_file.txt")
        var watcher = Filesystem.watch(filename)
        var event = null

        watcher.on("change", function(type, filename) {
            event = { type: type, filename: filename}
        })

        Filesystem.writeFileSync(filename, "OUTPUT")

        wait(1000);
        verify(event != null, "The event should have been emitted");
        compare(event.type, "change")
        compare(event.filename, filename.substring(7))
    }
}
