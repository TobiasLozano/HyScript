function parse(code) {
    return code.trim().split('');
}

function runEsolang(code) {
    const tokens = parse(code);
    console.log(tokens);
    let value = 0;
    tokens.forEach(token => {
        if (token === '+') value++;
        else if (token === '-') value--;
        else if (token === 'p') console.log(value);
        
    });
}

runEsolang("+++-p--p");


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

