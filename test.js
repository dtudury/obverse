"use strict";

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

console.log("v.e.g", v.e.g);
console.log("v[HASH]", hash(v));
