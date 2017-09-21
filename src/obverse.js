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
const STRING = Symbol("json object with indexes instead of values");
const PARENTS = Symbol("obvs with hashes dependent on current obv");

const objs = {};

function hash(value) {
    const type = v_to_t(value);
    if (type !== ARRAY && type !== OBJECT) {
        return v_to_i(value, type);
    } else {
        return value[HASH] || obvize(value)[HASH];
    }
}

const indexify = proxy => objs[proxy[STRING]] || (objs[proxy[STRING]] = new_v_to_i(proxy));

const obvize = (object, parent) => {
    const type = v_to_t(object);
    if (type !== ARRAY && type !== OBJECT) {
        throw new Error("obvize must be called on an object or array");
    }
    const hashes = new object.constructor(); //original map
    const deltas = new object.constructor(); //differences
    const values = new object.constructor(); //virtual object
    const parents = new Set(parent ? [parent] : [])
    const getter = property => {
        switch (property) {
            case HASH:
                return hash_index;
            case STRING:
                return JSON.stringify(hashes);
            case PARENTS:
                return parents;
            default:
                //console.log(`get ${property.toString()}`, values[property]);
                return values[property]
        }
    };
    const setter = (property, value) => {
        console.log(`set ${property} to ${value}`);
        if (value !== values[property]) {
            if (values[property] && values[property][PARENTS]) {
                values[property][PARENTS].delete(proxy);
            }
            values[property] = value;
            if (values[property] && values[property][PARENTS]) {
                values[property][PARENTS].add(proxy);
            }
            const hash_value = hash(value);
            if (hashes[property] === hash_value) {
                delete deltas[property];
            } else {
                deltas[property] = hash_value;
            }
            let new_hash = indexify(proxy);
            console.log(new_hash)
        }
        return value;
    };
    const proxy = new Proxy(values, {
        get: (target, property, receiver) => getter(property),
        set: (target, property, value, receiver) => setter(property, value),
        deleteProperty: (target, property) => {
            setter(property);
            return true;
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
    let hash_index = indexify(proxy);
    return proxy;
};

/*
function checkout(value) {
    return value[CHECKOUT];
}
*/

export {
    obvize, hash,
    /*checkout,*/
    i_to_v
}
