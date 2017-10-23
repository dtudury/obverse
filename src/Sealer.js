import {v_to_t, OBJECT, ARRAY} from "./primitiveStore";

const BREAKS = Symbol("get map of broken seals");
const MEND = Symbol("unbreak seals, get self");

let default_dependent = broken_seals => {
    //console.log("default_dependent: ", broken_seals);
    return broken_seals;
};

const seal = (object, t = v_to_t(object), dependent = default_dependent) => {
    if (t !== ARRAY && t !== OBJECT) {
        throw new Error("only objects and arrays can be sealed");
    }
    const values = new object.constructor(); //virtual object
    const seal_breakers = new object.constructor(); //watchers for changes in children
    let broken_seals = new object.constructor(); //broken seals
    const break_seal = (property, child_breaks = true) => {
        broken_seals[property] = child_breaks;
        dependent(broken_seals);
        delete seal_breakers[property];
    };
    const seal_property = (property, v, t = v_to_t(v)) => {
        if (t === ARRAY || t === OBJECT) {
            seal_breakers[property] = seal_breakers[property] || (child_breaks => break_seal(property, child_breaks));
            values[property] = seal(v, t, seal_breakers[property]);
        } else {
            values[property] = v;
        }
    };
    const getter = property => {
        switch (property) {
            case BREAKS:
                return broken_seals;
            case MEND:
                Object.keys(broken_seals).forEach(key => {
                    seal_property(key, values[key]);
                });
                broken_seals = new object.constructor();
                return proxy;
            default:
                return values[property];
        }
    };
    const setter = (property, value) => {
        if (value !== values[property]) {
            values[property] = value;
            break_seal(property);
        }
        return value;
    };
    const proxy = new Proxy(values, {
        get: (target, property) => getter(property),
        set: (target, property, value) => setter(property, value),
        deleteProperty: (target, property) => !void setter(property)
    });
    Object.keys(object).forEach(key => seal_property(key, object[key]));
    return proxy;
};

const breaks = v => v && v[BREAKS];
const mend = v => v && v[MEND];

export {seal, breaks, mend};
