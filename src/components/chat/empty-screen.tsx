import * as React from "react"
import { UseChatHelpers } from 'ai/react'

import { Button } from '../ui/button'
import { BsArrowRight } from 'react-icons/bs'

const exampleMessages = [
  {
    heading: 'Say Hi to MAISTRO',
    message: `Hi MAISTRO! I'm feeling lucky, give me some random music of your choosing.`
  },
  {
    heading: 'Get Ready to Work Out',
    message: "I'm about to go to the gym!"
  },
  {
    heading: 'Long Day at The Office',
    message: `I just got back from a long day at work.`
  }
]

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {
  return (
    <div className="mx-auto w-full">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">
          Welcome to <b>MAISTRO</b> <span className="text-muted-foreground">(my · strow)</span>
        </h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          Change the way you listen to music by letting <b>MAISTRO</b> control a custom playlist curated
          to your current mood or activities. 
        </p>
        <p className="leading-normal text-muted-foreground">
          Start a conversation with <b>MAISTRO</b> here or try the following examples:
        </p>
        <div className="mt-4 flex flex-col items-start space-y-2">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              onClick={() => setInput(message.message)}
            >
              <BsArrowRight className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}