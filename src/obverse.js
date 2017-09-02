import {
    v_to_t,
    new_v_to_i,
    v_to_i_for_t,
    v_to_i,
    i_to_v,
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

const HASH = Symbol("hash as index of value in storage array");

const objs = {};
const v_to_i_for_obj = v => {
    const n = JSON.stringify(v);
    return objs[n] || (objs[n] = new_v_to_i(v));
};
Object.assign(v_to_i_for_t, {
    [OBJECT]: v_to_i_for_obj,
    [ARRAY]: v_to_i_for_obj
});

const o_to_m = o => {
    const m = new o.constructor();
    Object.keys(o).forEach(n => {
        const v = o[n];
        const t = v_to_t(v);
        if (t === ARRAY) {
            m[n] = obvize(v);
        } else if (t === OBJECT) {
            m[n] = obvize(v);
        } else {
            m[n] = v_to_i(v, t);
        }
    });
    return m;
};

const obvize = o => {
    const m = o_to_m(o);
    const d = new o.constructor(); //differences
    const p = new Proxy(m, {
        get: (target, property, receiver) => {
            console.log(`get ${property.toString()}`);
            return {
                [HASH]: i
            }[property] || i_to_v(d[property] || m[property]);
        },
        set: (target, property, value, receiver) => {
            console.log(`set ${property} to ${value}`);
            const h = hash(value);
            if (m[property] === h) {
                delete d[property];
            } else {
                d[property] = h;
            }
            return h;
        }
    })
    const i = v_to_i(p);
    return i;
};

function checkout(p) {
    return p[CHECKOUT];
}

function hash(p) {
    return p[HASH] || obvize(p);
}

export {
    obvize,
    hash,
    checkout,
    i_to_v
}
