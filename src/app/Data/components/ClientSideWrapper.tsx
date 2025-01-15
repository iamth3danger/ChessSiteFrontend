"use client";

import React, { useState } from "react";
import { ChessOpeningCard } from "./chess-opening-card";
import GraphComponent from "./GraphComponent";
import Slide from "./Slide";
import { WinPercentageData } from "@/classes/WeeklyData";

interface OpeningDataFetchProps {
  name: string;
  wins: number;
  draws: number;
  losses: number;
  accuracy: number;
  gameNumber: number;
  data: WinPercentageData[];
}

export default function ClientSideWrapper({
  openingData,
}: {
  openingData: OpeningDataFetchProps[];
}) {
  const [currentOpeningData, setCurrentOpeningData] = useState({
    opening: openingData[0].name,
    data: openingData[0].data,
  });

  return (
    <>
      <div className="mt-10 mb-10">
        <GraphComponent
          opening={currentOpeningData.opening}
          data={currentOpeningData.data}
        />
      </div>
      <div className="flex">
        <div className="flex items-center">
          <Slide side={0} />
        </div>
        <div
          id="slider"
          className="flex h-[45vh] w-[85vw] items-center scroll-smooth overflow-x-hidden overflow-y-hidden space-x-5"
        >
          {openingData.map((op, index) => (
            <div
              onClick={() =>
                setCurrentOpeningData({
                  opening: op.name,
                  data: op.data,
                })
              }
              className="ml-4 cursor-pointer"
              key={index}
            >
              <ChessOpeningCard
                name={op.name}
                winRate={op.wins * 100}
                drawRate={op.draws * 100}
                lossRate={op.losses * 100}
                averageAccuracy={op.accuracy}
              />
            </div>
          ))}
        </div>
        <div className="flex items-center">
          <Slide side={1} />
        </div>
      </div>
    </>
  );
}
