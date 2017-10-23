import {v_to_t, OBJECT, ARRAY} from "./primitiveStore";

const BREAKS = Symbol("get map of broken seals");
const MEND = Symbol("unbreak seals, get self");
const DETACH = Symbol("stop informing dependent");

const seal = (object, t = v_to_t(object), dependent = () => {}) => {
    if (t !== ARRAY && t !== OBJECT) {
        throw new Error("only objects and arrays can be sealed");
    }
    const values = new object.constructor(); //virtual object
    let broken_seals = null; //broken seals
    const break_seal = (property, child_breaks = true) => {
        broken_seals = broken_seals || new object.constructor();
        broken_seals[property] = child_breaks;
        dependent(broken_seals);
    };
    const seal_property = (property, v, t = v_to_t(v)) => {
        if (t === ARRAY || t === OBJECT) {
            values[property] = seal(v, t, child_breaks => break_seal(property, child_breaks));
        } else {
            values[property] = v;
        }
    };
    const getter = property => {
        switch (property) {
            case BREAKS:
                return broken_seals;
            case MEND:
                if (broken_seals) {
                    Object.keys(broken_seals).forEach(key => {
                        if (values[key] === undefined) {
                            delete values[key];
                        } else if (broken_seals[key] === true) {
                            seal_property(key, values[key]);
                        }
                    });
                    broken_seals = null;
                }
                return proxy;
            case DETACH:
                return dependent = () => {};
            default:
                return values[property];
        }
    };
    const setter = (property, value) => {
        if (value !== values[property]) {
            values[property] && values[property][DETACH];
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
