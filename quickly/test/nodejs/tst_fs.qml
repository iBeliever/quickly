import QtQuick 2.3
import QtTest 1.0
import Quickly 0.1

TestCase {
    name: "FileSystemTests"

    function test_readFile_valid_file_works() {
        compare(FileSystem.readFile(Qt.resolvedUrl("../assets/sample_file.txt")), "Sample File\n")
    }

    function test_readFile_no_file_throws_exception() {
        try {
            FileSystem.readFile("missing_file.txt")
            fail("An error should have been thrown!")
        } catch (error) {
            compare(error.message, "File does not exist or is not readable: missing_file.txt")
        }
    }
}
