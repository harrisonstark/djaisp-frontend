import * as React from "react"
import { type Message } from 'ai'

import { Separator } from '../ui/separator'
import { ChatMessage } from './chat-message'

export interface ChatList {
  messages: Message[],
  selectedTheme: string
}

export function ChatList({ messages, selectedTheme }: ChatList) {
  if (!messages.length) {
    return null
  }

  return (
    <div className={`z-1 sm:border ${selectedTheme === 'dark' ? "dark" : "light border-background"}   rounded-lg p-8  sm:max-w-2xl w-full flex flex-col justify-center px-8`}>
      {messages.map((message, index) => (
        <div key={index}>
          <ChatMessage message={message} selectedTheme={selectedTheme}/>
          {index < messages.length - 1 && (
            <Separator className="my-4 md:my-8" />
          )}
        </div>
      ))}
    </div>
  )
}