"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = runProcess;
const clean_quote_1 = __importDefault(require("../utils/clean-quote"));
const get_process_attributes_1 = __importDefault(require("./get-process-attributes"));
const get_process_flow_1 = __importDefault(require("./get-process-flow"));
const getVar = (varName, process) => {
    const processVars = [
        ...process.auxVars,
        ...process.inputVars,
        ...process.outputVars,
    ];
    const _var = processVars.find((e) => e.name === varName);
    return _var;
};
const validateProcessInvocation = (varName, instruction, code) => {
    const isInvocation = instruction.startsWith("<=") && instruction.endsWith(">");
    if (!isInvocation) {
        throw `Invalid process invocation for var ${varName}`;
    }
    const indexStart = instruction.indexOf(`<=`);
    const indexClose = instruction.indexOf(">", indexStart);
    const tag = instruction.slice(indexStart + 2, indexClose);
    const processName = tag.split(" ")[0];
    const process = (0, get_process_attributes_1.default)(code, processName);
    if (process) {
        return process;
    }
    else {
        console.error("Process not found");
        return;
    }
};
const setVar = (varName, _value, process) => {
    const value = (0, clean_quote_1.default)(_value);
    process.auxVars.map((_var) => {
        if (_var.name === varName) {
            _var.value = value;
        }
        return _var;
    });
    process.inputVars.map((_var) => {
        if (_var.name === varName) {
            _var.value = value;
        }
        return _var;
    });
    process.outputVars.map((_var) => {
        if (_var.name === varName) {
            _var.value = value;
        }
        return _var;
    });
    return process;
};
const operate = (varName, instruction, process) => {
    let operation = instruction.split(" ").slice(1);
    let operator = null;
    const operators = ["+", "-", "*", "/"];
    let result = "";
    operation.forEach((token) => {
        var _a, _b;
        if (operators.includes(token)) {
            return (operator = token);
        }
        const _var = getVar(token, process);
        if (_var) {
            if (_var.value === null) {
                console.error(`Variable ${_var.name} is null`);
            }
            if (result === "") {
                return (result = (_b = (_a = _var.value) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "");
            }
            if (operator === "+") {
                operator = null;
                if (!isNaN(Number(result)) && !isNaN(Number(_var.value))) {
                    return (result = (Number(result) + Number(_var.value)).toString());
                }
                return (result = (result + _var.value).toString());
            }
            if (operator === "-") {
                operator = null;
                if (isNaN(Number(result))) {
                    console.error(`Invalid operation '${operator}' operation with type ${typeof result}`);
                }
                if (isNaN(Number(_var.value))) {
                    console.error(`Invalid operation '${operator}' for variable with type ${typeof _var.name}`);
                }
                else {
                    return (result = (Number(result) - Number(_var.value)).toString());
                }
            }
            if (operator === "*") {
                operator = null;
                if (isNaN(Number(result))) {
                    console.error(`Invalid operation '${operator}' operation with type ${typeof result}`);
                }
                if (isNaN(Number(_var.value))) {
                    console.error(`Invalid operation '${operator}' for variable with type ${typeof _var.name}`);
                }
                else {
                    return (result = (Number(result) * Number(_var.value)).toString());
                }
            }
            if (operator === "/") {
                operator = null;
                if (isNaN(Number(result))) {
                    console.error(`Invalid operation '${operator}' operation with type ${typeof result}`);
                }
                if (isNaN(Number(_var.value))) {
                    console.error(`Invalid operation '${operator}' for variable with type ${typeof _var.name}`);
                }
                else {
                    return (result = (Number(result) / Number(_var.value)).toString());
                }
            }
        }
        const isNumber = !isNaN(Number(token));
        const isString = /'(.*?)'/.test(token);
        if (isNumber) {
            if (result === "") {
                return (result = token);
            }
            if (operator === "+") {
                operator = null;
                if (!isNaN(Number(result))) {
                    return (result = (Number(result) + Number(token)).toString());
                }
                return (result = (result + token).toString());
            }
            if (operator === "-") {
                operator = null;
                if (isNaN(Number(result))) {
                    console.error(`Invalid operation '${operator}' operation with type ${typeof result}`);
                }
                return (result = (Number(result) - Number(token)).toString());
            }
        }
        else if (isString) {
            if (result === "") {
                return (result = (0, clean_quote_1.default)(token));
            }
            if (operator === "+") {
                operator = null;
                if (isNaN(Number(result))) {
                    return (result = result + (0, clean_quote_1.default)(token));
                }
                return (result = result + (0, clean_quote_1.default)(token));
            }
        }
        else {
            console.error(`Invalid symbol ${token}`);
        }
        return token;
    }, "");
    return result;
};
function runProcess(_process, steps, code, inputVars) {
    let process = Object.assign({}, _process);
    if (inputVars) {
        inputVars.forEach((variable) => {
            var _a;
            const { name: varName, value: _value } = variable;
            const value = (0, clean_quote_1.default)((_a = _value === null || _value === void 0 ? void 0 : _value.toString()) !== null && _a !== void 0 ? _a : '');
            process.auxVars.map((_var) => {
                if (_var.name === varName) {
                    _var.value = value;
                }
                return _var;
            });
            process.inputVars.map((_var) => {
                if (_var.name === varName) {
                    _var.value = value;
                }
                return _var;
            });
            process.outputVars.map((_var) => {
                if (_var.name === varName) {
                    _var.value = value;
                }
                return _var;
            });
        });
    }
    steps.forEach((step) => {
        var _a, _b, _c, _d, _e;
        const { type, instruction } = step;
        let varName = "";
        switch (type) {
            case "assign":
                varName = instruction.split(" ")[0];
                if (!getVar(varName, process)) {
                    console.error(`Variable ${varName} doesn't exists`);
                }
                else {
                    let operation = instruction
                        .split(" ")
                        .slice(1)
                        .join(" ");
                    process = setVar(varName, operation, process);
                }
                break;
            case "operate":
                varName = instruction.split(" ")[0];
                if (!getVar(varName, process)) {
                    console.error(`Variable ${varName} doesn't exists`);
                }
                else {
                    const result = operate(varName, instruction, process);
                    setVar(varName, result, process);
                }
                break;
            case "log":
                const isString = /'(.*?)'/.test(instruction);
                if (isString) {
                    console.log((0, clean_quote_1.default)(instruction));
                    break;
                }
                const valueToLog = instruction.split(" ")[0];
                if (!isNaN(Number(valueToLog))) {
                    console.log(valueToLog);
                    break;
                }
                if (getVar(valueToLog, process)) {
                    console.log((0, clean_quote_1.default)((_c = (_b = (_a = getVar(valueToLog, process)) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.toString()) !== null && _c !== void 0 ? _c : ""));
                    break;
                }
                console.error(`Error logging value, Invalid symbol ${valueToLog}`);
                break;
            case "err":
                break;
            case "call":
                varName = instruction.split(" ")[0];
                if (!getVar(varName, process)) {
                    console.error(`Variable ${varName} doesn't exists`);
                }
                else {
                    let operation = instruction
                        .split(" ")
                        .slice(1)
                        .join(" ");
                    const _callProcess = validateProcessInvocation(varName, operation, code);
                    if (_callProcess) {
                        const _steps = (0, get_process_flow_1.default)(code, _callProcess);
                        const childProcess = runProcess(_callProcess, _steps, code, [...process.inputVars, ...process.auxVars]);
                        const _outputVar = childProcess.outputVars.find(e => e.name === varName);
                        if (_outputVar !== undefined) {
                            const varValue = (_e = (_d = _outputVar.value) === null || _d === void 0 ? void 0 : _d.toString()) !== null && _e !== void 0 ? _e : '';
                            process = setVar(varName, varValue, process);
                        }
                    }
                }
                break;
            default:
                break;
        }
    });
    console.log(process);
    return process;
}
