const v_to_t = v => Object.prototype.toString.call(v);
const BOOLEAN = v_to_t(false),
    NULL = v_to_t(null),
    UNDEFINED = v_to_t(),
    NUMBER = v_to_t(0),
    STRING = v_to_t(""),
    SYMBOL = v_to_t(Symbol.iterator),
    OBJECT = v_to_t({}),
    ARRAY = v_to_t([]);

export {
    v_to_t,
    BOOLEAN,
    NULL,
    UNDEFINED,
    NUMBER,
    STRING,
    SYMBOL,
    OBJECT,
    ARRAY
};
