/* eslint-env node, mocha */

const assert = require("assert");

describe("obverse", function() {
    describe("#indexify()", function() {
        const {indexify} = require("../dist/obverse");
        it("returns the same value regardless of attribute order at creation", function() {
            const a = indexify({
                foo: 1,
                bar: 2
            });
            const b = indexify({
                bar: 2,
                foo: 1
            });
            assert.equal(a, b, "attribute order shouldn't matter");
        });
        it("returns a different value after a deep change", function() {
            const obj = {
                foo: {
                    bar:1
                }
            };
            const a = indexify(obj);
            obj.foo.bar = 2;
            const b = indexify(obj);
            assert.notEqual(a, b, "deep changes should matter");
        });
    });
});
