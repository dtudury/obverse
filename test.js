"use strict";

require("source-map-support").install({
    environment: "node"
});

const {obvize, i_to_v, hash} = require("./dist/obverse");

let i = obvize({
    a: 1,
    b: "two",
    c: null,
    d: [
        5, 4, 3
    ],
    e: {
        //f:new Date(),
        g: Symbol("duh")
    }
})
console.log(i)
console.log(i_to_v)
let v = i_to_v(i);

console.log("v", v);
console.log("hash(v)", hash(v));
console.log("v.e", v.e);
console.log("hash(v.e)", hash(v.e));
console.log("v.e.g", v.e.g);
console.log("hash(v.e.g)", hash(v.e.g));

v.e.g = 5;
console.log("v", v);
console.log("hash(v)", hash(v));
console.log("v.e", v.e);
console.log("hash(v.e)", hash(v.e));
console.log("v.e.g", v.e.g);
console.log("hash(v.e.g)", hash(v.e.g));
