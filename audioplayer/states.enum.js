"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AudioState;
(function (AudioState) {
    AudioState[AudioState["error"] = -1] = "error";
    AudioState[AudioState["idle"] = 0] = "idle";
    AudioState[AudioState["loading"] = 1] = "loading";
    AudioState[AudioState["ready"] = 2] = "ready";
    AudioState[AudioState["playing"] = 3] = "playing";
    AudioState[AudioState["finished"] = 4] = "finished";
})(AudioState = exports.AudioState || (exports.AudioState = {}));
//# sourceMappingURL=states.enum.js.map