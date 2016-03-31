import QtQuick 2.3
import QtTest 1.0
import Quickly 0.1

TestCase {
    name: "EventsTests"

    function test_event_emitted() {
        var eventListener = new Events.EventEmitter()
        var called = false

        eventListener.on("testEvent", function() {
            called = true
        })

        eventListener.emit("testEvent")

        verify(called, "The event should be emitted")
    }
}
