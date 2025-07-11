import { Process, ProcessStep } from "../types";
import clearQuotes from "../utils/clean-quote";

const getVar = (varName: string, process: Process) => {
  const processVars = [
    ...process.auxVars,
    ...process.inputVars,
    ...process.outputVars,
  ];
  const _var = processVars.find((e) => e.name === varName);
  return _var;
};

const setVar = (varName: string, value: string, process: Process) => {
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

const operate = (varName: string, instruction: string, process: Process) => {
  let operation = instruction.split(" ").slice(1);
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
        console.error(`Variable ${_var.name} is null`);
      }
      if (result === "") {
        return (result = _var.value?.toString() ?? "");
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
          console.error(
            `Invalid operation '${operator}' operation with type ${typeof result}`
          );
        }
        if (isNaN(Number(_var.value))) {
          console.error(
            `Invalid operation '${operator}' for variable with type ${typeof _var.name}`
          );
        } else {
          return (result = (Number(result) - Number(_var.value)).toString());
        }
      }
      if (operator === "*") {
        operator = null;
        if (isNaN(Number(result))) {
          console.error(
            `Invalid operation '${operator}' operation with type ${typeof result}`
          );
        }
        if (isNaN(Number(_var.value))) {
          console.error(
            `Invalid operation '${operator}' for variable with type ${typeof _var.name}`
          );
        } else {
          return (result = (Number(result) * Number(_var.value)).toString());
        }
      }
      if (operator === "/") {
        operator = null;
        if (isNaN(Number(result))) {
          console.error(
            `Invalid operation '${operator}' operation with type ${typeof result}`
          );
        }
        if (isNaN(Number(_var.value))) {
          console.error(
            `Invalid operation '${operator}' for variable with type ${typeof _var.name}`
          );
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
          console.error(
            `Invalid operation '${operator}' operation with type ${typeof result}`
          );
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
      console.error(`Invalid symbol ${token}`);
    }
    return token;
  }, "");

  return result;
};

export default function runProcess(_process: Process, steps: ProcessStep[]) {
  let process = { ..._process };
  steps.forEach((step) => {
    const { type, instruction } = step;
    let varName = "";
    switch (type) {
      case "assign":
        varName = instruction.split(" ")[0];
        if (!getVar(varName, process)) {
          console.error(`Variable ${varName} doesn't exists`);
        } else {
          let operation: string | number = instruction
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
        } else {
          const result = operate(varName, instruction, process);
          setVar(varName, result, process);
        }
        break;
      case "err":
        break;
      case "log":
        const valueToLog = instruction.split(" ")[0];
        const isString = /'(.*?)'/.test(valueToLog);
         if (isString) {
          console.log(valueToLog);
          break;
        }
        if(!isNaN(Number(valueToLog))){
            console.log(valueToLog);
          break;

        }
        if(getVar(valueToLog,process)){
            console.log(clearQuotes(getVar(valueToLog,process)?.value?.toString()??''));
          break;

        }

        console.error(`Error logging value, Invalid symbol ${valueToLog}`);
        break;

      case "call":
        break;
      default:
        break;
    }
  });

  console.log(process);
}
