import * as React from "react"

import { Button } from '../ui/button'
import { BsArrowRight, BsInfoCircle } from 'react-icons/bs'

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

export function EmptyScreen({ setInput, selectedTheme }) {
  return (
    <div className="mx-auto w-full">
      <div className={`rounded-lg p-8
                ${selectedTheme === 'dark' ? 'bg-background border text-white' : 'text-[#22311d] bg-[#D0E7D2] border border-[#22311d]'}`}>
        <h1 className="mb-2 text-lg font-semibold">
          Welcome to <b>MAISTRO</b> <span className={`${selectedTheme === 'dark' ? "text-muted-foreground" : "text-[#3f5a36]"}`}>(my · strow)</span>
        </h1>
        <p className={`mb-2 leading-normal ${selectedTheme === 'dark' ? "text-muted-foreground" : "text-[#3f5a36]"}`}>
          Change the way you listen to music by letting <b>MAISTRO</b> control a custom playlist curated
          to your current mood or activities. 
        </p>
        <p className={`leading-normal ${selectedTheme === 'dark' ? "text-muted-foreground" : "text-[#3f5a36]"}`}>
          Start a conversation with <b>MAISTRO</b> here or try the following examples:
        </p>
        <div className={`mt-4 flex flex-col items-start space-y-2
              ${selectedTheme === 'dark' ? "text-primary" : "text-[#22311d]"}`}>
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-md text-bold"
              onClick={() => setInput(message.message)}
            >
              <BsArrowRight className="mr-2" />
              {message.heading}
            </Button>
          ))}
        </div>
        <div className={`sm:flex sm:items-center mt-2 ${selectedTheme === 'dark' ? "text-muted-foreground" : "text-[#3f5a36]"}`}>
        <span>Click the</span>
        <span className="inline-flex items-baseline ">
              <BsInfoCircle className="mx-2 sm:mt-1 w-5 h-5"  />
        </span>
        <span>icon next to the volume slider for more info on how MAISTRO works.</span>
        </div>
        
      </div>
    </div>
  )
}