import * as React from "react"
import { useChat, type Message } from 'ai/react'

import { cn } from '../../lib/utils'
import { ChatList } from './chat-list'
import { ChatPanel } from './chat-panel'
import { EmptyScreen } from './empty-screen'
// Not sure what this anchor does yet
import { ChatScrollAnchor } from './chat-scroll-anchor'
import { useLocalStorage } from '../../lib/hooks/use-local-storage'

// import { useState } from 'react'
import { useToast } from '../ui/use-toast'



// const IS_PREVIEW = process.env.VERCEL_ENV === 'preview'
export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}

export function Chat({ id, initialMessages, className }: ChatProps) {
  const { toast } = useToast()
  const [previewToken, setPreviewToken] = useLocalStorage<string | null>(
    'ai-token',
    null
  )
  // May need this later
  // const [previewTokenDialog, setPreviewTokenDialog] = useState(IS_PREVIEW)
  // const [previewTokenInput, setPreviewTokenInput] = useState(previewToken ?? '')
  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      initialMessages,
      id,
      body: {
        id,
        previewToken
      },
      api: "https://w6vivobrm3.loclx.io/chat",
      onResponse(response) {
        // display error on screen with toast
        if (response.status === 401 ) {
            toast({
                title: "Uh oh! Something went wrong.",
                description: response.statusText,
            })
        }
        else{
          console.log("onResponse called");
          console.log(response);
        }
      }
    })
  return (
    <div className="flex justify-center -z-50">
      <div className={cn('min-[100px]:w-full md:w-3/4 lg:w-1/2 pb-[200px] pt-4 md:pt-10', className)}>
        {messages.length ? (
          <div className="mx-auto max-w-2xl px-4">
            <div className="rounded-lg border bg-background p-8 items-center align-center">
              <ChatList messages={messages} />
              <ChatScrollAnchor trackVisibility={isLoading} />
            </div>
          </div>
        ) : (
          <EmptyScreen setInput={setInput} />
        )}
      </div>
      <ChatPanel
        id={id}
        isLoading={isLoading}
        stop={stop}
        append={append}
        reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
      />

      {/* <Dialog open={previewTokenDialog} onOpenChange={setPreviewTokenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter your OpenAI Key</DialogTitle>
            <DialogDescription>
              If you have not obtained your OpenAI API key, you can do so by{' '}
              <a
                href="https://platform.openai.com/signup/"
                className="underline"
              >
                signing up
              </a>{' '}
              on the OpenAI website. This is only necessary for preview
              environments so that the open source community can test the app.
              The token will be saved to your browser&apos;s local storage under
              the name <code className="font-mono">ai-token</code>.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={previewTokenInput}
            placeholder="OpenAI API key"
            onChange={e => setPreviewTokenInput(e.target.value)}
          />
          <DialogFooter className="items-center">
            <Button
              onClick={() => {
                setPreviewToken(previewTokenInput)
                setPreviewTokenDialog(false)
              }}
            >
              Save Token
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </div>
  )
}