import QtQuick 2.4
import QtTest 1.0
import Quickly 0.1

TestCase {
    name: "HttpTests"

    function test_getgoogle() {

        var html = null;

        Http.fetch("http://www.google.com")
            .then(function(response) {
                html = response.text()
            }).catch(function(error) {
                console.log(error)
            });

        for (var i = 0; i < 100 && html == null; i++)
            wait(100)

        verify(html !== null, "failed to get url")
    }
}
