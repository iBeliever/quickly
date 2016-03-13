import QtQuick 2.4
import QtTest 1.0
import QuickFill 0.1

TestCase {
    name: "PromiseTests"

    function test_promise_resolve() {
        var success = null

        new Promise.Promise(function(resolve, reject) {
            resolve()
        }).then(function() {
            success = true
        }).catch(function() {
            success = false
        })

        wait(50);
        compare(success, true, "Promise failed to resolve");
    }

    function test_promise_reject() {
        var failure = null

        new Promise.Promise(function(resolve, reject) {
            reject()
        }).then(function() {
            failure = false
        }).catch(function() {
            failure = true
        })

        wait(50);
        compare(failure, true, "Promise failed to reject");
    }
}
