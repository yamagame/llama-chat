const EventEmitter = require("events")
const child_process = require("child_process")

class Speech extends EventEmitter {
  constructor({ script }) {
    super()
    this.script = script
    this._speaking = false
    this.messages = []
  }

  get speaking() {
    return this._speaking
  }

  utter(text) {
    this.messages.push(...text.split("\n").filter(v => v.trim() != ""))
    if (!this._speaking) {
      this.emit("start")
      const exec = () => {
        if (this.messages.length > 0) {
          this._speaking = true
          const text = this.messages.shift()
          child_process.exec(`${this.script} "${text.replaceAll(",", "")}"`, (err, stdout, stderr) => {
            if (err) {
              console.log(`stderr: ${err}`)
              this.messages.splice(0)
              this._speaking = false
              this.emit("end")
              return
            }
            exec()
          })
        } else {
          this._speaking = false
          this.emit("end")
        }
      }
      exec()
    }
  }
}

module.exports = {
  Speech,
}
