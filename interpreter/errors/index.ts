export class CatchedError extends Error {
  constructor(message:string) {
    super(message);
    this.name = "CatchedError"; 
  }
}