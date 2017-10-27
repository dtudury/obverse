import {OBJECT, ARRAY} from "./Types";

const init = (HEAD, indexifier) => {
    const {toIndex, toValue, toType} = indexifier;
    const hash_tree = toValue(HEAD);
    const type = toType(HEAD);
    if (type !== OBJECT && type !== ARRAY) {
        return hash_tree;
    }
    const virtual_tree = new hash_tree.constructor();
    let working_tree = null;

    const get = (target, property) => {
        if (!hash_tree[property]) return null;
        return (working_tree && working_tree[property]) || virtual_tree[property] || (virtual_tree[property] = toValue(hash_tree[property]));
    };
    const set = (target, property, value) => {
        (working_tree || (working_tree = new hash_tree.constructor()))[property] = value;
    };
    const deleteProperty = (target, property) => {
        console.log(property);
    };

    return new Proxy(virtual_tree, {get, set, deleteProperty});
};

export {init};
