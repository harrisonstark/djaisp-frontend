import * as React from "react"
import { type Message } from 'ai'

import { Separator } from '../ui/separator'
import { ChatMessage } from './chat-message'

export interface ChatList {
  messages: Message[],
  selectedTheme: string,
  selectedLayout: string
}

export function ChatList({ messages, selectedTheme, selectedLayout }: ChatList) {
  if (!messages.length) {
    return null
  }

  return (
    <div className={`z-1 sm:border ${selectedTheme === 'dark' ? "dark" : "light border-background"}   rounded-lg p-8  sm:max-w-2xl w-full flex flex-col justify-center px-8`}>
      {selectedLayout === 'A' ? (messages.map((message, index) => (
        <div key={index}>
          {index < messages.length - 1 && (
            <div className={`border-b pb-6 mb-6 ${selectedTheme === "dark" ? "border-white" : "border-black"}`}>
              <ChatMessage message={message} selectedTheme={selectedTheme}/>
            </div>
          )}
          {index === messages.length - 1 && (
            <div>
              <ChatMessage message={message} selectedTheme={selectedTheme}/>
            </div>
          )}
        </div>
      ))) : 
      (messages.slice(0).reverse().map((message, index) => (
        <div key={index}>
          {index < messages.length - 1 && (
            <div className={`border-b pb-6 mb-6 ${selectedTheme === "dark" ? "border-white" : "border-black"}`}>
              <ChatMessage message={message} selectedTheme={selectedTheme}/>
            </div>
          )}
          {index === messages.length - 1 && (
            <div>
              <ChatMessage message={message} selectedTheme={selectedTheme}/>
            </div>
          )}
        </div>
      )))
      }
    </div>
  )
}