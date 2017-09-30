const v_to_t = v => Object.prototype.toString.call(v),
    i_to_v = i => _a[i],
    new_v_to_i = v => _a.push(v) - 1,
    v_to_i = (v, t = v_to_t(v)) => (v_to_i_for_t[t] || (() => {
        throw new Error(`type ${t} not in v_to_i_for_t`);
    }))(v);

const BOOLEAN = v_to_t(false),
    NULL = v_to_t(null),
    UNDEFINED = v_to_t(),
    NUMBER = v_to_t(0),
    STRING = v_to_t(""),
    SYMBOL = v_to_t(Symbol.iterator),
    OBJECT = v_to_t({}),
    ARRAY = v_to_t([]);

const nums = {},
    strs = {},
    syms = {},
    _a = [
        ,, null, true, false //1: undefined, 2: null, 3: true, 4: false
    ],
    v_to_i_for_t = {
        [BOOLEAN]: v => v ? 3 : 4, //hard-coded (it's okay, I'm a professional)
        [NULL]: () => 2, //hard-coded
        [UNDEFINED]: () => 1, //hard-coded
        [NUMBER]: v => nums[v] || (nums[v] = new_v_to_i(v)),
        [STRING]: v => strs[v] || (strs[v] = new_v_to_i(v)),
        [SYMBOL]: v => syms[v] || (syms[v] = new_v_to_i(v))
    };

export {
    v_to_t,
    new_v_to_i,
    v_to_i_for_t,
    v_to_i,
    i_to_v,
    BOOLEAN,
    NULL,
    UNDEFINED,
    NUMBER,
    STRING,
    SYMBOL,
    OBJECT,
    ARRAY
};
