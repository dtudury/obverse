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
            });
            obj.a++;
            obj.c.push(5);
            obj.d.e++;
            assert(breaks(obj).a, "incrementing number member should break seal");
            assert(!breaks(obj).b, "should be no break on unchanged attribute");
            assert(breaks(obj).c, "should break on appended to array member");
            assert(breaks(obj).d.e, "should break on modification of sub-objects");
            delete obj.b;
            assert(breaks(obj).b, "should break on deleted attribute");

            const obj2 = seal(obj);
            assert(breaks(obj).b, "original should still be broken after sealing");
            assert(!breaks(obj2), "newly sealed object should be unbroken");
            obj2.x = true;
            obj.y = true;
            assert(!breaks(obj).x, "changes to copy shouldn't break original");
            assert(!breaks(obj2).y, "changes to original shouldn't break copy");

        });
    });
    describe("#mend()", function() {
        const {seal, breaks, mend} = require("../dist/obverse");
        it("mends like it should", function () {
            const obj = seal({
                a:1,
                b:true,
                c:[2,3,4],
                d:{
                    e:5
                }
            });
            assert.doesNotThrow(() => mend(obj), "mending unbroken seals shouldn't throw errors");
            obj.a++;
            delete obj.b;
            obj.c.push(5);
            obj.d.e++;
            mend(obj);
            assert(!breaks(obj), "should have no breaks after mend");
            let f = obj.d;
            obj.d = {};
            mend(obj);
            f.x = true;
            assert(!breaks(obj), "should have no breaks after mend (even after modifying previously sealed member object)");
        });
    });
});
