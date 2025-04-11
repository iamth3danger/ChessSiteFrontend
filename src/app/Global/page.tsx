"use client"

import Header from "../components/Header"
import { Chessboard } from "react-chessboard";
import { useState, useEffect } from "react";
import { Chess, Square, Move, Color } from "chess.js";
import data from "./data/found_puzzles_other.json";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Converter } from "@/classes/AlgebraicConverter";

interface Tactic {
  fen : string;
  moves : string[];
}


function Global(){
  const tacticsData : Tactic[] = data.map(({ FEN, Moves }) => ({fen: FEN , moves: Moves}));
  const moveSet : string[][] = tacticsData.map((tactic) => 
    {
      const converter: Converter = new Converter(new Chess(tactic.fen), tactic.moves);
      return converter.change();
    });

  
  
  const [game, setGame] = useState<Chess>(new Chess(tacticsData[1].fen));
  const [currentGame, setCurrentGame] = useState(0);
  const [currentMove, setCurrentMove] = useState(0);

  const setGameMove = () => {
    if (currentMove >= moveSet[currentGame].length)
      return;
    const gameCopy = Object.assign(new Chess(), game);
    console.log(`current move: ${currentMove}`)
    console.log(`moves: ${moveSet[currentGame]}`)
    gameCopy.move(moveSet[currentGame][currentMove]);
    setCurrentMove(currentMove + 1);
    setGame(gameCopy);
  };


  const NextTactic = () => {
    if (currentGame < tacticsData.length - 1) {
      const nextGame = currentGame + 1;
      setGame(new Chess(tacticsData[nextGame].fen));
      setCurrentGame(nextGame);
      setCurrentMove(0);
    }
  };

  const PrevTactic = () => {
    if (currentGame > 0) {
      setCurrentGame(currentGame - 1);
    }
  };

    return (
      <div>
        <div className="mt-16 ml-20">
        <Chessboard
            id="BasicBoard"
            boardWidth={window.innerWidth * 0.75}
            position={game.fen()}
            
          />

        </div>

          <div className="mt-5 gap-3 flex justify-center items-center">
            <Button onClick={PrevTactic}><FaArrowLeft /></Button>
            <Button onClick={setGameMove}><FaArrowRight /></Button>
            <Button onClick={NextTactic}>Next</Button>
          </div>
      </div>
    );
}

export default Global;