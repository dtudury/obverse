const {
    toType,
    store,
    referencers,
    reference,
    dereference,
    BOOLEAN,
    NULL,
    UNDEFINED,
    NUMBER,
    STRING,
    SYMBOL
} = require("./primitiveStore");

const CHECKOUT = Symbol("create a managed instance of the data");
const PUSH = Symbol("send changes upstream");
const PULL = Symbol("get any upstream changes");
const DIFF = Symbol("changes since PULL")
const COMMIT = Symbol("bundle and label changes since PULL");
const BRANCH = Symbol("create separate data copy");
const MERGE = Symbol("merge current copy's changes to another copy");

function clone(o) {
    let diff = {};
    return new Proxy(o, {
        get: (target, propety, receiver) => {
            return {
                [CHECKOUT]: () => {},
                [PUSH]: () => {},
                [PULL]: () => {},
                [DIFF]: () => {
                    return diff;
                },
                [COMMIT]: () => {},
                [BRANCH]: () => {},
                [MERGE]: () => {}
            }[property] || o[property];
        },
        set: (target, property, value, receiver) => {}
    })
}

function checkout(p) {
    return p[CHECKOUT];
}
