import { OBJECT, ARRAY } from "./Types";

const DEPENDENTS = Symbol("collection of observers");
const COMMIT = Symbol("commit changes");

const _unset_value = (tree, watcher, property) => {
    if (tree.hasOwnProperty(property)) {
        if (tree[property] && tree[property][DEPENDENTS]) {
            tree[property][DEPENDENTS].delete(watcher);
        }
    }
};

const _set_value = (tree, watcher, property, value) => {
    tree[property] = value;
    if (value && value[DEPENDENTS]) {
        value[DEPENDENTS].add(watcher);
    }
};

const init = (HEAD, indexifier) => {
    const { toIndex, toValue, toType } = indexifier;
    const hash_tree = toValue(HEAD);
    const type = toType(HEAD);
    if (type !== OBJECT && type !== ARRAY) {
        return hash_tree;
    }
    const log = [];
    const dependents = new Set();
    const watchers = new hash_tree.constructor();
    const virtual_tree = new hash_tree.constructor();
    let working_tree = new hash_tree.constructor();

    const _watcher_for = property => watchers[property] || (watchers[property] = value => set(virtual_tree, property, value));
    const get = (target, property) => {
        if (property === COMMIT) {
            return message => {
                log.push({commit:HEAD, message});
                Object.keys(working_tree).forEach(property => hash_tree[property] = working_tree[property][COMMIT](message));
                working_tree = new hash_tree.constructor();
                return HEAD = toIndex(hash_tree);
            };
        } else if (property === DEPENDENTS) {
            return dependents;
        } else if (!hash_tree.hasOwnProperty(property)) {
            return hash_tree[property];
        } else if (working_tree.hasOwnProperty(property)) {
            return working_tree[property];
        } else if (!virtual_tree.hasOwnProperty(property)) {
            _set_value(virtual_tree, _watcher_for(property), property, init(hash_tree[property], indexifier));
        }
        return virtual_tree[property];
    };
    const set = (target, property, value) => {
        const watcher = _watcher_for(property);
        _unset_value(virtual_tree, watcher, property);
        delete virtual_tree[property];
        _unset_value(working_tree, watcher, property);
        _set_value(working_tree, watcher, property, value);
        [...dependents].forEach(dependent => dependent(proxy));
    };
    const deleteProperty = (target, property) => !void set(target, property);
    const proxy = new Proxy(hash_tree, { get, set, deleteProperty });
    return proxy;
};

export { init };
