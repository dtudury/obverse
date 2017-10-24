/* eslint-env node, mocha */

const assert = require("assert");

describe("obverse", function() {
    describe("#indexify()", function() {
        const {indexify} = require("../dist/obverse");
        it("returns the same value regardless of attribute order at creation", function() {
            const a = indexify({foo: 1, bar: 2});
            const b = indexify({bar: 2, foo: 1});
            assert.equal(a, b, "attribute order shouldn't matter");
        });
        it("returns a different value after a deep change", function() {
            const obj = {
                foo: {
                    bar: 1
                }
            };
            const a = indexify(obj);
            obj.foo.bar = 2;
            const b = indexify(obj);
            assert.notEqual(a, b, "deep changes should matter");
        });
        it("returns different values for similar types", function() {
            assert.notEqual(indexify(true), indexify("true"), "booleans and their string representations should be different");
            assert.notEqual(indexify(false), indexify("false"), "booleans and their string representations should be different");
            assert.notEqual(indexify(true), indexify(false), "true and false should be different");
            assert.notEqual(indexify(Symbol()), indexify("Symbol()"), "symbols and their string representations should be different");
            assert.notEqual(indexify(0), indexify("0"), "numbers and their string representations should be different");
            assert.notEqual(indexify(null), indexify("null"), "null and its string representations should be different");
            assert.notEqual(indexify(undefined), indexify("undefined"), "undefined and its string representations should be different");
        });
        it("errors with non primitive values", function() {
            assert.throws(() => indexify(new Date()), "errors when indexifying a date");
        });
    });
    describe("#deindexify", function() {
        const {indexify, deindexify} = require("../dist/obverse");
        it("reverses", function() {
            assert.equal(true, deindexify(indexify(true)), "true is true");
            assert.equal(false, deindexify(indexify(false)), "false is false");
            assert.equal(1, deindexify(indexify(1)), "1 is 1");
        });
    });
});
