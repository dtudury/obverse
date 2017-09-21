import {
    v_to_t,
    new_v_to_i,
    v_to_i,
    i_to_v,
    OBJECT,
    ARRAY
} from "./primitiveStore";

/*
const CHECKOUT = Symbol("create a managed instance of the data");
const PUSH = Symbol("send changes upstream");
const PULL = Symbol("get any upstream changes");
const DIFF = Symbol("changes since PULL")
const COMMIT = Symbol("bundle and label changes since PULL");
const BRANCH = Symbol("create separate data copy");
const MERGE = Symbol("merge current copy's changes to another copy");
*/

const HASH = Symbol("hash as index of value in storage array");
const PARENTS = Symbol("obvs with hashes dependent on current obv");

const objs = {};

const obvize = (object, parent) => {
    const type = v_to_t(object);
    if (type !== ARRAY && type !== OBJECT) {
        throw new Error("obvize must be called on an object or array");
    }
    const hashes = new object.constructor(); //original map
    const deltas = new object.constructor(); //differences
    const values = new object.constructor(); //virtual object
    const parents = new Set(parent ? [parent] : [])
    const proxy = new Proxy(values, {
        get: (target, property, receiver) => {
            switch (property) {
                case HASH:
                    return hash_index;
                case PARENTS:
                    return parents;
                default:
                    //console.log(`get ${property.toString()}`, values[property]);
                    return values[property]
            }
        },

        set: (target, property, value, receiver) => {
            //console.log(`set ${property} to ${value}`);
            const hash_value = hash(value);
            const delta = deltas[property];
            if (hashes[property] === hash_value) {
                if (delta) {
                    //console.log("existing delta?");
                    delete deltas[property];
                    values[propety] = value;
                    if (delta[PARENTS])
                        delta[PARENTS].delete(proxy);
                        //update_dependents();
                    }
                } else {
                if (delta !== hash_value) {
                    //console.log("setting", hashes[property], "to", hash_value);
                    deltas[property] = hash_value;
                    values[property] = value;
                    if (delta && delta[PARENTS]) {
                        delta[PARENTS].add(proxy);
                        //update_dependents();
                    }
                }
            }
            return hash_value;
        }
    })
    Object.keys(object).forEach(name => {
        const value = object[name];
        const type = v_to_t(value);
        let obv;
        if (type === ARRAY || type === OBJECT) {
            values[name] = obvize(value, proxy);
            hashes[name] = values[name][HASH];
        } else {
            values[name] = value;
            hashes[name] = v_to_i(value, type);
        }
    });
    const stringified = JSON.stringify(hashes);
    const hash_index = objs[stringified] || (objs[stringified] = new_v_to_i(proxy));
    return proxy;
};

/*
function checkout(v) {
    return v[CHECKOUT];
}
*/

function hash(v) {
    const type = v_to_t(v);
    if (type !== ARRAY && type !== OBJECT) {
        return v_to_i(v, type);
    } else {
        return v[HASH] || obvize(v)[HASH];
    }
}

export {
    obvize, hash,
    /*checkout,*/
    i_to_v
}
