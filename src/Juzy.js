import { OBJECT, ARRAY } from "./Types";

const DEPENDENTS = Symbol("collection of observers");
const HEAD = Symbol("current commit");
const LOG = Symbol("commit history");
const COMMIT = Symbol("commit changes");

const _unset_value = (tree, watcher, property) => {
    if (tree.hasOwnProperty(property)) {
        if (tree[property] && tree[property][DEPENDENTS]) {
            tree[property][DEPENDENTS].delete(watcher);
        }
    }
};

const _set_value = (tree, watcher, property, value) => {
    console.log("            setting", property, value);
    tree[property] = value;
    if (value && value[DEPENDENTS]) {
        value[DEPENDENTS].add(watcher);
    }
};

const init = (commit_index, indexifier) => {
    const { toIndex, toValue, toType } = indexifier;
    const hash_tree = toValue(commit_index);
    const type = toType(commit_index);
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
        if (property === HEAD) {
            return commit_index;
        } else if (property === LOG) {
            return log;
        } else if (property === COMMIT) {
            return message => {
                console.log("    committing", hash_tree, working_tree);
                log.push({ commit_index, message });
                Object.keys(working_tree).forEach(property => {
                    const value = working_tree[property];
                    const committer = value[COMMIT];
                    if (committer) {
                        hash_tree[property] = committer(message);
                        console.log("        has committer", property, value);
                    } else {
                        hash_tree[property] = toIndex(value);
                        console.log("        has no committer", property, value, hash_tree[property]);
                    }
                });
                console.log("    /committing", hash_tree, working_tree);
                working_tree = new hash_tree.constructor();
                return commit_index = toIndex(hash_tree);
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
        Array.from(dependents).forEach(dependent => {
            dependent(proxy);
        });
        dependents.forEach((dependent, key) => {
            //TODO: WTF?
            //console.log(dependent, key, dependents, Array.from(dependents));
        });
    };
    const deleteProperty = (target, property) => !void set(target, property);
    const proxy = new Proxy(hash_tree, { get, set, deleteProperty });
    return proxy;
};

const commit = (proxy, message) => proxy[COMMIT](message);
const log = proxy => proxy[LOG];
const head = proxy => proxy[HEAD];

export { init, commit, head, log };
