import * as React from "react"
import { Message } from 'ai'


import { cn } from '../../lib/utils'

import { BiSolidUserCircle } from 'react-icons/bi'
import {TbPlaylist} from "react-icons/tb"


export interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message, ...props }: ChatMessageProps) {
  return (
    <div
      className={cn('flex justify-start border-2 border-yellow-300 items-start relative')}
      {...props}
    >
      <div
        className={cn(
          'flex h-8 w-8  items-center justify-center rounded-md border-2 drop-shadow-md',
          message.role === 'user'
            ? 'bg-background'
            : 'bg-primary text-primary-foreground'
        )}
      >
        {message.role === 'user' ? <BiSolidUserCircle /> : <TbPlaylist size={20} />}
      </div>
      <div className="w-fit max-w-1/2 break-all ml-4">
            {message.content}
      </div>
    </div>  
  )
}