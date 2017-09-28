import {
    v_to_t,
    new_v_to_i,
    v_to_i,
    i_to_v,
    OBJECT,
    ARRAY
} from "./primitiveStore";

const HASH = Symbol("hash as index of value in storage array");
const COMMIT = Symbol("recalculate hash");
const STRING = Symbol("json object with indexes instead of values");
const DEPENDENTS = Symbol("obvs with hashes dependent on current obv");

const objs = {};
const indexify = proxy => objs[proxy[STRING]] || (objs[proxy[STRING]] = new_v_to_i(proxy));
const _basic_hash = (value, type = v_to_t(value)) => (type === ARRAY || type === OBJECT) ? false : v_to_i(value, type);
const hash = (value, type = v_to_t(value)) => _basic_hash(value, type) || value[HASH] || obvize(value, type)[HASH]
const commit = (value, type = v_to_t(value)) => _basic_hash(value, type) || value[COMMIT];

const obvize = (object, type = v_to_t(object), dependent) => {
    if (type !== ARRAY && type !== OBJECT) {
        throw new Error("obvize must be called on an object or array");
    }
    const hashes = new object.constructor(); //original map
    const values = new object.constructor(); //virtual object
    const observers = new object.constructor(); //watching for changes in children
    const dependents = new Set(dependent ? [dependent] : []);
    const touches = new Set();
    let touched = false;
    const touch = property => {
        touches.add(property);
        if (!touched) {
            touched = true;
            dependents.forEach(f => f());
        }
    };
    const getter = property => {
        switch (property) {
            case HASH:
                return hash_index;
            case COMMIT:
                Array.from(touches).forEach(touch => hashes[touch] = commit(proxy[touch]));
                touches.clear();
                touched = false;
                return hash_index = indexify(proxy);
            case STRING:
                return JSON.stringify(hashes);
            case DEPENDENTS:
                return dependents;
            default:
                //console.log(`get ${property.toString()}`, values[property]);
                return values[property];
        }
    };
    const setter = (property, value) => {
        //console.log(`set ${property} to ${value}`);
        if (value !== values[property]) {
            if (values[property] && values[property][DEPENDENTS]) {
                values[property][DEPENDENTS].delete(proxy);
            }
            values[property] = value;
            if (values[property] && values[property][DEPENDENTS]) {
                values[property][DEPENDENTS].add(proxy);
            }
            touch(property);
        }
        return value;
    };
    const deleter = property => void setter(property) || true;
    const proxy = new Proxy(values, {
        get: (target, property) => getter(property),
        set: (target, property, value) => setter(property, value),
        deleteProperty: (target, property) => deleter(property)
    });
    Object.keys(object).forEach(name => {
        const value = object[name];
        const type = v_to_t(value);
        if (type === ARRAY || type === OBJECT) {
            observers[name] = () => touch(name);
            values[name] = obvize(value, type, observers[name]);
            hashes[name] = values[name][HASH];
        } else {
            values[name] = value;
            hashes[name] = v_to_i(value, type);
        }
    });
    let hash_index = indexify(proxy);
    return proxy;
};

export {obvize, hash, commit, i_to_v};
