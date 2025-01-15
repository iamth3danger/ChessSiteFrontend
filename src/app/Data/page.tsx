import React from "react";

import { ChessGameFetcher } from "@/classes/ChessGameFetcher";
import { ChessGameProcessor } from "@/classes/ChessGameProcessor";
import { WinPercentageData } from "@/classes/WeeklyData";
import { WinPercentageGraphProps } from "./components/GraphComponent";
import ClientSideWrapper from "./components/ClientSideWrapper";

interface DataProps {
  openingData: OpeningDataFetchProps[];
}

interface OpeningDataFetchProps {
  name: string;
  wins: number;
  draws: number;
  losses: number;
  accuracy: number;
  gameNumber: number;
  data: WinPercentageData[];
}

interface OpeningDataRequest {
  id: number;
  name: string;
  accuracy: number;
  userId: null;
  username: string;
  recent: boolean;
  gameCount: number;
  winPercentage: number;
  drawPercentage: number;
  lossPercentage: number;
  weeklyData: {
    data: [];
  };
}

interface WeekDataRequest {
  id: number;
  name: string;
  accuracy: number;
  winCount: number;
  userId: null;
  username: string;
  weekNumber: number;
  winPercentage: number
  percentage: {
    wins: number;
    losses: number;
    draws: number;
  };
  results: {
    wins: number;
    losses: number;
    draws: number;
    gameNumber: number;
  };
  accuracyCount: number;
  accuracies: number;
}

export default async function Data() {
  const initialGraphProps: WinPercentageGraphProps = { opening: "", data: [] };

  const data = await fetch('http://localhost:8080/opening/dangertosh')
  const at : OpeningDataRequest[] = await data.json();

  const week = await fetch('http://localhost:8080/week/get/dangertosh');
  const weekData : WeekDataRequest[] = await week.json();

  function findWeekForOpening(opening : string) {
    var percentageData : WinPercentageData[] = [];
    for (var obj of weekData){
      if(obj.name === opening)
        percentageData.push({week : obj.weekNumber, winPercentage : obj.winPercentage})
    }

    percentageData.sort((a, b) => a.week - b.week)
    return percentageData;
  }
  const gameFetcher = new ChessGameFetcher(
    "dangertosh",
    "2024",
    "08",
    "2024",
    "11"
  );

  await gameFetcher.fetchGameArchives();
  const gameProcessor = new ChessGameProcessor(gameFetcher.logOpenings());
  gameProcessor.init();

  const openings = gameProcessor.getResults().getOpenings();

  const openingData: OpeningDataFetchProps[] = at.map((op) => ({
    name: op.name,
    wins: op.winPercentage,
    draws: op.drawPercentage,
    losses: op.lossPercentage,
    accuracy: op.accuracy,
    gameNumber: op.gameCount,
    data: findWeekForOpening(op.name),
  }));

  return (
    <div>
      <div className="min-h-screen bg-[#1a2b3c]">
        <div className="lg:grid">
          <ClientSideWrapper openingData={openingData} />
        </div>
      </div>
    </div>
  );
}
