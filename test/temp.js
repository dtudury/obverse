/* eslint-env node, mocha */

//npm run pretest ; ./node_modules/.bin/mocha  --require source-map-support/register test/temp.js


const assert = require("assert");

describe("temp", function() {
    it("wahtever", function() {

        const { juzy_init, juzy_log, juzy_head, juzy_commit, indexifier } = require("../dist/obverse");
        console.log(indexifier);

        const o = indexifier.toIndex({ a: 1, b: 2, c: { d: 3 } });
        console.log(o);

        let juzy = juzy_init(o, indexifier);

        console.log(juzy);
        console.log(juzy);
        console.log(JSON.stringify(juzy));
        console.log(Object.keys(juzy));
        console.log(juzy_head(juzy));

        juzy.c.d++;
        console.log(juzy_commit(juzy, "test commit"));
        console.log(juzy_log(juzy));
    })
});
