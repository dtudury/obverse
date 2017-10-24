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
        const _new_v_to_i = v => _values.push(v) - 1,
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
            _v_to_i_for_t = {
                [BOOLEAN]: v => v ? 3 : 4, //hard-coded (it's okay, I'm a professional)
                [NULL]: () => 2, //hard-coded
                [UNDEFINED]: () => 1, //hard-coded
                [NUMBER]: v => _nums[v] || (_nums[v] = _new_v_to_i(v)),
                [STRING]: v => _strs[v] || (_strs[v] = _new_v_to_i(v)),
                [SYMBOL]: v => _syms[v] || (_syms[v] = _new_v_to_i(v))
            };
        this.indexify = (object, t = v_to_t(object)) => {
            if (t !== ARRAY && t !== OBJECT) {
                return _v_to_i(object, t);
            }
            const index_map = new object.constructor(); //map of pointers to original values
            Object.keys(object).sort().forEach(property => {
                index_map[property] = this.indexify(object[property]);
            });
            const json = JSON.stringify(index_map);
            return _jsons[json] || (_jsons[json] = _new_v_to_i(index_map));
        };
        this.deindexify = i => _values[i];
    }
}
