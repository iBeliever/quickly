import QtQuick 2.4
import QtTest 1.0
import Quickly 0.1

TestCase {
    name: "TimeoutTests"

    function test_setTimeput() {
        var success = false

        Polyfills.setTimeout(function(callback) {
            success = true
        }, 10)

        wait(20);
        verify(success)
    }
}
