const EventEmitter = require("events")
const readline = require("readline")

class Prompt extends EventEmitter {
  constructor() {
    super()
  }

  prompt() {
    console.log(new Date())
    console.log("")
    process.stdout.write("> ")
  }

  run() {
    const r = readline.createInterface({
      input: process.stdin,
      terminal: false,
    });
    this.prompt()
    this.emit("start")

    r.on("line", (line) => {
      console.log(new Date())
      this.emit("line", line)
    });

    r.on("close", () => {
      console.log(JSON.stringify(result));
      this.emit("close")
    });
  }
}

module.exports = {
  Prompt,
}
