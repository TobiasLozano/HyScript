import getProcessAttributes from "./parser/get-process-attributes";
import getProcessFlow from "./parser/get-process-flow";
import runProcess from "./parser/run-process";
import type { ProcessLog } from "./types";

function clean(code: string) {
  return code.trim().split("").join("");
}

export function runEsolang(code: string, addLog: (log: ProcessLog) => void) {
  try {
    const tokens = clean(code);
    const process = getProcessAttributes(tokens, "Main");
    const processFlow = getProcessFlow(tokens, process);
    runProcess(process, processFlow, code, [], addLog);
  } catch (error) {
    addLog({
      type: "error",
      value: `Uncaught error:${error} \x1b`,
    });
  }
}

// FLOW
/* 
<Main output=b aux=x,y,sum,final>
    =>x 1
    => y 2
    => final 'Completed'
    =>sum <ProcessSum input[x,y]/>
    =err><Log input=err/>
    =><Log input=final/>

    =>x 1
    => y 2
    => final 'Completed'
    =>sum <ProcessSum input=x,y/>
        STOP PROGRAM AND SHOW ERROR
    =><Log input=final/>
</Main>
 */
// MAIN
// Validate main tag open and closing
// Validate aux
// validate var names used
// Create var object
// fill values

// GET PROCESS return
// fill values for function:
// Search for Function  declaration Syntax tag
// Validate input, output and aux call process
// Validate aux
// validate var names used
// Create var object
// return output

// ERROR Handling
// Syntax error: save message
// Process line (save error message from last line)
// if next line is not =err>, stop process
// if it does: continue
