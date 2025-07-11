"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatchedError = void 0;
class CatchedError extends Error {
    constructor(message) {
        super(message);
        this.name = "CatchedError";
    }
}
exports.CatchedError = CatchedError;
