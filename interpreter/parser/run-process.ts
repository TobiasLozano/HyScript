import { CatchedError } from "../errors";
import type { Process, ProcessLog, ProcessStep, Variable } from "../types";
import clearQuotes from "../utils/clean-quote";
import getProcessAttributes from "./get-process-attributes";
import getProcessFlow from "./get-process-flow";

const getVar = (varName: string, process: Process) => {
  const processVars = [
    ...process.auxVars,
    ...process.inputVars,
    ...process.outputVars,
  ];
  const _var = processVars.find((e) => e.name === varName);
  return _var;
};

const validateProcessInvocation = (
  varName: string,
  instruction: string,
  code: string
): Process | undefined => {
  const isInvocation =
    instruction.startsWith("<=") && instruction.endsWith(">");
  if (!isInvocation) {
    throw `Invalid process invocation for var ${varName}`;
  }
  const indexStart = instruction.indexOf(`<=`);
  const indexClose = instruction.indexOf(">", indexStart);
  const tag = instruction.slice(indexStart + 2, indexClose);
  const processName = tag.split(" ")[0];
  const process = getProcessAttributes(code, processName);
  if (process) {
    return process;
  } else {
    throw "Process not found";
    return;
  }
};
const setVar = (varName: string, _value: string, process: Process) => {
  let value = _value;
  const isString = /'(.*?)'/.test(_value);
  if (isString) {
    value = _value;
  } else {
    const valueToLog = _value.split(" ")[0];

    if (!isNaN(Number(valueToLog))) {
      value = valueToLog;
    } else if (getVar(valueToLog, process)) {
      value = clearQuotes(getVar(valueToLog, process)?.value?.toString() ?? "");
    } else {
      throw `Invalid value ${valueToLog} for variable '${varName}'`;
    }
  }

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

const operate = (_varName: string, instruction: string, process: Process) => {
  const operation = instruction.split(" ").slice(1);
  let operator: string | null = null;
  const operators = ["+", "-", "*", "/"];
  let result = "";
  operation.forEach((token) => {
    if (operators.includes(token)) {
      return (operator = token);
    }
    const _var = getVar(token, process);

    if (_var) {
      if (_var.value === null) {
        throw `Variable ${_var.name} is null`;
      }
      if (result === "") {
        return (result = _var.value?.toString() ?? "");
      }
      if (operator === "+") {
        operator = null;
        if (!isNaN(Number(result)) && !isNaN(Number(_var.value))) {
          return (result = (Number(result) + Number(_var.value)).toString());
        }

        return (result = `'${result + _var.value}'`);
      }
      if (operator === "-") {
        operator = null;
        if (isNaN(Number(result))) {
          throw `Invalid operation '${operator}' operation with type ${typeof result}`;
        }
        if (isNaN(Number(_var.value))) {
          throw `Invalid operation '${operator}' for variable with type ${typeof _var.name}`;
        } else {
          return (result = (Number(result) - Number(_var.value)).toString());
        }
      }
      if (operator === "*") {
        operator = null;
        if (isNaN(Number(result))) {
          throw `Invalid operation '${operator}' operation with type ${typeof result}`;
        }
        if (isNaN(Number(_var.value))) {
          throw `Invalid operation '${operator}' for variable with type ${typeof _var.name}`;
        } else {
          return (result = (Number(result) * Number(_var.value)).toString());
        }
      }
      if (operator === "/") {
        operator = null;
        if (isNaN(Number(result))) {
          throw `Invalid operation '${operator}' operation with type ${typeof result}`;
        }
        if (isNaN(Number(_var.value))) {
          throw `Invalid operation '${operator}' for variable with type ${typeof _var.name}`;
        } else {
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
          throw `Invalid operation '${operator}' operation with type ${typeof result}`;
        }

        return (result = (Number(result) - Number(token)).toString());
      }
    } else if (isString) {
      if (result === "") {
        return (result = clearQuotes(token));
      }
      if (operator === "+") {
        operator = null;
        if (isNaN(Number(result))) {
          return (result = result + clearQuotes(token));
        }

        return (result = result + clearQuotes(token));
      }
    } else {
      throw `Invalid symbol ${token}`;
    }
    return token;
  }, "");

  return result;
};

export default function runProcess(
  _process: Process,
  steps: ProcessStep[],
  code: string,
  inputVars: Variable[],
 addLog: (log: ProcessLog) => void
) {
  let process = { ..._process };
  if (inputVars) {
    inputVars.forEach((variable) => {
      const { name: varName, value: _value } = variable;

      const value = clearQuotes(_value?.toString() ?? "");
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
  let lastError: unknown;

  steps.forEach((step) => {
    const { type, instruction } = step;
    let varName = "";
    try {
      if (lastError && type !== "err") {
        throw lastError;
      }
      if (lastError) {
        throw new CatchedError(lastError as string);
      }
      switch (type) {
        case "assign":
          varName = instruction.split(" ")[0];
          if (!getVar(varName, process)) {
            throw `Variable ${varName} doesn't exists`;
          } else {
            const operation: string | number = instruction
              .split(" ")
              .slice(1)
              .join(" ");

            process = setVar(varName, operation, process);
          }
          break;
        case "operate":
          varName = instruction.split(" ")[0];
          if (!getVar(varName, process)) {
            throw `Variable ${varName} doesn't exists`;
          } else {
            const result = operate(varName, instruction, process);
            setVar(varName, result, process);
          }
          break;

        case "log": {
          const isString = /'(.*?)'/.test(instruction);
          if (isString) {
           addLog( { 
                type: "log",
                value: clearQuotes(instruction),
              });
            break;
          }
          const valueToLog = instruction.split(" ")[0];

          if (!isNaN(Number(valueToLog))) {
           addLog({
                type: "log",
                value: valueToLog,
              });
            break;
          }
          if (getVar(valueToLog, process)) {
             addLog(  {
                type: "log",
                value:  clearQuotes(getVar(valueToLog, process)?.value?.toString() ?? ""),
              } );
           
            break;
          }

          throw `Error logging value, Invalid symbol ${valueToLog}`;
          break;
        }

        case "call":
          varName = instruction.split(" ")[0];
          if (!getVar(varName, process)) {
            throw `Variable ${varName} doesn't exists`;
          } else {
            const operation: string | number = instruction
              .split(" ")
              .slice(1)
              .join(" ");
            const _callProcess = validateProcessInvocation(
              varName,
              operation,
              code
            );
            if (_callProcess) {
              const _steps = getProcessFlow(code, _callProcess);

              const childProcess = runProcess(_callProcess, _steps, code, [
                ...process.inputVars,
                ...process.auxVars,
              ],addLog);
              const _outputVar = childProcess.outputVars.find(
                (e) => e.name === varName
              );

              if (_outputVar !== undefined) {
                const varValue = _outputVar.value?.toString() ?? "";

                process = setVar(varName, varValue, process);
              }
            }
          }
          break;
        default:
          break;
      }
    } catch (error) {
      if (!lastError) {
        return (lastError = error);
      }

      if (error instanceof CatchedError) {
           addLog  ({
                type: "catch",
                value: `CatchedError: ${lastError}`,
              } );
           
        lastError = null;
      } else {
        lastError = null;
        throw error;
      }
    }
  });
  // setLogs(process);
  return process;
}
