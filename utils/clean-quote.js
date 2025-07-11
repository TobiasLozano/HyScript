"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = clearQuotes;
function clearQuotes(text) {
    return text.replace(/['"]+/g, '');
}
