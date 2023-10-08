import * as React from "react"
import { type UseChatHelpers } from 'ai/react'

import { Button } from '../ui/button'
import { PromptForm } from './prompt-form'
import { ButtonScrollToBottom } from './button-scroll-to-bottom'
import { BsStopCircle } from 'react-icons/bs'
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
  stop,
  append,
  reload,
  input,
  setInput,
  messages
}: ChatPanelProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 overflow-auto">
      <ButtonScrollToBottom />
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="flex h-10 items-center justify-center">
          {isLoading ? (
            <Button
              variant="outline"
              onClick={() => stop()}
              className="bg-background"
            >
              <BsStopCircle className="mr-2" />
              Stop generating
            </Button>
          ) : (
            messages?.length > 0 && (
              <Button
                variant="outline"
                onClick={() => reload()}
                className="bg-background"
              >
                <FiRefreshCw className="mr-2" />
                Regenerate response
              </Button>
            )
          )}
        </div>
        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
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
  )
}