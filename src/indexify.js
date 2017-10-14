import {v_to_t, v_to_i, new_v_to_i, OBJECT, ARRAY} from "./primitiveStore";

const jsons = {}; //map from json to index of expanded json in storage

const indexify = (object, t = v_to_t(object)) => {
    if (t !== ARRAY && t !== OBJECT) {
        throw new Error("only objects and arrays can be json indexed");
    }
    const index_map = new object.constructor(); //original map
    Object.keys(object).sort().forEach(property => {
        const v = object[property];
        const t = v_to_t(v);
        if (t === ARRAY || t === OBJECT) {
            index_map[property] = indexify(object[property], t);
        } else {
            index_map[property] = v_to_i(v, t);
        }
    });
    const json = JSON.stringify(index_map);
    return jsons[json] || (jsons[json] = new_v_to_i(index_map));
};

export default indexify;
