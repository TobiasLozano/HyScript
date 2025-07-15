# HyScript

HyScript is a programming language that uses hypertext-like tags (similar to HTML) for defining functions and processes. It is designed for clear process flow, variable management, and error handling.

---

## Table of Contents

- [Program Structure](#program-structure)
- [Instruction Types](#instruction-types)
- [Available Operators](#available-operators)
- [Process Flow Example](#process-flow-example)
- [Workflow Details](#workflow-details)
  - [Main Process](#main-process)
  - [Process Calls](#process-calls)
  - [Error Handling](#error-handling)

---

## Program Structure

A HyScript program is composed of processes defined with tags. The main entry point is a `<Main>` process.

```xml
<Main output ... aux ...>
    ... instructions ...
</Main>
```

- **Process Tags:** Each process has an opening and closing tag with its name.
- **Variable Declarations:** In the opening tag, declare:
  - `output` variables (returned values)
  - `aux` variables (used for intermediate storage)
  - `input` variables (parameters, if needed)

**Example:**
```xml
<Action output result aux x y sum final>
```

---

## Instruction Types

Instructions are written inside process tags and separated by the `=>` operator.

### assign

Assign a value to a variable (string or number):

```
=> assign message 'Hello world'
=> assign year 2025
```

### operate

Store a calculated result in a variable. Supports math operations with variables or numbers.

```
=> operate sum x + y
=> operate sub 3 - 7
=> operate mult 3 * 7
=> operate div 3 / 7
```

**String concatenation:** Only variables can be concatenated, not literals.

Bad:
```
=> operate message 'Hello ' + 'World'
```
Good:
```
=> assign greet 'Hello '
=> assign name 'world'
=> operate message greet + name
```

### call

Call another process and store its output.

```
=> call sum <=ProcessSum input x, y>
```

**Example:**
```xml
<Main output b aux x y sum>
    => assign x 2
    => assign y 8
    => call sum <=ProcessSum input x y>
    => log sum
</Main>
<ProcessSum input x y output sum>
    => operate sum x + y
</ProcessSum>
```

### log

Log a value to the console (string, number, or variable):

```xml
<Main aux value>
    => log 1
    => assign value 2
    => log value 
    => log 'hello' 
    => assign value 'hi'
    => log value
</Main>
```

### err

Catch errors from the last instruction, log them, and continue execution.

```xml
<Main aux value>
    => assign value 2d
    => err log err
    => log 'Continue' 
</Main>
```
**Output:**
```
CatchedError: Invalid value 2d for variable 'value' 
Continue 
```

Without `err`:
```xml
<Main aux value>
    => assign value 2d
    => log 'Continue' 
</Main>
```
**Output:**
```
Uncaught error:Invalid value 2d for variable 'value'
```

---

## Process Flow Example

```xml
<Main aux x y sum final>    
    => log 'start'
    => assign x 2
    => assign y 5
    => call sum <=ProcessSum input x y>
    => err log err
    => log 'sum is' 
    => log sum
</Main>
<ProcessSum input x y output sum aux text>
    => assign text 'Process sum'
    => log text
    => operate sum x + y
</ProcessSum>
```

---

## Workflow Details

### Main Process

- Validate `<Main>` tag open and close.
- Validate input, output, and aux variable declarations.
- Validate variable names and execution.
- Create variable objects and assign values.

**Example:**
```xml
<Main output b aux x y sum final> </Main>
```

### Process Calls

- Search for process declaration tags.
- Validate input, output, and aux variables for called processes.
- Validate variable names.
- Create variable objects and return output.

### Error Handling

- On syntax error, save the error message.
- If the next line is not an `=> err` instruction, stop execution and show the error.
- If the next line is `=> err`, continue execution.
