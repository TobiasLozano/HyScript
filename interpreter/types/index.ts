export type tagTokenType = "default" | "input" | "output" | "aux";
export interface Variable {
  name: string;
  value: string | number | boolean | null;
}
export interface Process {
  name: string;
  outputVars: Variable[];
  inputVars: Variable[];
  auxVars: Variable[];
}
export type StepType = "assign" | "log" | "err" | "operate" | "call";
export interface ProcessStep {
  type: StepType;
  instruction: string;
}

export type LogType = "log" | "catch" | "error";
export interface ProcessLog{
  type:LogType,
  value :string
}