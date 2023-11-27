import * as React from "react"
import { Message } from 'ai'
import Cookies from 'js-cookie';

import { cn } from '../../lib/utils'

import { BiSolidUserCircle, BiMusic } from 'react-icons/bi'


export interface ChatMessageProps {
  message: Message,
  selectedTheme: string
}

export function ChatMessage({ message, selectedTheme, ...props }: ChatMessageProps) {
  return (
    <div
      className={cn('group relative flex items-start')}
      {...props}
    >
      <div
        className={cn(
          'flex h-8 w-8 items-center justify-center',
          'text-primary-foreground border-2 rounded-lg',
          selectedTheme === 'dark'
            ? 'dark bg-primary'
            : 'light border-background bg-[#748E63]',
        )}
      >
        {message.role === 'user' ? Cookies.get('profilePicture') !== "" ?
         <div className={`flex w-full h-full items-center justify-center ${selectedTheme === 'dark' ? "dark bg-background" : "light bg-[#D0E7D2] rounded-lg border-2"}`}>
           <img className={`${selectedTheme === 'dark' ? "dark border-foreground" : "light border-background"} w-full h-full rounded-lg border-2`} src={Cookies.get("profilePicture")} alt="from user's profile">
        </img></div> : <BiSolidUserCircle /> : <BiMusic />}
      </div>
      <div className={`${selectedTheme === 'dark' ? "dark text-foreground" : "light text-[#22311d]"} w-full flex-1 px-1 ml-4 space-y-2 overflow-hidden`}>
          {message.content.replace(/^"(.*)"$/, '$1')}
      </div>
    </div>  
  )
}