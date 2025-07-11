import getProcessAttributes from "./parser/get-process-attributes";
import getProcessFlow from "./parser/get-process-flow";
import runProcess from "./parser/run-process";

function clean(code: string) {
  return code.trim().split("").join("");
}


function runEsolang(code: string) {
  const tokens = clean(code);
  const process = getProcessAttributes(tokens, "Main");
  const processFlow = getProcessFlow(tokens, process);
  console.log(process,processFlow);
  runProcess(process,processFlow)
}

runEsolang(`
   <Main output b aux x y sum final>
    => assign x 2
    => assign y 3
    => operate sum x - y + x
    => assign final 'Completed'
    => call sum <ProcessSum input[x,y]/>
    => err log err
    => assign b 1
    => log final
</Main>
<ProcessSum input=a,b output=c aux=text>
    => assign text = 'Hello'
    =>log text
    => operate c a + b
</ProcessSum>`);

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
