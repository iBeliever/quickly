import QtQuick 2.0
import "app.js" as App

Item {
    Component.onCompleted: {
        var person = new App.Person('Michael')
        person.hello() // Prints "Hello, Michael!"

        console.log(JSON.stringify(App.chunky(['A', 'B', 'C', 'D', 'E', 'F', 'G'])))
        console.log(App.urlHost('http://www.google.com'))

        App.getUsers().then(function(users) {
            var name = users[0].name
            console.log('The first user is: ' + name)
        })
    }
}
