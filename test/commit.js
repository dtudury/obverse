/* eslint-env node, mocha */

const assert = require("assert");

describe("obverse", function() {
    describe("#commit()", function() {
        it("should create history", function() {
            const {init, commit, log} = require("../dist/obverse");

            const store = init();
            assert.equal(log(store).length, 1, "starts with default object");
            store.a = 1;
            store.b = 2;
            commit(store);
            assert.equal(log(store).length, 2, "each commit adds one");
            store.a = 2;
            commit(store);
            assert.equal(log(store).length, 3, "each commit adds one");
            store.a = 1;
            commit(store);
            assert.equal(log(store).length, 4, "each commit adds one");
            assert.equal(log(store)[0], log(store)[2], "same states should have the same index");
            delete store.a;
            delete store.b;
            commit(store);
            assert.equal(log(store).length, 5, "each commit adds one");
            assert.equal(log(store)[0], log(store)[4], "same states should have the same index");
        });
    });
});
