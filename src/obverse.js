import {v_to_t, new_v_to_i, v_to_i, OBJECT, ARRAY} from "./primitiveStore";

const _stringifieds = {}; //map to hashes (the index in the storage array)
const _stringified_to_i = v => _stringifieds[v] || (_stringifieds[v] = new_v_to_i(v));
const _primitive_to_i = (v, t = v_to_t(v)) => (t === ARRAY || t === OBJECT) ? false : v_to_i(v, t);

const HASH = Symbol("hash as index of value in storage array");
const COMMIT = Symbol("recalculate hash");
const DEPENDENTS = Symbol("obvs with hashes dependent on current obv");

const obvize = (object, dependent, t = v_to_t(object)) => {
    if (t !== ARRAY && t !== OBJECT) {
        throw new Error("obvize must be called on an object or array");
    }
    if (object[DEPENDENTS]) { //already obvized
        object[DEPENDENTS].add(dependent);
        return object;
    }
    const hashes = new object.constructor(); //original map
    const values = new object.constructor(); //virtual object
    const observers = new object.constructor(); //watchers for changes in children
    const dependents = new Set(dependent ? [dependent] : []); //watchers for changes in this
    const touches = new Set(); //possibly changed attributes (we'll double-check later)
    const toucher = property => {
        if (!touches.size) {
            dependents.forEach(f => f());
        }
        touches.add(property);
    };
    const getter = property => {
        switch (property) {
            case HASH:
                return hash_index;
            case COMMIT:
                Array.from(touches).forEach(touch => hashes[touch] = commit(proxy[touch]));
                touches.clear();
                return hash_index = _stringified_to_i(JSON.stringify(hashes));
            case DEPENDENTS:
                return dependents;
            default:
                return values[property];
        }
    };
    const setter = (property, value) => {
        if (value !== values[property]) {
            if (values[property] && values[property][DEPENDENTS]) {
                values[property][DEPENDENTS].delete(observers[property]);
            }
            values[property] = value;
            if (values[property] && values[property][DEPENDENTS]) {
                values[property][DEPENDENTS].add(observers[property]);
            }
            toucher(property);
        }
        return value;
    };
    const deleter = property => !void setter(property);
    const proxy = new Proxy(values, {
        get: (target, property) => getter(property),
        set: (target, property, value) => setter(property, value),
        deleteProperty: (target, property) => !void setter(property)
    });
    Object.keys(object).forEach(property => {
        const v = object[property];
        const t = v_to_t(v);
        if (t === ARRAY || t === OBJECT) {
            observers[property] = () => toucher(property); //on change just mark property as "touched"
            values[property] = obvize(v, observers[property], t);
            hashes[property] = values[property][HASH];
        } else {
            values[property] = v;
            hashes[property] = v_to_i(v, t);
        }
    });
    let hash_index = _stringified_to_i(JSON.stringify(hashes));
    return proxy;
};
const hash = (v, t = v_to_t(v)) => _primitive_to_i(v, t) || v[HASH] || obvize(v, null, t)[HASH]
const commit = (v, t = v_to_t(v)) => _primitive_to_i(v, t) || v[COMMIT];

export {obvize, hash, commit};
