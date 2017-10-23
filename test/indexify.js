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
        it("errors when called with non-objects", function () {
            assert.throws(() => indexify(1), "must throw when passed a number");
            assert.throws(() => indexify("a"), "must throw when passed a string");
            assert.throws(() => indexify(""), "must throw when passed a string");
            assert.throws(() => indexify(null), "must throw when passed null");
            assert.throws(() => indexify(true), "must throw when passed a boolean");
            assert.throws(() => indexify(false), "must throw when passed a boolean");
            assert.throws(() => indexify(new Date()), "must throw when passed a date");
            assert.throws(() => indexify(Symbol("test")), "must throw when passed a symbol");
            assert.throws(() => indexify(), "must throw when passed nothing");
        });
    });
});
