# HyScript
Hypertext tags like html for functions and process
HTML like tags for functions, conditionals, attributes: inputs outputs
body tag: proccess
***
## Extension file
.hy
***
## available operators
```
 +  
  -  
  *  
  /
```
***
## FLOW EXAMPLE
``` xml
  <Main output b aux x y sum final>
    => assign x 2
    => assign y 8
    => assign final 'Completed'
    => call sum <=ProcessSum input x, y>
    => err log err
    => assign b 1
    => log final
</Main>
<ProcessSum input x y output sum aux text>
    => assign text 'Hello'
    => log 'text'
    => log text
    => operate sum x + y
    => log 'sum is' 
    => log sum
</ProcessSum>
```
***
## WORK FLOW 
### MAIN

- Validate main tag open and closing

    ``` xml
    <Main > </Main>
    ```
- Validate input, output and aux
    ``` xml
    <Main output=b aux=x,y,sum,final> </Main>
    ```
- validate var names used and execution
    ``` xml
    =>x 1
    => y 2
    => final 'Completed'
    ```
- Create var object
- fill values
___
### GET PROCESS return 
- Search for Function  declaration Syntax tag
    ``` xml
    <ProcessSum input=a,b output=c aux=text> </ProcessSum>
    ```
- Validate input, output and aux call process
    ``` xml
    =>sum <ProcessSum input[x,y]/>
    ```
- Validate aux
    ``` xml
    =>text = 'Hello'
    ```
- validate var names used
- Create var object
- return output 
____
### ERROR Handling
- Syntax error: save message
- Process line (save error message from last line)
- if next line is not =err>, stop process
    ``` xml
    =>sum <ProcessSum input=x,y/>
    STOP PROGRAM AND SHOW ERROR
    =><Log input=final/>
    ```
- if it does: continue
    ``` xml
    =>sum <ProcessSum input[x,y]/>
    =err><Log input=err/>
    =><Log input=final/>
    ```
    