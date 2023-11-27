import * as React from "react"
import { cn } from '../../lib/utils'
import { ChatList } from './chat-list'
import { EmptyScreen } from './empty-screen'

export function Chat({messages, setInput, className, selectedTheme}) {
  return (
    <div className={`flex justify-center items-center ${selectedTheme === 'dark' ? "dark bg-background" : "light bg-[#D0E7D2]"} `}>
      <div className={cn('min-[100px]:w-full md:w-3/4 lg:w-1/2 pb-[200px] sm:pt-4 md:pt-10', className)}>
        {messages.length ? (
          <div className="mx-auto">
            <div className="z-1 flex justify-center items-center align-center">
              <ChatList messages={messages} selectedTheme={selectedTheme} />
            </div>
          </div>
        ) : (
          <EmptyScreen setInput={setInput} selectedTheme={selectedTheme} />
        )}
      </div>
    </div>
  )
}