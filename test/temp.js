/* eslint-env node, mocha */

//npm run pretest ; ./node_modules/.bin/mocha  --require source-map-support/register test/temp.js


const assert = require("assert");

describe("temp", function() {
    it("wahtever", function() {

        const { juzy_init, juzy_log, juzy_head, juzy_commit, indexifier } = require("../dist/obverse");
        //console.log(indexifier);

        const o = indexifier.toIndex({ a: "A", b: "B", c: { d: "D" } });
        //console.log(o);

        let juzy = juzy_init(o, indexifier);

        indexifier.values().forEach((v, i) => {
            console.log(i, v);
        });

        /*
        console.log(JSON.stringify(juzy));
        console.log(Object.keys(juzy));
        console.log(juzy_head(juzy));

        console.log(juzy.c.d);
        */
        juzy.c.d = "changed";
        //console.log(juzy.c.d);
        console.log(juzy_commit(juzy, "test commit"));
        /*
        console.log(juzy_log(juzy));
        console.log(JSON.stringify(juzy));
        console.log(Object.keys(juzy));
        console.log(juzy_head(juzy));
        */

        indexifier.values().forEach((v, i) => {
            console.log(i, v);
        });
    })
});
