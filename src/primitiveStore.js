let toType = v => Object.prototype.toString.call(v);
let i_to_v = i => _a[i];
let v_to_i = (v, _) => (referencers[_ = toType(v)] || default_referencer)(v, _);
let store = v => _a.push(v) - 1;
let basic_referencer = (v, type) => _o[type][v] || (_o[type][v] = store(v));
let default_referencer = (v, type) => {
    if (!_o[type]) {
        console.warn(`first use of unhandled type ${type}.`);
        _o[type] = {};
    }
    return basic_referencer(v, type);
};

const BOOLEAN =     toType(false);
const NULL =        toType(null);
const UNDEFINED =   toType();
const NUMBER =      toType(0);
const STRING =      toType("");
const SYMBOL =      toType(Symbol.iterator);

let _o = {
    [NUMBER]: {},
    [STRING]: {},
    [SYMBOL]: {}
};
let _a = [ , null, true, false];    //0: undefined, 1: null, 2: true, 3: false

let referencers = {
    [BOOLEAN]:      v => v ? 2 : 3, //hard-coded (it's okay, I'm a professional)
    [NULL]:         () => 1,        //hard-coded
    [UNDEFINED]:    () => 0,        //hard-coded
    [NUMBER]:       basic_referencer,
    [STRING]:       basic_referencer,
    [SYMBOL]:       basic_referencer
}

export {
    toType,
    store,
    referencers,
    v_to_i,
    i_to_v,
    BOOLEAN,
    NULL,
    UNDEFINED,
    NUMBER,
    STRING,
    SYMBOL
};
