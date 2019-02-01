const bsv = require('bsv')
const Stack = require('./stack')

function scriptify(collection) {
    const s = new bsv.Script()
    if (Array.isArray(collection)) {
        collection.forEach(val => { push(s, null, val) })
    } else {
        if (typeof collection === "object") {
            Object.keys(collection).forEach(key => { push(s, key, collection[key]) })
        }
    }
    return s
}

function push(s, k, v) {
    if( v !== null && Array.isArray(v) ) {
        v.forEach(value => { push(s, k, value) })
        s.add("OP_DROP")
    } else {
        if( v !== null && typeof v === "object" ) {
            s.add(new Buffer(k))
            Object.entries(v).forEach(([key, value]) => {
                push(s, key, value)
            })
            s.add("OP_DROP")
    }
    else {
        if (k != null) {
            s.add(new Buffer(k)).add("OP_DROP")
        }
        s.add(new Buffer(v)).add("OP_DROP")  
    }
    }
}

function unscriptify(s) {
    const stack = new Stack()
    let isreadingkey = true
    let issamelevel = false
    for (i = 0; i < s.chunks.length; i++)
    {
        let item = s.chunks[i]
        let next = s.chunks[i+1]
        if (isreadingkey) {
            if (isDrop(item)) {
                stack.pop()
            } else {
                stack.currentkey = item.buf.toString()
                if (!issamelevel && !isDrop(item)) {
                    stack.newLevel()
                }
                else {
                    stack.set(null)
                }
                isreadingkey = !isDrop(next)
                //TODO: assert next item is drop
                if (!isreadingkey) {
                    i++
                }
            }
        } else {
            if (issamelevel || isDrop(next)) {
                stack.set(item.buf.toString())
                isreadingkey = isDrop(next)
                issamelevel = isDrop(next)
            }
            else {
                stack.newLevel()
            }
            i++
        }
        //console.log(stack.stack)
    }
    if (stack.stack.length > 1) {
        throw "Stack should only have one item after unscriptify"
    }
    return stack.top()
}

function isDrop(item) {
    return item.opcodenum === 117
}

module.exports = {scriptify, unscriptify}
