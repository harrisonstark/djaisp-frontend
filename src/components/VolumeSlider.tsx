import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { Slider } from "./ui/slider"
import { BsFillVolumeUpFill } from 'react-icons/bs'

// Define the prop type
interface VolumeSliderProps {
  onVolumeChange: (newVolume: number) => void;
}

function VolumeSlider({ onVolumeChange }: VolumeSliderProps) {
  const [volume, setVolume] = useState(Cookies.get("volume") || 0.5); // Initial volume value (0-1)

  // Handle volume change
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    onVolumeChange(newVolume);
  };

  return (
    <div className='flex justify-center items-center'>
      <BsFillVolumeUpFill size={24} />
      <Slider defaultValue={[0.5]} step={0.01} max={1} onChange={handleVolumeChange} className="w-full px-4"/>
      {/* <label htmlFor="volumeSlider">Volume:</label>
      <input
        type="range"
        id="volumeSlider"
        name="volumeSlider"
        min="0"
        max="1"
        step="0.01"
        value={volume.toString()} // Ensure value is a string
        onChange={handleVolumeChange}
      />
      <span>{Math.round(volume * 100)}%</span> */}
    </div>
  );
}

export default VolumeSlider;