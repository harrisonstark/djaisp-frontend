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
      className={'group relative flex items-start'}
      {...props}
    >
      <div className="flex h-8 w-8 items-center justify-center">
        {/* If message is user and they have profile pic */}
        {(message.role === 'user' && Cookies.get("profilePicture") === "dog") ? (
          <div className={`flex w-full h-full items-center justify-center `}>
            <img className={`h-8 w-8 rounded-lg ${selectedTheme === "dark" ? "border-2 rounded-lg" : "border-[#22311d] border-2"}`} src={Cookies.get("profilePicture")} alt="from user's profile"/>
          </div>
        ) : 
        /* Message is user but they do not have profile pic */
        (message.role === 'user' && Cookies.get("profilePicture") !== "") ? 
          <div className={`flex w-8 h-8 items-center justify-center rounded-lg ${selectedTheme === "dark" ? "bg-primary border-2" : "bg-[#748E63] border-[#22311d] border-2"}`}>
            <BiSolidUserCircle fill={`${selectedTheme === "dark" ? "black" : "#22311d"}`} />
          </div>
      : 
      /* Message is from bot */
      <div className={`flex w-8 h-8 items-center justify-center rounded-lg ${selectedTheme === "dark" ? "bg-primary border-2" : "bg-[#748E63] border-[#22311d] border-2"}`}>
            <BiMusic fill={`${selectedTheme === "dark" ? "black" : "#22311d"}`} />
      </div>
      }
      </div>
      <div className={`${selectedTheme === 'dark' ? "dark text-foreground" : "light text-[#22311d]"} w-full flex-1 px-1 ml-4 space-y-2 overflow-hidden`}>
          {message.content.replace(/^"(.*)"$/, '$1')}
      </div>
    </div>  
  )
}