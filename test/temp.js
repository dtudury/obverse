/* eslint-env node, mocha */


const assert = require("assert");

describe("temp", function() {
    it("wahtever", function() {

        const { juzy_init, indexifier } = require("../dist/obverse");
        console.log(indexifier);

        const o = indexifier.toIndex({ a: 1, b: 2, c: { d: 3 } });
        console.log(o);

        let juzy = juzy_init(o, indexifier);

        console.log(juzy);
        console.log(JSON.stringify(juzy));
        console.log(Object.keys(juzy));
    })
});
