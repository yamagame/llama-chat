import readline from "readline";
import child_process from "child_process"

const r = readline.createInterface({
  input: process.stdin,
  terminal: false,
});

function propmt() {
  console.log(new Date())
  process.stdout.write("> ")
}
propmt()

r.on("line", (line) => {
  console.log(new Date())
  const head = `[INST] <<SYS>>あなたは誠実で優秀な日本人のアシスタントです。<</SYS>>`
  const prompt = `${head}${line}[/INST]`
  const childProcess = child_process.spawn('./scripts/elyza.sh', [prompt])

  let s = ""
  childProcess.stdout.on('data', (chunk) => {
    s += chunk.toString()
  })

  childProcess.stderr.on('data', (chunk) => {
    // console.log(chunk.toString())
  })

  childProcess.on("close", (code) => {
    s = s.trim()
    if (s.startsWith(prompt)) {
      s = s.slice(prompt.length);
    }
    console.log(s.trim())
    console.log("")
    propmt()
  })
});

r.on("close", () => {
  console.log(JSON.stringify(result));
});
