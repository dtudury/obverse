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
const PARENTS = Symbol("obvs with hashes dependent on current obv");

const objs = {};
const v_to_i_for_obj = v => {
    const n = JSON.stringify(v);
    return objs[n] || (objs[n] = new_v_to_i(v));
};
Object.assign(v_to_i_for_t, {
    [OBJECT]: v_to_i_for_obj,
    [ARRAY]: v_to_i_for_obj
});

const obvize = (o, parent) => {
    const t = v_to_t(o);
    if (t !== ARRAY && t !== OBJECT) {
        return v_to_i(o, t);
    }
    const m = new o.constructor(); //original map
    const d = new o.constructor(); //differences
    const parents = new Set(parent ? [parent] : [])
    const p = new Proxy(m, {
        get: (target, property, receiver) => {
            //console.log(`get ${property.toString()}`);
            return {
                [HASH]: i,
                [PARENTS]: parents
            }[property] || i_to_v(d[property] || m[property]);
        },
        set: (target, property, value, receiver) => {
            //console.log(`set ${property} to ${value}`);
            const h = hash(value);
            const change = d[property];
            if (m[property] === h) {
                if (change) {
                    console.log("existing change?");
                    delete d[property];
                    if (change[PARENTS]) change[PARENTS].delete(p);
                    //update_dependents();
                }
            } else {
                if (change !== h) {
                    console.log("setting", m[property], "to", h);
                    d[property] = h;
                    if (change && change[PARENTS]) change[PARENTS].add(p);
                    //update_dependents();
                }
            }
            return h;
        }
    })
    Object.keys(o).forEach(n => {
        const v = o[n];
        const t = v_to_t(v);
        if (t === ARRAY) {
            m[n] = obvize(v, p);
        } else if (t === OBJECT) {
            m[n] = obvize(v, p);
        } else {
            m[n] = v_to_i(v, t);
        }
    });
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
