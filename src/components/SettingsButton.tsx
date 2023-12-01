import React from "react"
import Cookies from 'js-cookie';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "../components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '../components/ui/tooltip';
import {Button} from '../components/ui/button';
import {BsFillGearFill} from 'react-icons/bs';
import LoginButton from "./SpotifyButton";
import { LightLayoutA, LightLayoutB, DarkLayoutA, DarkLayoutB } from "./ui/layouts";

export default function SettingsButton({ selectedLayout, onSelectedLayoutChange, selectedTheme, onSelectedThemeChange }) {
    const handleLayoutClick = (layout) => {
        onSelectedLayoutChange(layout);
    };

    const handleThemeChange = (theme) => {
        onSelectedThemeChange(theme);
    };

    return(
        <div className="z-[100] w-full h-full flex justify-center items-center">
            <Sheet>
                <SheetTrigger>
                    <div className={`w-full h-full p-4 rounded-md
                        ${selectedTheme === 'dark' ? 'hover:bg-zinc-900 opacity-70 hover:opacity-100 border-2 border-primary'
                        : 'bg-[#D0E7D2] hover:bg-[#79AC78] opacity-70 hover:opacity-100 border-2 border-black'}`}>
                        <BsFillGearFill 
                            fill={`${selectedTheme === 'dark' ? 'white' : 'black'}`}
                            size={32}
                        />
                    </div>
                </SheetTrigger>
                <SheetContent className={`${selectedTheme === 'dark' ? 'light bg-foreground' : 'bg-[#D0E7D2]'}
                       z-[1000]`}>
                    <SheetHeader>
                    <SheetTitle className={`${selectedTheme === 'dark' ? 'light' : 'dark'}
                        text-background`}>
                            M<i>AI</i>STRO Settings
                    </SheetTitle>
                    <SheetDescription>
                        Modify the look and feel of M<i>AI</i>STRO here.
                    </SheetDescription>
                    </SheetHeader>
                    <div className="relative h-full">
                        <h1 className={`${selectedTheme === 'dark' ? 'light' : 'dark'}
                        text-background text-medium font-bold pt-10 pb-4`}>Change App Layout</h1>
                        <div className="grid grid-cols-2 grid-row-1 gap-4 text-background">
                            <div className={`border-2 border-background rounded-lg h-20 hover:-translate-y-1 duration-200
                                ${selectedLayout === 'A' ? 'border-primary' : 
                                (selectedTheme === 'dark' ? 'border-background' : 'border-foreground')}`}
                                onClick={() => handleLayoutClick('A')}
                            >
                                <TooltipProvider>
                                    <Tooltip>
                                    <TooltipTrigger asChild>
                                       <div className="w-full h-full flex justify-center items-center">
                                        {selectedTheme === 'dark' ? <DarkLayoutA /> : <LightLayoutA />}
                                       </div>
                                    </TooltipTrigger>
                                    <TooltipContent>Media Player on Top</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <div className={`border-2 rounded-lg h-20 hover:-translate-y-1 duration-200
                                ${selectedLayout === 'B' ? 'border-primary' : 
                                    (selectedTheme === 'dark' ? 'border-background' : 'border-foreground')}`}
                                onClick={() => handleLayoutClick('B')}
                            >
                                <TooltipProvider>
                                    <Tooltip>
                                    <TooltipTrigger asChild>
                                       <div className="w-full h-full flex justify-center items-center">
                                        {selectedTheme === 'dark' ? <DarkLayoutB /> : <LightLayoutB />}
                                       </div>
                                    </TooltipTrigger>
                                    <TooltipContent>Media Player on Bottom</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>

                        <h1 className={`${selectedTheme === 'dark' ? 'light' : 'dark'}
                        text-background text-medium font-bold pt-10 pb-4`}>
                            Change App Theme
                        </h1>
                        <div className="grid grid-cols-2 grid-row-1 gap-4">
                            <div className={`border-2 border-background bg-black  rounded-lg hover:-translate-y-1 duration-200 h-8 flex justify-center items-center
                                    ${selectedTheme === 'dark' ? 'border-primary text-background' : 'text-white'}`}
                                    onClick={() => handleThemeChange('dark')}
                            >
                                Dark
                            </div>
                            <div className={` rounded-lg bg-[#79AC78] hover:-translate-y-1 duration-200  h-8 flex justify-center items-center
                                    ${selectedTheme === 'light' ? 'border-2 border-primary text-black' : 'text-foreground border-2 border-white'}`}
                                    onClick={() => handleThemeChange('light')}
                            >
                                Light
                            </div>
                        </div>
                        <div className="mb-14 w-full bottom-0 absolute ">
                            {Cookies.get('profilePicture') !== "" ?
                                <div className="flex flex-row justify-start items-center mb-4">
                                    <div className="w-12 h-10">
                                        <img 
                                            className={`${selectedTheme === "dark" ? 'border-white' : 'border-black'}
                                            w-full h-full border-2 rounded-lg`}
                                            src={Cookies.get("profilePicture")}
                                            alt="profile"
                                         />
                                    </div>
                                    <div className={`${selectedTheme === "dark" ? 'text-white' : 'text-black'} pl-4`}>
                                        {Cookies.get('user_id')}
                                    </div>
                                </div>
                            : <div />}
                            <LoginButton selectedTheme={selectedTheme} />
                        </div>
                    </div>
                    
                </SheetContent>
            </Sheet>
        </div>
    )
}