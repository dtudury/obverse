/* eslint-env node */
/* eslint no-console: off */
require("source-map-support").install({environment: "node"});

const {seal, breaks} = require("./dist/obverse");

let v = seal({
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

//console.log("hash(v)", hash(v));
//console.log("hash(v.e.i.j)", hash(v.e.i.j));
console.log("v", v);
console.log("v.e.i.j", v.e.i.j);
console.log("breaks(v)", breaks(v));

delete v.e.i.j;
//commit(v);
//console.log("hash(v)", hash(v));
//console.log("hash(v.e.i.j)", hash(v.e.i.j));
//console.log("v", v);
console.log("v.e.i.j", v.e.i.j);
console.log("breaks(v)", breaks(v));

v.e.i.j = 5;
v.d[1] = 7;
//commit(v);
//console.log("hash(v)", hash(v));
//console.log("hash(v.e.i.j)", hash(v.e.i.j));
//console.log("v", v);
console.log("v.e.i.j", v.e.i.j);
console.log("breaks(v)", breaks(v));

seal(v);

console.log("v.e.i.j", v.e.i.j);
console.log("breaks(v)", breaks(v));
