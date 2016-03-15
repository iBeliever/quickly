import _ from 'lodash'
import url from 'url'

export class Person {
    constructor(name) {
        this.name = name
    }

    hello() {
        console.log(`Hello, ${this.name}!`)
    }
}

export function chunky(array) {
    return _.chunk(array, 3)
}

export function urlHost(url) {
    const data = url.parse(url)
    return data.host
}

export function getUsers() {
    return fetch('http://jsonplaceholder.typicode.com/users')
        .then(response => response.json())
}
