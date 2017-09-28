/* jshint node: true */
require("source-map-support").install({environment: "node"});

const {obvize, hash, commit} = require("./dist/obverse");

let v = obvize({
    a: 1,
    b: "two",
    c: null,
    d: [
        5, 4, 3
    ],
    e: {
        //f:new Date(),
        g: Symbol("duh"),
        h: "not a symbol",
        i: {
            j: "k"
        }
    }
});

console.log("hash(v)", hash(v));
console.log("hash(v.e.i.j)", hash(v.e.i.j));

delete v.e.i.j;
commit(v);
console.log("hash(v)", hash(v));
console.log("hash(v.e.i.j)", hash(v.e.i.j));

v.e.i.j = 5;
commit(v);
console.log("hash(v)", hash(v));
console.log("hash(v.e.i.j)", hash(v.e.i.j));
