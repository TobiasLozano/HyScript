"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = runProcess;
const getVar = (varName, process) => {
    const processVars = [
        ...process.auxVars,
        ...process.inputVars,
        ...process.outputVars,
    ];
    const _var = processVars.find((e) => e.name === varName);
    return _var;
};
const setVar = (varName, value, process) => {
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
    console.log(operation);
    let result = "";
    operation.forEach((token) => {
        var _a, _b;
        if (operators.includes(token)) {
            return operator = token;
        }
        const _var = getVar(token, process);
        console.log({ result, token, _var });
        if (_var) {
            if (_var.value === null) {
                console.error(`Variable ${_var.name} is null`);
            }
            if (result === '') {
                return result = (_b = (_a = _var.value) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '';
            }
            if (operator === "+") {
                operator = null;
                if (!isNaN(Number(result)) && !isNaN(Number(_var.value))) {
                    return result = (Number(result) + Number(_var.value)).toString();
                }
                return result = (result + _var.value).toString();
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
            /*
            if (operator === "*") {
              operator = null;
              return acumulator * _var.value;
            }
            if (operator === "/") {
              operator = null;
              return acumulator / _var.value;
            } */
        }
        return token;
    }, "");
    return result;
};
function runProcess(_process, steps) {
    let process = Object.assign({}, _process);
    steps.forEach((step) => {
        const { type, instruction } = step;
        let varName = "";
        switch (type) {
            case "assign":
                varName = instruction.split(" ")[0];
                if (!getVar(varName, process)) {
                    console.error(`Variable ${varName} doesn't exists`);
                }
                else {
                    let operation = instruction.split(" ").slice(1).join(" ");
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
            case "err":
                break;
            case "log":
                break;
            case "call":
                break;
            default:
                break;
        }
    });
    console.log(process);
}
