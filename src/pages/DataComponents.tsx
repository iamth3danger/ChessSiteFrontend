import React from "react";

import SubmissionForm from "../app/components/SubmissionForm";
import { FormInfo } from "../interfaces/FormInfo";
import { useState, useEffect } from "react";
import { ChessGameFetcher } from "../classes/ChessGameFetcher";
import { PercentageInfo } from "../classes/PercentageInfo";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import StatCard from "../app/components/StatCard";
import { ChessOpeningCard } from "../app/components/chess-opening-card";
import GraphComponent from "../app/Data/components/GraphComponent";
import { ChessGameProcessor } from "../classes/ChessGameProcessor";
import { WinPercentageData } from "../classes/WeeklyData";
import { OpeningResults } from "../classes/OpeningResults";
import { Opening } from "../classes/Opening";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { WinPercentageGraphProps } from "../app/Data/components/GraphComponent";
import { IOpeningData } from "@/interfaces/IOpeningData";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

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

export const getServerSideProps = (async () => {
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

  const openingData: OpeningDataFetchProps[] = openings.map((op) => ({
    name: op.getOpeningName(),
    wins: op.getPercentage().getWin(),
    draws: op.getPercentage().getDraw(),
    losses: op.getPercentage().getLoss(),
    accuracy: op.getAvgAccuracy(),
    gameNumber: op.getOpeningData().gameNumber,
    data: op.getWeeklyData(),
  }));

  const dataProps: DataProps = {
    openingData: openingData,
  };

  return {
    props: { openingData },
  };
}) satisfies GetServerSideProps<{ openingData: OpeningDataFetchProps[] }>;

function Data({
  openingData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const initialGraphProps: WinPercentageGraphProps = { opening: "", data: [] };
  //const [data, setData] = useState<WinPercentageGraphProps>(initialGraphProps);

  // const [openings, setOpenings] = useState<Opening[]>([]);
  // const [gameFetcher, setGameFetcher] = useState<ChessGameFetcher>();
  // const [username, setUsername] = useState("dangertosh");
  // const [loading, setLoading] = useState(false);
  // const [submitted, setSubmitted] = useState(false);

  // const [account, setAccount] = useState("");
  // const [startDate, setStartDate] = useState(new Date());
  // const [endDate, setEndDate] = useState(new Date());
  // const [isSubmittable, setSubmittable] = useState(false);

  // useEffect(() => {
  //   fetchOpenings();
  // }, []);

  // const form: FormInfo = {
  //   account: account,
  //   startDate: startDate,
  //   endDate: endDate,
  //   isSubmittable: isSubmittable,
  //   setAccount: setAccount,
  //   setStartDate: setStartDate,
  //   setEndDate: setEndDate,
  //   setSubmittable: setSubmittable,
  // };

  const slideLeft = () => {
    var slider = document.getElementById("slider")!;
    slider.scrollLeft = slider.scrollLeft - window.innerWidth * 0.85;
  };

  const slideRight = () => {
    var slider = document.getElementById("slider")!;

    slider.scrollLeft = slider.scrollLeft + window.innerWidth * 0.85;
  };

  // async function fetchOpenings() {
  //   const gameFetcher = new ChessGameFetcher(
  //     username,
  //     "2024",
  //     "08",
  //     "2024",
  //     "11"
  //   );
  //   await gameFetcher.fetchGameArchives();
  //   let gameProcessor = new ChessGameProcessor(gameFetcher.logOpenings());
  //   gameProcessor.init();

  //   const openingResults: OpeningResults = gameProcessor.getResults();
  //   const openings: Opening[] = openingResults.getOpenings();
  //   setOpenings(openings);
  //   let open: Opening = openings[0];

  //   setData({ opening: open.getOpeningName(), data: open.getWeeklyData() });
  //   const weeklyData = [];
  // }

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setSubmitted(true);

  //   fetchOpenings();
  // };

  return (
    <div>
      <div className="min-h-screen bg-[#1a2b3c]">
        <div className="lg:grid">
          <div className="mt-10 mb-10">
            <GraphComponent
              opening={openingData[0].name}
              data={openingData[0].data}
            />
          </div>
          <div className="flex">
            <div className="flex items-center">
              <div
                className="inline-block opacity-70 cursor-pointer hover:opacity-100"
                onClick={slideLeft}
              >
                <MdChevronLeft size={100} color="white" />
              </div>
            </div>
            <div
              id="slider"
              className="flex h-[45vh] w-[85vw] items-center scroll-smooth overflow-x-hidden overflow-y-hidden space-x-5"
            >
              {openingData.map((op, index) => (
                <div
                  // onClick={() =>
                  //   setData({
                  //     opening: op.getOpeningName(),
                  //     data: op.getWeeklyData(),
                  //   })
                  // }
                  className="ml-4"
                  key={index}
                >
                  <ChessOpeningCard
                    name={op.name}
                    winRate={op.wins}
                    drawRate={op.draws}
                    lossRate={op.losses}
                    averageAccuracy={op.accuracy}
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center">
              <div
                className="inline-block opacity-70 cursor-pointer hover:opacity-100"
                onClick={slideRight}
              >
                <MdChevronRight size={100} color="white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Data;
