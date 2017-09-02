import {
    v_to_t,
    new_v_to_i,
    v_to_i_for_t,
    v_to_i,
    i_to_v,
    BOOLEAN,
    NULL,
    UNDEFINED,
    NUMBER,
    STRING,
    SYMBOL,
    OBJECT,
    ARRAY
} from "./primitiveStore";

const CHECKOUT = Symbol("create a managed instance of the data");
const PUSH = Symbol("send changes upstream");
const PULL = Symbol("get any upstream changes");
const DIFF = Symbol("changes since PULL")
const COMMIT = Symbol("bundle and label changes since PULL");
const BRANCH = Symbol("create separate data copy");
const MERGE = Symbol("merge current copy's changes to another copy");

const objs = {};

const v_to_i_for_obj = v => {
    const n = JSON.stringify(v);
    return objs[n] || (objs[n] = new_v_to_i(v));
};

v_to_i_for_t[OBJECT] = v_to_i_for_obj;
v_to_i_for_t[ARRAY] = v_to_i_for_obj;

function hash(o) {
    Object.keys(o).forEach(n => {
        const v = o[n];
        const t = v_to_t(v);
        if (t === ARRAY) {
            o[n] = hash(v);
        } else if (t === OBJECT) {
            o[n] = hash(v);
        } else {
            o[n] = v_to_i(v, t);
        }
    });
    return v_to_i(o);
}

function clone(o) {
    let diff = {};
    return new Proxy(o, {
        get: (target, property, receiver) => {
            console.log(`get ${property}`);
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
        set: (target, property, value, receiver) => {
            console.log(`set ${property} to ${value}`);
            return o[property] = value
        }
    })
}

function checkout(p) {
    return p[CHECKOUT];
}

export {
    hash,
    CHECKOUT,
    PUSH,
    PULL,
    DIFF,
    COMMIT,
    BRANCH,
    MERGE,
    clone,
    checkout
}
