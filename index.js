const nestedpushdata = require('./src/nestedpushdata')

const simpleJson = {a: "b"}
console.log(simpleJson)
const simpleScript = nestedpushdata.scriptify(simpleJson)
console.log(simpleScript)
const retrievedSimple = nestedpushdata.unscriptify(simpleScript)
console.log(retrievedSimple)

const simpleOpReturn = nestedpushdata.putData(simpleScript)
console.log(simpleOpReturn)

const complexJson = {a:{b:{c: "d", e: 9}}}
console.log(complexJson)
const complexScript = nestedpushdata.scriptify(complexJson)
console.log(complexScript)
const retrievedComplex = nestedpushdata.unscriptify(complexScript)
console.log(retrievedComplex)
