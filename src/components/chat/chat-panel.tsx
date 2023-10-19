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
  id?: string
}

export function ChatPanel({
  id,
  isLoading,
  append,
  input,
  setInput,
  messages
}: ChatPanelProps) {
  return (
    <div className="z-[1000] flex justify-center inset-x-0 absolute bottom-0 min-[100px]:max-w-full  sm:max-w-xl md:max-w-2xl mx-auto">
      <ButtonScrollToBottom />
      <div className=" w-full -ml-4">
        <div className="flex h-10 items-center justify-center">
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
        <div className="bg-background h-max pb-2">
        <div className="bg-background  mb-4 space-y-4 border-t px-4 py-2 shadow-lg sm:rounded-xl sm:border md:py-4">
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