/* eslint-env node, mocha */

const assert = require("assert");

describe("obverse", function() {
    describe("#toIndex()", function() {
        const {toIndex} = require("../dist/obverse");
        it("returns the same value regardless of attribute order at creation", function() {
            const a = toIndex({foo: 1, bar: 2});
            const b = toIndex({bar: 2, foo: 1});
            assert.equal(a, b, "attribute order shouldn't matter");
        });
        it("returns a different value after a deep change", function() {
            const obj = {
                foo: {
                    bar: 1
                }
            };
            const a = toIndex(obj);
            obj.foo.bar = 2;
            const b = toIndex(obj);
            assert.notEqual(a, b, "deep changes should matter");
        });
        it("returns different values for similar types", function() {
            assert.notEqual(toIndex(true), toIndex("true"), "booleans and their string representations should be different");
            assert.notEqual(toIndex(false), toIndex("false"), "booleans and their string representations should be different");
            assert.notEqual(toIndex(true), toIndex(false), "true and false should be different");
            assert.notEqual(toIndex(Symbol()), toIndex("Symbol()"), "symbols and their string representations should be different");
            assert.notEqual(toIndex(0), toIndex("0"), "numbers and their string representations should be different");
            assert.notEqual(toIndex(null), toIndex("null"), "null and its string representations should be different");
            assert.notEqual(toIndex(undefined), toIndex("undefined"), "undefined and its string representations should be different");
        });
        it("errors with non primitive values", function() {
            assert.throws(() => toIndex(new Date()), "errors when toIndexing a date");
        });
    });
    describe("#toValue", function() {
        const {toIndex, toValue} = require("../dist/obverse");
        it("reverses", function() {
            assert.equal(true, toValue(toIndex(true)), "true is true");
            assert.equal(false, toValue(toIndex(false)), "false is false");
            assert.equal(1, toValue(toIndex(1)), "1 is 1");
        });
    });
});
