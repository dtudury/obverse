import {seal, breaks, mend} from "./Sealer";
import Indexifier from "./Indexifier";
const indexifier = new Indexifier();
const indexify = indexifier.indexify;
const deindexify = indexifier.deindexify;

const _logs = new WeakMap();

const init = (state = {}) => {
    const sealed_state = seal(state);
    const index = indexify(state);
    _logs.set(sealed_state, [index]);
    return sealed_state;
};

const _clone = obj => Object.assign(new obj.constructor(), obj);

const _patch_index = (value_map, break_map, index_map_index) => {
    const index_map= _clone(deindexify(index_map_index));
    Object.keys(break_map).forEach(name => {
        const v = value_map[name];
        const b = break_map[name];
        const i = index_map[name];
        if (v === undefined) {
            delete index_map[name];
        } else if (b === true) {
            index_map[name] = indexify(v);
        } else {
            index_map[name] = _patch_index(v, b, i);
        }
    });
    return indexify(index_map);
};

const commit = sealed_state => {
    const log = _logs.get(sealed_state);
    const break_map = breaks(sealed_state);
    const index_map_index = log[0];
    const index = _patch_index(sealed_state, break_map, index_map_index);
    log.unshift(index);
    return sealed_state;
};

const log = sealed_state => {
    return _logs.get(sealed_state);
};


export {seal, breaks, mend, indexify, deindexify, init, commit, log};
