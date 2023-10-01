import React, { useState } from 'react';
import { Slider } from "./ui/slider"

// Define the prop type
interface SongPositionSliderProps {
  onPositionChange: (newPosition: number) => void;
  duration: number; // Total duration of the song (in seconds)
  position: number;
}

function SongPositionSlider({ onPositionChange, duration, position }: SongPositionSliderProps) {

  // Handle position change
  const handlePositionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPosition = parseFloat(event.target.value);
    position = newPosition;
    onPositionChange(newPosition);
  };

  return (
    <div className="flex flex-row items-center">
      <div className='pb-1'>{formatTime(position)}</div>
      <div className="w-full px-4">
        <Slider defaultValue={[0]} step={Math.floor(duration / 1000)} max={duration}
         onChange={handlePositionChange} 
         value={[position]}/>
      </div>
      
      {/* <Slider defaultValue={[0]} max={duration} step={Math.floor(duration / 1000)} onChange={handlePositionChange}/> */}
      {/* <label htmlFor="positionSlider">Position in Song:</label>
      <input
        type="range"
        id="positionSlider"
        name="positionSlider"
        min="0"
        max={duration}
        step={Math.floor(duration / 1000)}
        value={position.toString()} // Ensure value is a string
        onChange={handlePositionChange}
      /> */}
      <div className='pb-1'>{formatTime(duration - position)}</div>
    </div>
  );
}

// Helper function to format time in seconds to mm:ss format
function formatTime(milliseconds: number): string {
  const minutes = Math.floor(milliseconds / 60000);
  const remainingSeconds = Math.floor(milliseconds % 60000 / 1000);
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
}

export default SongPositionSlider;