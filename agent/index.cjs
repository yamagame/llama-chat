const { Prompt } = require("./prompt.cjs")
const { Chat } = require("./chat.cjs")
const child_process = require("child_process")

function main() {
  let speaking = false
  const messages = []
  const prompt = new Prompt()
  const chat = new Chat({ scriptpath: "./scripts/elyza-chat.sh" })
  chat.on("close", () => {
    //
  })
  chat.on("end", () => {
    prompt.prompt()
  })
  chat.on("data", ({ text }) => {
    console.log(":", text)
    speech(text)
  })
  prompt.run(chat)

  function speech(text) {
    messages.push(...text.split("\n").filter(v => v.trim() != ""))
    if (!speaking) {
      while (messages.length > 0) {
        const text = messages.shift()
        speaking = true
        child_process.execSync(`./scripts/utterance.sh "${text.replaceAll(",", "")}"`)
      }
      speaking = false
    }
  }
}

if (require.main === module) {
  main()
}
