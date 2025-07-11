"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getProcessFlow;
function getProcessFlow(code, process) {
    const processName = process.name;
    const hasMain = code.includes(`<${processName}`) && code.includes(`</${processName}>`);
    if (!hasMain) {
        throw `The program doesn't have a ${processName} function`;
    }
    const indexStart = code.indexOf(`<${processName}`);
    const indexClose = code.indexOf(">", indexStart);
    const indexEndTag = code.indexOf(`</${processName}>`, indexStart);
    const processFlow = code.slice(indexClose + 1, indexEndTag);
    const _processSteps = processFlow.split("=>").slice(1).map((e) => e.trim());
    const processSteps = _processSteps.map((step) => {
        const [stepType, ...instruction] = step.split(' ');
        if (!["assign", "log", "err", "operate", "call"].includes(stepType)) {
            throw (`${stepType} on process ${processName} is not a valid operation`);
        }
        return {
            type: step.split(' ')[0],
            instruction: instruction.join(' ')
        };
    });
    return processSteps;
}
