import { GetServerSideProps } from "next";
import { ChessGameFetcher } from "@/classes/ChessGameFetcher";
import { ChessGameProcessor } from "@/classes/ChessGameProcessor";
import GraphComponent from "../Data/components/GraphComponent";
import { ChessOpeningCard } from "./chess-opening-card";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

interface DataProps {
  openings: {
    name: string;
    data: any;
    winRate: number;
    drawRate: number;
    lossRate: number;
    averageAccuracy: number;
  }[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  const username = "dangertosh";
  const gameFetcher = new ChessGameFetcher(
    username,
    "2024",
    "08",
    "2024",
    "11"
  );
  await gameFetcher.fetchGameArchives();

  const gameProcessor = new ChessGameProcessor(gameFetcher.logOpenings());
  gameProcessor.init();

  const openingResults = gameProcessor.getResults();
  const openings = openingResults.getOpenings().map((opening) => ({
    name: opening.getOpeningName(),
    data: opening.getWeeklyData(),
    winRate: opening.getPercentage().getWin(),
    drawRate: opening.getPercentage().getDraw(),
    lossRate: opening.getPercentage().getLoss(),
    averageAccuracy: opening.getAvgAccuracy(),
  }));

  return {
    props: {
      openings,
    },
  };
};

function Data({ openings }: DataProps) {
  const initialGraphProps = {
    opening: openings[0]?.name || "",
    data: openings[0]?.data || [],
  };
  const [selectedData, setSelectedData] = React.useState(initialGraphProps);

  const slideLeft = () => {
    const slider = document.getElementById("slider")!;
    slider.scrollLeft = slider.scrollLeft - window.innerWidth * 0.85;
  };

  const slideRight = () => {
    const slider = document.getElementById("slider")!;
    slider.scrollLeft = slider.scrollLeft + window.innerWidth * 0.85;
  };

  return (
    <div>
      <div className="min-h-screen bg-[#1a2b3c]">
        <div className="lg:grid">
          <div className="mt-10 mb-10">
            <GraphComponent
              opening={selectedData.opening}
              data={selectedData.data}
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
              {openings.map((op, index) => (
                <div
                  onClick={() =>
                    setSelectedData({
                      opening: op.name,
                      data: op.data,
                    })
                  }
                  className="ml-4"
                  key={index}
                >
                  <ChessOpeningCard
                    name={op.name}
                    winRate={op.winRate}
                    drawRate={op.drawRate}
                    lossRate={op.lossRate}
                    averageAccuracy={op.averageAccuracy}
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
