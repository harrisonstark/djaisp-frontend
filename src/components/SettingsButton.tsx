import React, { useState } from "react"
import Cookies from 'js-cookie';
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

export default function SettingsButton({ selectedLayout, onSelectedLayoutChange, selectedTheme, onSelectedThemeChange }) {
    const handleLayoutClick = (layout) => {
        onSelectedLayoutChange(layout);
    };

    const handleThemeChange = (theme) => {
        onSelectedThemeChange(theme);
    };

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
                    <div className="relative h-full">
                        <h1 className="text-background text-medium font-bold pt-10 pb-4">Change App Layout</h1>
                        <div className="grid grid-cols-2 grid-row-1 gap-4 text-background">
                            <div className={`border rounded-lg h-20 hover:-translate-y-1 duration-200
                                ${selectedLayout === 'A' ? 'border border-primary' : ''}`}
                                onClick={() => handleLayoutClick('A')}
                            >
                                <TooltipProvider>
                                    <Tooltip>
                                    <TooltipTrigger asChild>
                                        {/* INSERT LAYOUT A PREVIEW IMAGE HERE */}
                                       <div className="w-full h-full flex justify-center items-center">
                                        A
                                       </div>
                                    </TooltipTrigger>
                                    <TooltipContent>Media Player on Top</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <div className={`border rounded-lg h-20 hover:-translate-y-1 duration-200
                                ${selectedLayout === 'B' ? 'border border-primary' : ''}`}
                                onClick={() => handleLayoutClick('B')}
                            >
                                <TooltipProvider>
                                    <Tooltip>
                                    <TooltipTrigger asChild>
                                        {/* INSERT LAYOUT B PREVIEW IMAGE HERE */}
                                       <div className="w-full h-full flex justify-center items-center">
                                        B
                                       </div>
                                    </TooltipTrigger>
                                    <TooltipContent>Media Player on Bottom</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>

                        <h1 className="text-background text-medium font-bold pt-10 pb-4">Change App Theme</h1>
                        <div className="grid grid-cols-2 grid-row-1 gap-4 text-background">
                            <div className={`border rounded-lg hover:-translate-y-1 duration-200 text-background h-8 flex justify-center items-center
                                    ${selectedTheme === 'dark' ? 'border-primary' : ''}`}
                                    onClick={() => handleThemeChange('dark')}
                            >
                                Dark
                            </div>
                            <div className={`rounded-lg bg-slate-200 hover:-translate-y-1 duration-200 text-foreground h-8 flex justify-center items-center
                                    ${selectedTheme === 'light' ? 'border-2 border-primary' : ''}`}
                                    onClick={() => handleThemeChange('light')}
                            >
                                Light
                            </div>
                        </div>
                        <div className="mb-14 w-full bottom-0 absolute ">
                            {Cookies.get('profilePicture') !== "" ?
                                <div className="flex flex-row justify-start items-center mb-4">
                                    <div className="w-12 h-10">
                                        <img className="w-full h-full border-2 rounded-lg" src={Cookies.get("profilePicture")}></img>
                                    </div>
                                    <div className="text-background pl-4">
                                        {Cookies.get('user_id')}
                                    </div>
                                </div>
                            : <div />}
                            <LoginButton />
                        </div>
                    </div>
                    
                </SheetContent>
            </Sheet>
        </div>
    )
}