   export const baseExample=  `
   <Main output b aux x y sum final>
    => assign x 2
    => assign y 5
    => assign final 'Completed'
    => err log err
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
</ProcessSum>`