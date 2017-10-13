//obversize should... be named better.
//obversize should be a class that proxies objects and tracks if any setters used
//another class should track the "hashes"
import {obvize, hash, commit} from "./obversize";
import {seal, breaks} from "./Sealer";
export {obvize, hash, commit, seal, breaks};
