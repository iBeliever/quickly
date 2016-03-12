import QtQuick 2.3
import QtTest 1.0
import QuickFill 0.1
import "tst_symbol.js" as JSTests

TestCase {
    name: "SymbolTests"

    function test_for_of() {
        JSTests.test_for_of()
    }
}
