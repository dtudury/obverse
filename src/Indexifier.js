import {
    v_to_t,
    BOOLEAN,
    NULL,
    UNDEFINED,
    NUMBER,
    STRING,
    SYMBOL,
    OBJECT,
    ARRAY
} from "./Types";

export default class {
    constructor() {
        const _new_v_to_i = (v, t) => {
                _types.push(t);
                return _values.push(v) - 1;
            },
            _v_to_i = (v, t = v_to_t(v)) => (_v_to_i_for_t[t] || (() => {
                throw new Error(`type ${t} not in _v_to_i_for_t`);
            }))(v);
        const _nums = {},
            _strs = {},
            _syms = {},
            _jsons = {},
            _values = [
                undefined, undefined, null, true, false //1: undefined, 2: null, 3: true, 4: false
            ],
            _types = [
                UNDEFINED, UNDEFINED, NULL, BOOLEAN, BOOLEAN
            ],
            _v_to_i_for_t = {
                [BOOLEAN]: v => v ? 3 : 4, //hard-coded (it's okay, I'm a professional)
                [NULL]: () => 2, //hard-coded
                [UNDEFINED]: () => 1, //hard-coded
                [NUMBER]: v => _nums[v] || (_nums[v] = _new_v_to_i(v, NUMBER)),
                [STRING]: v => _strs[v] || (_strs[v] = _new_v_to_i(v, STRING)),
                [SYMBOL]: v => _syms[v] || (_syms[v] = _new_v_to_i(v, SYMBOL))
            };
        this.toIndex = (object, t = v_to_t(object)) => {
            if (t !== ARRAY && t !== OBJECT) {
                return _v_to_i(object, t);
            }
            const index_map = new object.constructor(); //map of pointers to original values
            Object.keys(object).sort().forEach(property => {
                index_map[property] = this.toIndex(object[property]);
            });
            const json = JSON.stringify(index_map);
            return _jsons[json] || (_jsons[json] = _new_v_to_i(index_map, t));
        };
        this.toValue = i => _values[i];
        this.toType = i => _types[i];
        this.values = () => _values;
    }
}
