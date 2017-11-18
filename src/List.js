export default class {
    constructor () {
        const _values = [];
        this.add = v => _values.push(v) - 1;
        this.valueAt = i => _values[i];
    }
}
