import buble from 'rollup-plugin-buble';

export default {
    input: "src/obverse.js",
    plugins: [buble()],
    output: {
        file: "dist/obverse.js",
        format: "es"
    }
}
