import React from "react"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "../components/ui/sheet"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '../components/ui/tooltip'
import {Button} from '../components/ui/button'
import {BsFillGearFill} from 'react-icons/bs'
import LoginButton from "./SpotifyButton"

export default function SettingsButton() {
    return(
        <div className="z-[100] w-full h-full flex justify-center items-center">
            <Sheet >
                <SheetTrigger>
                    <Button variant="outline" className="hover:bg-zinc-900 w-full h-full opacity-70 hover:opacity-100 border-2 border-primary p-4">
                        <BsFillGearFill fill="white" size={32}/>
                    </Button>
                </SheetTrigger>
                <SheetContent className="z-[1000]">
                    <SheetHeader>
                    <SheetTitle>M<em>AI</em>STRO Settings</SheetTitle>
                    <SheetDescription>
                        Modify the look and feel of M<em>AI</em>STRO here.
                    </SheetDescription>
                    </SheetHeader>
                    <div>
                        <h1 className="text-background text-medium font-bold pt-10 pb-4">Change App Layout</h1>
                        <div className="grid grid-cols-2 grid-row-2 gap-4 text-background">
                            <div className="border rounded-lg h-20 hover:-translate-y-1 duration-200">
                                <TooltipProvider>
                                    <Tooltip>
                                    <TooltipTrigger asChild>
                                        {/* INSERT LAYOUT A PREVIEW IMAGE HERE */}
                                       <div className="w-full h-full flex justify-center items-center">
                                        A
                                       </div>
                                    </TooltipTrigger>
                                    <TooltipContent>Layout A</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <div className="border rounded-lg h-20 hover:-translate-y-1 duration-200">
                                <TooltipProvider>
                                    <Tooltip>
                                    <TooltipTrigger asChild>
                                        {/* INSERT LAYOUT B PREVIEW IMAGE HERE */}
                                       <div className="w-full h-full flex justify-center items-center">
                                        B
                                       </div>
                                    </TooltipTrigger>
                                    <TooltipContent>Layout B</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <div className="border rounded-lg h-20 hover:translate-y-1 duration-200">
                                <TooltipProvider>
                                    <Tooltip>
                                    <TooltipTrigger asChild>
                                        {/* INSERT LAYOUT C PREVIEW IMAGE HERE */}
                                       <div className="w-full h-full flex justify-center items-center">
                                        C
                                       </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom">Layout C</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <div className="border rounded-lg h-20 hover:translate-y-1 duration-200">
                                <TooltipProvider>
                                    <Tooltip>
                                    <TooltipTrigger asChild>
                                        {/* INSERT LAYOUT D PREVIEW IMAGE HERE */}
                                       <div className="w-full h-full flex justify-center items-center">
                                        D
                                       </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom">Layout D</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                    </div>
                    <div className="pt-4">
                        <LoginButton />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}