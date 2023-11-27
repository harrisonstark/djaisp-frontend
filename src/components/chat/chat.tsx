import * as React from "react"
import { useChat, type Message } from 'ai/react'

import { cn } from '../../lib/utils'
import { ChatList } from './chat-list'
import { ChatPanel } from './chat-panel'
import { EmptyScreen } from './empty-screen'
// import { ChatScrollAnchor } from './chat-scroll-anchor' Not sure what this anchor does yet
import { useLocalStorage } from '../../lib/hooks/use-local-storage'
import Cookies from 'js-cookie';

// import { useState } from 'react'
import { useToast } from '../ui/use-toast'
import { useEffect } from "react"



// // const IS_PREVIEW = process.env.VERCEL_ENV === 'preview'
// export interface ChatProps extends React.ComponentProps<'div'> {
//   initialMessages?: Message[]
//   id?: string
// }

export function Chat({messages, setInput, className, selectedTheme, selectedLayout}) {
//   const { toast } = useToast()
//   const [previewToken] = useLocalStorage<string | null>(
//     'ai-token',
//     null
//   )
//   function showToastError(descriptionText){
//     toast({
//       title: "Error: Oops, I dropped my baton, please try again later.",
//       description: descriptionText,
//     })
//   }
//   // May need this later
//   // const [previewTokenDialog, setPreviewTokenDialog] = useState(IS_PREVIEW)
//   // const [previewTokenInput, setPreviewTokenInput] = useState(previewToken ?? '')
//   const { messages, append, reload, stop, isLoading, input, setInput } =
//     useChat({
//       initialMessages,
//       id,
//       body: {
//         id,
//         previewToken
//       },
//       api: "http://localhost:8989/chat",
//       onResponse(response) {
//         if (response.status === 401) {
//             showToastError(response.statusText);
//         }
//       }
//     })
//   useEffect(() => {
//     if(messages.length && messages.length % 2 === 0) {
//       Cookies.set("userRecentMessage", JSON.stringify(messages[messages.length - 2]), { path: "/" });
//       Cookies.set("maistroRecentMessage", JSON.stringify(messages[messages.length - 1]), { path: "/" });
//     }
//   }, [messages]);
//   function getRecentMessages(){
//     messages.push(JSON.parse(Cookies.get("userRecentMessage")));
//     messages.push(JSON.parse(Cookies.get("maistroRecentMessage")));
//   }
//   if(messages.length === 0 && Cookies.get('userRecentMessage') && Cookies.get('maistroRecentMessage')) {
//     getRecentMessages();
//   }

  return (
    <div className={`flex justify-center items-center ${selectedTheme == 'dark' ? "dark bg-background" : "light bg-[#D0E7D2]"} `}>
      <div className={cn('min-[100px]:w-full md:w-3/4 lg:w-1/2 pb-[200px] sm:pt-4 md:pt-10', className)}>
        {messages.length ? (
          <div className="mx-auto">
            <div className="z-1 flex justify-center items-center align-center">
              <ChatList messages={messages} selectedTheme={selectedTheme} selectedLayout={selectedLayout} />
              {/* <ChatScrollAnchor trackVisibility={isLoading} /> */}
            </div>
          </div>
        ) : (
          <EmptyScreen setInput={setInput} selectedTheme={selectedTheme} />
        )}
        {/* <ChatPanel
          id={id}
          isLoading={isLoading}
          stop={stop}
          append={append}
          reload={reload}
          messages={messages}
          input={input}
          setInput={setInput}
        /> */}
      </div>
      
      

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