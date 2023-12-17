import io from "socket.io-client";
import child_process from "child_process"
import { Chat } from "./chat.js"

const HOST = process.env.DORA_ENGINE_HOST || "localhost"
const PORT = process.env.DORA_ENGINE_PORT || "3090"

const socket = io.connect(`ws://${HOST}:${PORT}/chat`, {
  // auth: {
  //   client_id,
  // },
  reconnection: true,
  reconnectionDelay: 1000,
  // transports: ['websocket'],
  rejectUnauthorized: false
});

const chat = new Chat({ scriptpath: "./scripts/elyza-chat.sh" })
const endmark = "[end]"

const messages = []
let state = "idle"
let timeout = 0

socket.on("connect", (data) => {
  console.log("Connected");
  socket.emit("notify", { role: "chatServer" })
})

socket.on("reset", (payload, callback) => {
  console.log("reset", payload)
  if (timeout) clearTimeout(timeout)
  timeout = 0
  messages.splice(0)
  if (callback) callback()
})

socket.on("ask", (payload, callback) => {
  console.log("ask", payload)
  if (timeout) clearTimeout(timeout)
  timeout = 0

  console.log(payload)
  messages.splice(0)

  chat.removeAllListeners()

  chat.on("end", () => {
    messages.push({ text: endmark })
  })

  chat.on("close", () => {
    messages.push({ text: endmark })
  })

  // LLM応答
  chat.on("data", (payload) => {
    messages.push(payload)
  })

  chat.ask(payload.text)

  state = "playing"

  if (callback) callback()
})

socket.on("get", (payload, callback) => {
  if (state !== "playing") {
    if (callback) callback({ text: "error" })
    return
  }
  const wait = () => {
    if (messages.length > 0) {
      const payload = messages.shift()
      console.log(">", payload)
      if (callback) callback(payload)
      return
    }
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      if (state === "playing") {
        wait()
      }
    }, 100)
  }
  wait()
})

socket.on('disconnect', (data) => {
  console.log("Disconnected")
});
