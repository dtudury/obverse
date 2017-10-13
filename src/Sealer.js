import {v_to_t, OBJECT, ARRAY} from "./primitiveStore";

const BREAKS = Symbol("broken seals");
const MEND = Symbol("unbreak seals");
const DEPENDENTS = Symbol("sealed objects sealing this object");

const seal = (object, t = v_to_t(object)) => {
    if (t !== ARRAY && t !== OBJECT) {
        throw new Error("only objects and arrays can be sealed");
    }
    if (object[DEPENDENTS]) { //already obvized
        return object[MEND];
    }
    const values = new object.constructor(); //virtual object
    let broken_seals = new object.constructor(); //broken seals
    const seal_breakers = new object.constructor(); //watchers for changes in children
    const dependents = new Set(); //watchers for changes in this
    const seal_breaker = (property, child_breaks = true) => {
        dependents.forEach(f => f(broken_seals));
        dependents.clear();
        broken_seals[property] = child_breaks;
    };
    const property_sealer = (property, v, t = v_to_t(v)) => {
        if (t === ARRAY || t === OBJECT) {
            values[property] = seal(v, t);
            seal_breakers[property] = seal_breakers[property] || (child_breaks => seal_breaker(property, child_breaks));
            values[property][DEPENDENTS].add(seal_breakers[property]);
        } else {
            values[property] = v;
        }
    };
    const getter = property => {
        switch (property) {
            case BREAKS:
                return broken_seals;
            case MEND:
                Object.keys(broken_seals).forEach(key => property_sealer(key, values[key]));
                broken_seals = new object.constructor();
                return proxy;
            case DEPENDENTS:
                return dependents;
            default:
                return values[property];
        }
    };
    const setter = (property, value) => {
        if (value !== values[property]) {
            if (values[property] && values[property][DEPENDENTS]) {
                values[property][DEPENDENTS].delete(seal_breakers[property]); //stop watching old value
            }
            if (value && value[DEPENDENTS]) {
                value[DEPENDENTS].add(seal_breakers[property]); //start watching new value
            }
            values[property] = value;
            seal_breaker(property, breaks(value));
        }
        return value;
    };
    const proxy = new Proxy(values, {
        get: (target, property) => getter(property),
        set: (target, property, value) => setter(property, value),
        deleteProperty: (target, property) => !void setter(property)
    });
    Object.keys(object).forEach(key => property_sealer(key, object[key]));
    return proxy;
};

const breaks = v => v && v[BREAKS] || true;

export {seal, breaks};
