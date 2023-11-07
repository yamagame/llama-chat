const readline = require("readline")

class Prompt {
  prompt() {
    console.log(new Date())
    console.log("")
    process.stdout.write("> ")
  }

  run(chat) {
    const r = readline.createInterface({
      input: process.stdin,
      terminal: false,
    });
    this.prompt()

    r.on("line", (line) => {
      console.log(new Date())
      chat.ask(line)
    });

    r.on("close", () => {
      console.log(JSON.stringify(result));
    });
  }
}

module.exports = {
  Prompt,
}
