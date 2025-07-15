export const baseExample = 
`<Main aux x y sum final>    
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
</ProcessSum>`;

export const baseExampleWithError = 
`<Main aux x y sum final>    
    => log 'start'
    => assign x 2
    => assign y 5
    => call sum <=ProcessSu input x y>
    => err log err
    => log 'sum is' 
    => log sum
</Main>
<ProcessSum input x y output sum aux text>
    => assign text 'Process sum'
    => log text
    => operate sum x + y
</ProcessSum>`;
export const sumNumbersExample = 
`<Main aux x y result>
    => assign x 5
    => assign y 7
    => call result <=Sum input x y>
    => log result
</Main>
<Sum input x y output result>
    => operate result x + y
</Sum>`;
export const multiply = 
`<Main output result aux a b>
    => assign a 4
    => assign b 6
    => operate result a * b
    => log result
</Main>`;

export const concatenate = 
`<Main output message aux first second>
    => assign first 'Hello, '
    => assign second 'world!'
    => operate message first + second
    => log message
</Main>`;

export const getAverage = 
`<Main output avg aux n1 n2 n3 sum>
    => assign n1 10
    => assign n2 20
    => assign n3 30
    => call sum <=Sum3 input n1 n2 n3>
    => operate avg sum / 3
    => log avg
</Main>
<Sum3 input n1 n2 n3 output sum>
    => operate sum n1 + n2 + n3
</Sum3>`;

export const codeExamples= [
    {
        name: 'Base example',
        code: baseExample,
    },
    {
        name: 'Base example with error',
        code: baseExampleWithError,
    },
    {
        name: 'Sum numbers example',
        code: sumNumbersExample,
    },
    {
        name: 'Multiply example',
        code: multiply,
    },
    {
        name: 'Concatenate example',
        code: concatenate,
    },
    {
        name: 'Get average example',
        code: getAverage,
    }
]