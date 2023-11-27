import { UseChatHelpers } from 'ai/react'
import React from "react"
import Textarea from 'react-textarea-autosize'
import { Button } from '../ui/button'
import { GoPaperAirplane } from 'react-icons/go'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '../ui/tooltip'
import { useEnterSubmit } from '../../lib/hooks/use-enter-submit'

export interface PromptProps extends Pick<UseChatHelpers, 'input' | 'setInput'> {
  onSubmit: (value: string) => Promise<void>
  isLoading: boolean,
  selectedTheme: string,
}

export function PromptForm({
  onSubmit,
  input,
  setInput,
  isLoading,
  selectedTheme
}: PromptProps) {
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const maxTextLength = 400; // Set your desired maximum length

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;

    // Check if the input value exceeds the maximum length
    if (inputValue.length <= maxTextLength) {
      setInput(inputValue);
    }
  };


  function scrollToBottom(){
    window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
  }

  return (
    <form
      onSubmit={async e => {
        e.preventDefault()
        if (isLoading || !input?.trim()) {
          return
        }
        scrollToBottom();
        window.postMessage({ command: 'messageCommand', message: input }, '*');
        setInput('')
        await onSubmit(input)
      }}
      ref={formRef}
    >
      <div className={`${selectedTheme === 'dark' ? "dark bg-background text-foreground sm:border-foreground" : 
      "light bg-[#748E63] text-[#D0E7D2] sm:border-background"} flex justify-between gap-2 items-center max-h-60 w-full flex-row  px-2 sm:rounded-md sm:border sm:px-2
      `}>
        <div className="w-full flex justify-center items-center">
          <Textarea
            ref={inputRef}
            tabIndex={0}
            onKeyDown={onKeyDown}
            rows={1}
            value={input}
            onChange={handleChange}
            placeholder="Type your message..."
            spellCheck={false}
            className={`min-h-[60px] w-full h-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-md
                        ${selectedTheme === 'dark' ? "placeholder:text-white" : "placeholder:text-[#D0E7D2]"}`}
          />
        </div>
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || input === ''}
                  className="flex justify-center items-center"
                >
                  <GoPaperAirplane size={18} />
                  <span className="sr-only">Send message</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className={`${selectedTheme === 'dark' ? "dark bg-background text-foreground" : "light bg-[#D0E7D2] text-background"}`}>Send message</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </form>
  )
}