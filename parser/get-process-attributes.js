"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getProcessAttributes;
function getProcessAttributes(code, processName) {
    const hasProcess = code.includes(`<${processName}`) && code.includes(`</${processName}>`);
    if (!hasProcess) {
        throw `The program doesn't have a ${processName} function`;
    }
    const indexStart = code.indexOf(`<${processName}`);
    const indexClose = code.indexOf(">", indexStart);
    const openTag = code.slice(indexStart + 1, indexClose);
    const openTagTokens = openTag.split(" ");
    let name = "";
    const outputVars = [];
    const inputVars = [];
    const auxVars = [];
    let currentTokenType = "name";
    openTagTokens.forEach((token) => {
        const regExVarName = /^[a-zA-Z]+$/;
        if (currentTokenType !== "name" && !regExVarName.test(token)) {
            throw `error in  ${currentTokenType} var with name ${token}`;
        }
        switch (currentTokenType) {
            case "output":
                if (token === "input" || token === "aux") {
                    break;
                }
                outputVars.push({
                    name: token,
                    value: null,
                });
                break;
            case "input":
                if (token === "output" || token === "aux") {
                    break;
                }
                inputVars.push({
                    name: token,
                    value: null,
                });
                break;
            case "aux":
                if (token === "input" || token === "output") {
                    break;
                }
                auxVars.push({
                    name: token,
                    value: null,
                });
                break;
            case "name":
                if (!name)
                    name = token;
                break;
            default:
                break;
        }
        if (["output", "input", "aux"].includes(token)) {
            currentTokenType = token;
        }
    });
    const process = { name, outputVars, inputVars, auxVars };
    return process;
}
