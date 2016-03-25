import _ from 'lodash'

const CHUNK_SIZE = 3

export class Person {
    constructor(name) {
        this.name = name
    }

    hello() {
        console.log(`Hello, ${this.name}!`)
    }
}

export function chunky(array) {
    return _.chunk(array, CHUNK_SIZE)
}
