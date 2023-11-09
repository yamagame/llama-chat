const { Prompt } = require("./prompt.cjs")
const { Chat } = require("./chat.cjs")
const { Speech } = require("./speech.cjs")
const child_process = require("child_process")
const fetch = require("node-fetch")

const PORT = process.env["AGENT_PORT"] || 3092
const VOICE_RECORDER_HOST = process.env["VOICE_RECORDER_HOST"] || ""

// 音声認識開始
async function listen() {
  if (VOICE_RECORDER_HOST !== "") {
    try {
      await fetch(`${VOICE_RECORDER_HOST}/listen/start`, { method: "POST" })
    } catch (err) {
      if (err.code === "ECONNREFUSED") {
        console.log("音声認識サーバーが見つかりません")
      } else {
        console.error(err)
      }
    }
  }
}

// チャットサーバー
function server(chat, PORT) {
  return new Promise(resolve => {
    const app = require("http").createServer(handler)

    function requestHandler(req, callback) {
      let buf = Buffer.from([])
      req.on("data", (data) => {
        buf = Buffer.concat([buf, data])
      })
      req.on("close", () => { })
      req.on("end", () => {
        callback(buf.toString())
      })
    }

    function handler(req, res) {
      if (req.method === "POST") {
        const url = require("url").parse(req.url)
        const params = require("querystring").parse(url.search)
        req.params = params

        // curl -X POST -d '{"text":"こんにちは"}' http://localhost:3092/transcribe
        if (url.pathname === "/transcribe") {
          return requestHandler(req, (data) => {
            try {
              const { text } = JSON.parse(data)
              // console.log(JSON.parse(data))
              if (chat) {
                // LLM問い合わせ
                chat.ask(text)
              }
              res.end("OK\n")
            } catch {
              res.end("ERR\n")
            }
          })
        }
      }
    }

    app.listen(PORT, () => {
      resolve(0)
    })
  })
}

async function main() {
  const speech = new Speech()
  const prompt = new Prompt()

  const chat = new Chat({ scriptpath: "./scripts/elyza-chat.sh" })

  // LLM応答
  chat.on("data", ({ text }) => {
    console.log(":", text)
    // 発話
    speech.utter(text)
  })

  // 発話終了
  speech.on("end", () => {
    prompt.prompt()
    listen()
  })

  // テキスト入力
  prompt.on("line", (data) => {
    // LLM問い合わせ
    chat.ask(data)
  })

  // チャットサーバー開始
  await server(chat, PORT)
  console.log(`llama-chat-agent listening on port ${PORT}!`)

  prompt.run()

  listen()
}

if (require.main === module) {
  main().then()
}
