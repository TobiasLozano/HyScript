"use strict";
function clean(code) {
    return code.trim().split("").join("");
}
function getProcessAttributes(code, processName) {
    const hasProcess = code.includes(`<${processName}`) && code.includes(`</${processName}>`);
    if (!hasProcess) {
        throw (`The program doesn't have a ${processName} function`);
    }
    const indexStart = code.indexOf(`<${processName}`);
    const indexClose = code.indexOf(">", indexStart);
    const openTag = code.slice(indexStart, indexClose);
    const openTagTokens = openTag.split(" ");
    let name = "";
    const outputVars = [];
    const inputVars = [];
    const auxVars = [];
    let currentTokenType = "name";
    openTagTokens.forEach((token) => {
        const regExVarName = /^[a-zA-Z]+$/;
        if (currentTokenType !== "name" && !regExVarName.test(token)) {
            throw (`error in  ${currentTokenType} var with name ${token}`);
        }
        switch (currentTokenType) {
            case "output":
                outputVars.push({
                    name: token,
                    value: null,
                });
                break;
            case "input":
                inputVars.push({
                    name: token,
                    value: null,
                });
                break;
            case "aux":
                auxVars.push({
                    name: token,
                    value: null,
                });
                break;
            case "name":
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
    console.log(process);
}
function getProcessFlow(code, processName) {
    const hasMain = code.includes(`<${processName}`) && code.includes(`</${processName}>`);
    if (!hasMain) {
        throw (`The program doesn't have a ${processName} function`);
    }
    const indexStart = code.indexOf(`<${processName}`);
    const indexClose = code.indexOf(">", indexStart);
    const indexEndTag = code.indexOf(`</${processName}>`, indexStart);
    console.log(code);
    const processFlow = code.slice(indexClose + 2, indexEndTag);
    console.log(processFlow);
    const processSteps = processFlow.split('=>');
    console.log(processSteps.map((e) => e.trim()));
}
function runEsolang(code) {
    const tokens = clean(code);
    getProcessAttributes(tokens, "Main");
    getProcessFlow(tokens, "Main");
}
runEsolang(`
   <Main output b aux x y sum final>
    => assign x 2
    => assign  y 2
    => assign  final 'Completed'
    => assign sum <ProcessSum input[x,y]/>
    => err <Log input=err/>
    => assign <Log input=final/>
    => assign x 1
    => assign  y 2
    => assign  final 'Completed'
    => assign sum <ProcessSum input=x,y/>
    => log final
</Main>
<ProcessSum input=a,b output=c aux=text>
    => assign text = 'Hello'
    =>log text
    => assign c=a+b
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
