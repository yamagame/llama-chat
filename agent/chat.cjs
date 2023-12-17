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
    this.prompttext = ""
    this.ready = true
  }

  clear() {
    if (this.closetimer) clearTimeout(this.closetimer)
    if (this.answertimer) clearTimeout(this.answertimer)
    this.closetimer = 0
    this.answertimer = 0
  }

  timeout(time) {
    if (this.answertimer) clearTimeout(this.answertimer)
    this.answertimer = setTimeout(() => {
      this.answertimer = 0
      this.message = ""
      if (!this.ready) {
        this.ready = true
        this.emit("end")
      }
    }, time)
  }

  downout(time) {
    if (this.closetimer) clearTimeout(this.closetimer)
    this.closetimer = setTimeout(() => {
      this.closetimer = 0
      this.proc = null
      if (!this.ready) {
        this.ready = true
        this.emit("close")
      }
    }, time)
  }

  launch() {
    this.ready = false
    if (!this.proc) {
      this.proc = child_process.spawn(this.scriptpath)

      this.proc.stdout.on('data', (chunk) => {
        try {
          const text = chunk.toString()
          this.message += text
          this.parse()
        } catch (err) {
          console.error(err)
        }
        this.timeout(this.answertime)
        this.downout(this.closetime)
      })

      this.proc.stderr.on('data', (chunk) => {
        // console.log(chunk.toString())
      })

      this.timeout(this.closetime)
    }
  }

  prompt(text) {
    return `[INST]<<SYS>>あなたは日本語で答える賢い日本人のアシスタントです。<</SYS>>${text}[/INST]`
  }

  write(text) {
    this.clear()
    this.launch()
    const ask = this.prompt(text)
    if (this.proc) {
      this.prompttext = ask
      this.proc.stdin.write(this.prompttext + "\n");
    }
    this.downout(this.closetime)
    return ask
  }

  ask(text) {
    if (this.ready) {
      this.write(text)
    }
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
