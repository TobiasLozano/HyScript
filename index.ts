import getProcessAttributes from "./parser/get-process-attributes";
import getProcessFlow from "./parser/get-process-flow";
import runProcess from "./parser/run-process";

function clean(code: string) {
  return code.trim().split("").join("");
}


function runEsolang(code: string) {
 try {
  
   const tokens = clean(code);
   const process = getProcessAttributes(tokens, "Main");
   const processFlow = getProcessFlow(tokens, process);
   runProcess(process,processFlow,code,[])
  } catch (error) {
    console.log(`\x1b[41m ${error} \x1b[0m`)
  }
  
}

runEsolang(`
   <Main output b aux x y sum final>
    => assign x 'sisis0'
    => assign y '2sksk'
    => err log err
    => assign final 'Completed'
    => call sum <=ProcessSum input x, y>
    => assign b 'skkk'
    => log final
</Main>
<ProcessSum input x y output sum aux text>
    => assign text 'Hello'
    => log 'text'
    => log text
    => operate sum x + y
    => log 'sum is' 
    => log sum
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
