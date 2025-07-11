export default function clearQuotes(text:string){
    return text.replace(/['"]+/g, '')
}