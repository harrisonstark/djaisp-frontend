import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { Slider } from "./ui/slider"
import { BsFillVolumeMuteFill, BsFillVolumeOffFill, BsFillVolumeUpFill } from 'react-icons/bs'

// Define the prop type
interface VolumeSliderProps {
  onVolumeChange: (newVolume: number) => void;
}

let prevVolume = Cookies.get("prevVolume") || 0.5;

let isMuted = Cookies.get("muted") === "true";

function VolumeSlider({ onVolumeChange }: VolumeSliderProps) {
  const [volume, setVolume] = useState(isMuted ? 0 : Cookies.get("volume") || 0.5); // Initial volume value (0-1)

  // Handle volume change
  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0];
    prevVolume = newVolume;
    Cookies.set("prevVolume", newVolume, { path: "/" });
    setVolume(newVolume);
    onVolumeChange(newVolume);
  };

  function handleToggleMute() {
    const newVol = isMuted ? prevVolume : 0;
    setVolume(newVol);
    onVolumeChange(newVol);
    isMuted = !isMuted;
    Cookies.set("muted", isMuted ? "true" : "false", { path: "/" });
  }

  return (
    <div className='flex justify-center items-center' style={{ minWidth: '120px' }}>
      <div onClick={handleToggleMute} className="pr-4">
                {isMuted ? <BsFillVolumeMuteFill className="hover:fill-zinc-700" size={24} /> : volume === 0 ? <BsFillVolumeOffFill className="hover:fill-zinc-700" size={24} /> : <BsFillVolumeUpFill className="hover:fill-zinc-700" size={24} />}
      </div>
      <Slider disabled={isMuted} defaultValue={[volume]} value={[volume]} step={0.01} max={1} onValueChange={handleVolumeChange} className="w-full"/>
    </div>
  );
}

export default VolumeSlider;