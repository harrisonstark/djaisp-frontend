import * as React from "react"
import { type Message } from 'ai'

import { Separator } from '../ui/separator'
import { ChatMessage } from './chat-message'

export interface ChatList {
  messages: Message[]
}

export function ChatList({ messages }: ChatList) {
  if (!messages.length) {
    return null
  }

  return (
    <div className="z-0 border-2 px-8 py-10 rounded-lg w-full flex flex-col justify-center">
      {messages.map((message, index) => (
        <div key={index}>
          <ChatMessage message={message} />
          {index < messages.length - 1 && (
            <Separator className="my-4 md:my-8" />
          )}
        </div>
      ))}
    </div>
  )
}