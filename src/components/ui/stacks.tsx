import React from 'react';

import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from './tooltip'
import {BsHourglass} from 'react-icons/bs'

export const Stack0 = () => {
  return (
    <div className="hover:opacity-75">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <BsHourglass size={24}/> 
            </div>
          </TooltipTrigger>
          <TooltipContent className='text-foreground bg-background'>MAISTRO is Not Active</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

export const Stack1 = (props) => {
  let strokeFill = "#D0E7D2";
  if(props.selectedTheme == "dark"){
    strokeFill = "white";
  }
  return (
    <div className="hover:opacity-75">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <svg width="29" height="34" viewBox="0 0 29 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="stackGroup">
                  <rect id="stack4" x="0.5" y="0.5" width="28" height="6" rx="1.5" stroke={strokeFill}/>
                  <rect id="stack3" x="0.5" y="9.5" width="28" height="6" rx="1.5" stroke={strokeFill}/>
                  <rect id="stack2" x="0.5" y="18.5" width="28" height="6" rx="1.5" stroke={strokeFill}/>
                  <rect className="animate-pulse duration-4000 fill-primary stroke-primary" id="stack1" x="0.5" y="27.5" width="28" height="6" rx="1.5"/>
                </g>
            </svg>
          </TooltipTrigger>
          <TooltipContent className='text-foreground bg-background'>Last Song in Batch!</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

export const Stack2 = (props) => {
  let strokeFill = "#D0E7D2";
  if(props.selectedTheme == "dark"){
    strokeFill = "white";
  }
  return (
    <div className="hover:opacity-75">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <svg width="29" height="34" viewBox="0 0 29 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="stackGroup">
                  <rect id="stack4" x="0.5" y="0.5" width="28" height="6" rx="1.5" stroke={strokeFill}/>
                  <rect id="stack3" x="0.5" y="9.5" width="28" height="6" rx="1.5" stroke={strokeFill}/>
                  <rect className="animate-pulse duration-4000 fill-primary stroke-primary" id="stack2" x="0.5" y="18.5" width="28" height="6" rx="1.5"/>
                  <rect className="animate-pulse duration-4000 fill-primary stroke-primary" x="0.5" y="27.5" width="28" height="6" rx="1.5"/>
                </g>
            </svg>
          </TooltipTrigger>
          <TooltipContent className='text-foreground bg-background'>Batch is Over Halfway Complete</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

export const Stack3 = (props) => {
  let strokeFill = "#D0E7D2";
  if(props.selectedTheme == "dark"){
    strokeFill = "white";
  }
  return (
    <div className="hover:opacity-75">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
          <svg width="29" height="34" viewBox="0 0 29 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="stackGroup">
                <rect id="stack4" x="0.5" y="0.5" width="28" height="6" rx="1.5" stroke={strokeFill} />
                <rect className="animate-pulse duration-4000 fill-primary stroke-primary" id="stack3" x="0.5" y="9.5" width="28" height="6" rx="1.5" />
                <rect className="animate-pulse duration-4000 fill-primary stroke-primary" id="stack2" x="0.5" y="18.5" width="28" height="6" rx="1.5" />
                <rect className="animate-pulse duration-4000 fill-primary stroke-primary" id="stack1" x="0.5" y="27.5" width="28" height="6" rx="1.5" />
              </g>
          </svg>
          </TooltipTrigger>
          <TooltipContent className='text-foreground bg-background'>In First Half of Current Batch</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

export const Stack4 = () => {
    return (
      <div className="hover:opacity-75">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
            <svg width="29" height="34" viewBox="0 0 29 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="stackGroup">
                  <rect className="animate-pulse duration-4000 fill-primary stroke-primary" id="stack4" x="0.5" y="0.5" width="28" height="6" rx="1.5" />
                  <rect className="animate-pulse duration-4000 fill-primary stroke-primary" id="stack3" x="0.5" y="9.5" width="28" height="6" rx="1.5" />
                  <rect className="animate-pulse duration-4000 fill-primary stroke-primary" id="stack2" x="0.5" y="18.5" width="28" height="6" rx="1.5" />
                  <rect className="animate-pulse duration-4000 fill-primary stroke-primary" id="stack1" x="0.5" y="27.5" width="28" height="6" rx="1.5" />
                </g>
            </svg>
            </TooltipTrigger>
            <TooltipContent className='text-foreground bg-background'>First Song of Current Batch</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }
  export default Stack4;