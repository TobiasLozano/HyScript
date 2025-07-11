"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = cleanQuotes;
function cleanQuotes(text) {
    return text.replace(/['"]+/g, '');
}
