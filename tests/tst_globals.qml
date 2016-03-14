import QtQuick 2.3
import QtTest 1.0
import QuickFill 0.1
import "tst_globals.js" as JSTests

TestCase {
    name: "GlobalTests"

    function test_dirname() {
        console.log(JSTests.get_dirname())
        verify(JSTests.get_dirname() !== '')
    }

    function test_filename() {
        console.log(JSTests.get_filename())
        verify(JSTests.get_filename() !== '')
    }
}
