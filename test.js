"use strict";

const {PUSH, hash} = require("./dist/obverse");

console.log(PUSH);

console.log(hash({
    a:1,
    b:"two",
    c:null,
    d:[5,4,3],
    e:{
        //f:new Date(),
        g: Symbol("duh")
    }
}))
