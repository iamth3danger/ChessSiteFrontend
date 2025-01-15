"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatsBar } from "./StatsBar"
import { useEffect, useState } from "react"
import { MoveNodeData } from "./ClientSideWrapper"
interface GameResult {
  move: string
  frequency: number
  whiteWin: number
  draw: number
  blackWin: number
  results?: Array<{
    result: string
    opponent: string
  }>
}



interface bestMoveProps{
  bestMove : string;
  moveNumber : number;
  data : MoveNodeData[] | null;
}

export default function MoveCard(props : bestMoveProps) {
  

  return (
    <Card className="w-[400px] h-[720px] bg-[#1c1c1c] text-white border-none">
      <CardHeader>
        <div className="text-sm mt-2">{props.bestMove}</div>
      </CardHeader>
      {props.data && props.data.length > 0 && (
      <CardContent className="space-y-4">
        {props.data.slice(0,9).map((data, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <span>{data.fullMove}</span>
                <span className="text-gray-400">{data.count}</span>
              </span>
            </div>
            <StatsBar 
              whiteWin={data.winRate}
              draw={0}
              blackWin={(100 - data.winRate)}
            />
          </div>
        ))}
      </CardContent>
      )}
    </Card>
  )
}

