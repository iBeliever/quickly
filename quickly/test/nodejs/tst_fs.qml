import QtQuick 2.3
import QtTest 1.0
import Quickly 0.1

TestCase {
    name: "FilesystemTests"

    function test_readFile_valid_file_works() {
        compare(Filesystem.readFile(Qt.resolvedUrl("../assets/sample_file.txt")), "Sample File\n")
    }

    function test_readFile_no_file_throws_exception() {
        try {
            Filesystem.readFile("missing_file.txt")
            fail("An error should have been thrown!")
        } catch (error) {
            compare(error.message, "File does not exist or is not readable: missing_file.txt")
        }
    }
}
