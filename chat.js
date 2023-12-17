import { Chat as AgentChat } from "./agent/chat.cjs"

export class Chat extends AgentChat {
  prompt(text) {
    return `[INST]<<SYS>>あなたは日本語で答える賢い日本人のアシスタントです。<</SYS>>${text}[/INST]`
  }
}
