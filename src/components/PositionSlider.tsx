import React, { useState } from 'react';

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
    <div>
      <label htmlFor="positionSlider">Position in Song:</label>
      <input
        type="range"
        id="positionSlider"
        name="positionSlider"
        min="0"
        max={duration}
        step={Math.floor(duration / 1000)}
        value={position.toString()} // Ensure value is a string
        onChange={handlePositionChange}
      />
      <span>{formatTime(position)} / {formatTime(duration)}</span>
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