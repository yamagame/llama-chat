const EventEmitter = require("events")
const child_process = require("child_process")

class Chat extends EventEmitter {
  constructor({ scriptpath }) {
    super()
    this.scriptpath = scriptpath
    this.proc = null
    this.message = ""
    this.answertimer = 0
    this.closetimer = 0
    this.answertime = 300
    this.closetime = 10000
    this.next = 0
    this.prompttext = ""
  }

  downout(time) {
    if (this.closetimer) clearTimeout(this.closetimer)
    this.closetimer = setTimeout(() => {
      this.proc = null
      this.emit("close")
    }, time)
  }

  timeout(time) {
    if (this.answertimer) clearTimeout(this.answertimer)
    this.answertimer = setTimeout(() => {
      this.message = ""
      this.emit("end")
    }, time)
  }

  launch() {
    if (!this.proc) {
      this.proc = child_process.spawn(this.scriptpath)

      this.proc.stdout.on('data', (chunk) => {
        const text = chunk.toString()
        this.message += text
        this.parse()
        this.timeout(this.answertime)
        this.downout(this.closetime)
      })

      this.proc.stderr.on('data', (chunk) => {
        // console.log(chunk.toString())
      })

      this.timeout(this.closetime)
      this.downout(this.closetime)
    }
  }

  write(text) {
    this.launch()
    const ask = `[INST]<<SYS>>あなたは賢い日本人のアシスタントです。<</SYS>>${text}[/INST]`
    if (this.proc) {
      this.prompttext = ask
      this.proc.stdin.write(this.prompttext + "\n");
      this.downout(this.closetime)
    }
    return ask
  }

  ask(text) {
    this.next = 1
    this.write(text)
  }

  parse() {
    const text = this.message
    if (text.indexOf("。") >= 0 || text.indexOf("？") >= 0 || text.indexOf("！") >= 0 || text.indexOf("\n") >= 0) {
      const res = this.message.trim()
      this.message = ""
      if (res != "") {
        const d = res.split("\n")
        d.filter(text => text != "").forEach(text => this.emit("data", { text }))
      }
    }
  }
}

module.exports = {
  Chat,
}
