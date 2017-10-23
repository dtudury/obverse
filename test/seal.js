/* eslint-env node, mocha */

const assert = require("assert");

describe("obverse", function() {
    describe("#seal()", function() {
        const {seal} = require("../dist/obverse");
        it("errors when called with non-objects", function () {
            assert.throws(() => seal(1), "must throw when passed a number");
            assert.throws(() => seal("a"), "must throw when passed a string");
            assert.throws(() => seal(""), "must throw when passed a string");
            assert.throws(() => seal(null), "must throw when passed null");
            assert.throws(() => seal(true), "must throw when passed a boolean");
            assert.throws(() => seal(false), "must throw when passed a boolean");
            assert.throws(() => seal(new Date()), "must throw when passed a date");
            assert.throws(() => seal(Symbol("test")), "must throw when passed a symbol");
            assert.throws(() => seal(), "must throw when passed nothing");
        });
    });
    describe("#breaks()", function() {
        const {seal, breaks} = require("../dist/obverse");
        it("breaks where it's supposed to", function () {
            const obj = seal({
                a:1,
                b:true,
                c:[2,3,4],
                d:{
                    e:5
                }
            }, undefined, broken_seals => console.log("default", broken_seals));
            obj.a++;
            obj.c.push(5);
            obj.d.e++;
            assert(breaks(obj).a, "incrementing number member should break seal");
            assert(!breaks(obj).b, "should be no break on unchanged attribute");
            assert(breaks(obj).c, "should break on appended to array member");
            assert(breaks(obj).d.e, "should break on modification of sub-objects");
        });
    });
});
