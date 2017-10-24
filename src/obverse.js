import {seal, breaks, mend} from "./Sealer";
import Indexifier from "./Indexifier";
const indexifier = new Indexifier();
const indexify = indexifier.indexify;
const deindexify = indexifier.deindexify;

export {seal, breaks, mend, indexify, deindexify};
