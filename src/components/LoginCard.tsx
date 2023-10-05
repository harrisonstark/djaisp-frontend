import React from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "../components/ui/card"
import LoginButton from "./SpotifyButton"
import {TbPlaylist} from "react-icons/tb"


export default function CardDemo() {
    return (
        <div className="flex items-center justify-center h-screen">
        <div className="flex justify-center">
            <Card className="w-full">
            <div className="flex justify-center items-center w-full pt-5 mb-0">
                <TbPlaylist size={40} />
            </div>
            <CardHeader>
                <CardTitle>Change the way you listen to music</CardTitle>
                <CardDescription>Get Started with DJ AI by Connecting to Spotify</CardDescription>
            </CardHeader>
            <CardContent>
                <LoginButton />
            </CardContent>
            </Card> 
      </div> 
      </div>    
    )
  }