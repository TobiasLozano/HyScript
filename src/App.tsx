import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {runEsolang} from '../interpreter/index'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  useEffect(() => {
   runEsolang(`
   <Main output b aux x y sum final>
    => assign x 2
    => assign y 5
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
  }, [])
  

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
