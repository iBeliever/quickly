import QtQuick 2.3
import QtTest 1.0
import QuickFill 0.1

TestCase {
    name: "UrlTests"

    function test_parse() {
        var url = Url.parse('http://www.google.com/search?client=opera&q=python')
        compare(url.protocol, "http:")
        compare(url.host, "www.google.com")
        compare(url.pathname, "/search")
        compare(url.query, 'client=opera&q=python')
    }
}
