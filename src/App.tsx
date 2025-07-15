import { useState, type ChangeEvent } from "react";
import { runEsolang } from "../interpreter/index";
import "./App.css";
import type { ProcessLog } from "../interpreter/types";
import { baseExample, codeExamples } from "./examples";

function App() {
  const [logs, setLogs] = useState<ProcessLog[]>([]);
  const [code, setCode] = useState(baseExample)
  const [command, setCommand] = useState("");
  const addLog = (log: ProcessLog) => {
    setLogs((prev) => {
      const newLog: ProcessLog = {
        type: log.type,
        value: `${log.value} \x1b`,
      };
      return [...prev, newLog];
    });
  };

  const handleCode = (e:ChangeEvent<HTMLTextAreaElement>)=>{
   setCode(e.target.value);

  }
  
  const writeCommand = async () => {
    setCommand("");
    const text = "run index.hy";
    const letters = text.split("");
    for (let i = 0; i < letters.length; i++) {
      const letter = letters[i];
      setTimeout(() => {
        setCommand((prev) => `${prev}${letter}`);
      }, 100*(i+1));
    }
  };

  const handleRun = async () => {
    await writeCommand();
    setLogs([]);
      setTimeout(() => {

    runEsolang(code,
      addLog
    )},2000);
  };

  return (
    <main>
      <h2>HyScript playground</h2>
      <div className="playground">
        <div className="editor">
        <div className="example">
         
         
         {/* code examples select */}
         <select name="" id="" onChange={(e) => {
            setCode(e.target.value);
          }}>
          {codeExamples.map((example) => {
            return (
              <option
                key={example.name}
                value={example.code}
                selected={example.code === code}
              >
                {example.name}
              </option>
            );
          })}
         </select>
        </div>
          <div className="code">
            <textarea rows={20} style={{ width: "90%" }} value={code} onChange={handleCode}></textarea>
          </div>
          <button onClick={() => handleRun()}>Run program</button>
        </div>
        <div className="output">
          <div className="command">
            <span className="machine">hyscript@machine</span>
            <span className="decorator">{" ~ "}</span>
            <span className="detail">{command}</span>
          </div>

          {logs.map((log) => {
            return (
              <div className={log.type}>
                 {log.value}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export default App;
