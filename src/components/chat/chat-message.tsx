import * as React from "react"
import { Message } from 'ai'


import { cn } from '../../lib/utils'

import { BiSolidUserCircle, BiMusic } from 'react-icons/bi'


export interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message, ...props }: ChatMessageProps) {
  return (
    <div
      className={cn('group relative flex items-start')}
      {...props}
    >
      <div
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-md border-2 drop-shadow-md',
          message.role === 'user'
            ? 'bg-background'
            : 'bg-primary text-primary-foreground'
        )}
      >
        {message.role === 'user' ? <BiSolidUserCircle /> : <BiMusic />}
      </div>
      <div className="w-full flex-1 px-1 ml-4 space-y-2 overflow-hidden">
        {/* WE DONT NEED MARKDOWN RESPONSES!!!!!!!!!! */}
        {/* <MemoizedReactMarkdown
          className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
        //   remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>
            },
            code({ node, inline, className, children, ...props }) {
              if (children.length) {
                if (children[0] == '▍') {
                  return (
                    <span className="mt-1 cursor-default animate-pulse">▍</span>
                  )
                }

                children[0] = (children[0] as string).replace('`▍`', '▍')
              }

              const match = /language-(\w+)/.exec(className || '')

              if (inline) {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }

              return (
                <CodeBlock
                  key={Math.random()}
                  language={(match && match[1]) || ''}
                  value={String(children).replace(/\n$/, '')}
                  {...props}
                />
              )
            }
          }}
        > */}
          {message.content.replace(/^"(.*)"$/, '$1')}
        {/* </MemoizedReactMarkdown> */}

        {/* WE DO NOT NEED TO COPY CHAT MESSAGES ATM */}
        {/* <ChatMessageActions message={message} /> */}
      </div>
    </div>  
  )
}