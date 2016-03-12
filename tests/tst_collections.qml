import QtQuick 2.3
import QtTest 1.0
import QuickFill 0.1

TestCase {
    name: "CollectionsTests"

    function test_set() {
        var set = new Pollyfills.Set()
        set.add(4)
        set.add(5)
        set.add(4)

        compare(set.size, 2)
    }

    function test_array_from_string() {
        var array = Array.from('foo')

        compare(array, ['f', 'o', 'o'])
    }
}
