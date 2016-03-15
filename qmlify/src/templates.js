export const requireFunction = `function require(qualifier) {
    return qualifier.module ? qualifier.module.exports : qualifier
}\n`
