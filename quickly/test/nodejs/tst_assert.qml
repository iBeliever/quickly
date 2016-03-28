import QtQuick 2.3
import QtTest 1.0
import Quickly 0.1

TestCase {
    name: "AssertTests"

    function test_assert_ok_when_true() {
        Assert.ok(true)
    }

    function test_assert_ok_when_false_throws_exception() {
        try {
            Assert.fail(true)
            fail("An error should have been thrown!")
        } catch (error) {
            // Do nothing
        }
    }
}
