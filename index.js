"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_process_attributes_1 = __importDefault(require("./parser/get-process-attributes"));
const get_process_flow_1 = __importDefault(require("./parser/get-process-flow"));
const run_process_1 = __importDefault(require("./parser/run-process"));
function clean(code) {
    return code.trim().split("").join("");
}
function runEsolang(code) {
    const tokens = clean(code);
    const process = (0, get_process_attributes_1.default)(tokens, "Main");
    const processFlow = (0, get_process_flow_1.default)(tokens, process);
    (0, run_process_1.default)(process, processFlow);
}
runEsolang(`
   <Main output b aux x y sum final>
    => assign x 2
    => assign y 8
    => operate sum 'hola-' + 'tobias' 
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
