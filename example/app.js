import _ from 'lodash'

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
