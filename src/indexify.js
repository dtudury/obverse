import {v_to_t, v_to_i, new_v_to_i, OBJECT, ARRAY} from "./primitiveStore";

const jsons = {}; //map from json to index of expanded json in storage

const indexify = (object, t = v_to_t(object)) => {
    if (t !== ARRAY && t !== OBJECT) {
        return v_to_i(object, t);
    }
    const index_map = new object.constructor(); //map of pointers to original values
    Object.keys(object).sort().forEach(property => {
        index_map[property] = indexify(object[property]);
    });
    const json = JSON.stringify(index_map);
    return jsons[json] || (jsons[json] = new_v_to_i(index_map));
};

export default indexify;
