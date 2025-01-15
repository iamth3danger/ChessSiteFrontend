interface StatsBarProps {
  whiteWin: number
  draw: number
  blackWin: number
}

export function StatsBar({ whiteWin, draw, blackWin }: StatsBarProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-gray-700">
        <div 
          className="bg-white" 
          style={{ width: `${whiteWin}%` }} 
        />
        <div 
          className="bg-gray-500" 
          style={{ width: `${draw}%` }} 
        />
        <div 
          className="bg-gray-600" 
          style={{ width: `${blackWin}%` }} 
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>{whiteWin.toFixed(1)}%</span>
        <span>{blackWin.toFixed(1)}%</span>
      </div>
    </div>
  )
}

