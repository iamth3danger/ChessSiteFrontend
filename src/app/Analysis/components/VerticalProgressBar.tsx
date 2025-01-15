import React from "react";

interface VerticalProgressBarProps {
  value: number;
  height?: number;
  width?: number;
}

const VerticalProgressBar: React.FC<VerticalProgressBarProps> = ({
  value,
  height = 300,
  width = 40,
}) => {
  const clampedValue = Math.min(Math.max(value, -40), 40);
  const normalizedValue = (clampedValue + 40) / 80; // Normalize to 0-1 range
  const whiteHeight = height * normalizedValue;

  return (
    <div
      className="relative overflow-hidden font-sans border border-black"
      style={{ height: `${height}px`, width: `${width}px` }}
    >
      <div
        className="absolute bottom-0 w-full bg-white transition-all duration-300 ease-in-out flex items-end justify-center"
        style={{ height: `${whiteHeight}px` }}
      >
        {clampedValue >= 0 && (
          <span className="font-bold text-sm text-black pb-2">
            {clampedValue}
          </span>
        )}
      </div>
      <div
        className="absolute top-0 w-full bg-black transition-all duration-300 ease-in-out flex items-start justify-center"
        style={{ height: `${height - whiteHeight}px` }}
      >
        {clampedValue < 0 && (
          <span className="text-white font-bold text-sm pt-2">
            {Math.abs(clampedValue)}
          </span>
        )}
      </div>
    </div>
  );
};

export default VerticalProgressBar;
