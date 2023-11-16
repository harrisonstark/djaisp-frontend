import * as React from "react"
import { type UseChatHelpers } from 'ai/react'

import { Button } from '../ui/button'
import { PromptForm } from './prompt-form'
import { ButtonScrollToBottom } from './button-scroll-to-bottom'
import { FiRefreshCw } from 'react-icons/fi'

export interface ChatPanelProps
  extends Pick<
    UseChatHelpers,
    | 'append'
    | 'isLoading'
    | 'reload'
    | 'messages'
    | 'stop'
    | 'input'
    | 'setInput'
  > {
  id?: string,
  currentAppLayout?: string,
  selectedTheme?: string,
}

export function ChatPanel({
  id,
  isLoading,
  append,
  input,
  setInput,
  messages,
  currentAppLayout,
  selectedTheme
}: ChatPanelProps) {
  return (
    <div className="z-[1000] flex justify-center fixed inset-x-0 absolute bottom-0 min-[100px]:max-w-full  sm:max-w-2xl mx-auto">
      {/* <ButtonScrollToBottom /> */}
      <div className={`w-full ${selectedTheme == 'dark' ? "dark bg-background" : "light bg-[#D0E7D2]"}
       ${currentAppLayout == "A" ? "-ml-4 bg-background" : ""}`}>
        <div className="flex  items-center justify-center">
          {isLoading ? (
            <Button
              variant="outline"
              className="bg-background"
              disabled
            >
              <FiRefreshCw className="mr-2" />
              Loading...
            </Button>
          ) : ((<></>))}
        </div>
        <div className={`${selectedTheme == 'dark' ? "dark bg-background" : "light bg-[#D0E7D2]"} h-max`}>
        <div className={`bg-background ${currentAppLayout == "A" ? "mb-14 " : ""} space-y-4 border-t shadow-lg sm:rounded-xl sm:border-0`}>
            <PromptForm
                onSubmit={async value => {
                await append({
                    id,
                    content: value,
                    role: 'user'
                })
                }}
                input={input}
                setInput={setInput}
                isLoading={isLoading}
                selectedTheme={selectedTheme}
            />
            {/* <p className='px-2 text-center text-xs leading-normal text-muted-foreground'>
                Test Footer
            </p> */}
        </div>
        </div>
      </div>
    </div>  
  )
}