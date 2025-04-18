"use client"

import Header from "../components/Header"
import { Chessboard } from "react-chessboard";
import { useState, useRef, useEffect } from "react";
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

  const [game, setGame] = useState<Chess>(new Chess(tacticsData[0].fen));
  const [currentGame, setCurrentGame] = useState(0);
  const [currentMove, setCurrentMove] = useState(0);
  const [boardOrientation, setBoardOrientation] = useState<"white" | "black">(game.turn() === "w" ? "black" : "white");
  const [boardKey, setBoardKey] = useState(0);
  const [message, setMessage] = useState<string>("");
  const [playerTurn, setPlayerTurn] = useState(false);


  const setGameMove = () => {
    if (currentMove >= tacticsData[currentGame].moves.length){
      return;
    }
    
    const gameCopy = Object.assign(new Chess(), game);

    const startMove = tacticsData[currentGame].moves[currentMove].slice(0, 2);
    const endMove = tacticsData[currentGame].moves[currentMove].slice(2);
    
    try {
      gameCopy.move({from: startMove, to: endMove});
      setCurrentMove(currentMove + 1);
      setGame(gameCopy);
      
      // After computer move, it's player's turn
      setPlayerTurn(true);
      setMessage("Your turn! Find the best move.");
    } catch (error) {
      setMessage(`Invalid move ${startMove + endMove}. Try again.`);
    }
  };



  const NextTactic = () => {
    if (currentGame < tacticsData.length - 1) {
      const nextGame = currentGame + 1;
      setGame(new Chess(tacticsData[nextGame].fen));
      setCurrentGame(nextGame);
      setCurrentMove(0);
      setPlayerTurn(false);
      setMessage("");
      setBoardKey(prevKey => prevKey + 1);
    }
  };

  const PrevTactic = () => {
    if (game.history().length > 0) {
      game.undo();
      setCurrentMove(currentMove - 1);
      setPlayerTurn(game.history().length % 2 === 1);
    }
  };

  useEffect(() => {
    // Small delay to ensure board is rendered first
    setBoardOrientation(game.turn() === "w" ? "black" : "white");

    const timer = setTimeout(() => {
      if (currentMove === 0 && tacticsData[currentGame].moves.length > 0) {
        console.log("Setting game move");
        setGameMove(); // This plays the first move and sets playerTurn to true
      }

      if (currentMove > 0)
        console.log("Current move: ", currentMove);
      if (tacticsData[currentGame].moves.length === 0)
        console.log("No moves in current game");
    }, 500);
    
    return () => clearTimeout(timer);
  }, [currentGame]);

  function onDrop(sourceSquare: Square, targetSquare: Square) {
    if (!playerTurn) {
      return false;
    }
    
    const gameCopy = Object.assign(new Chess(), game);
    
    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to queen for simplicity
    });
    if (move === null) {
      return false;
    }
    const expectedMove = tacticsData[currentGame].moves[currentMove];
    const moveNotation = sourceSquare + targetSquare;
    
    if (expectedMove.startsWith(moveNotation)) {
      setGame(gameCopy);
      setCurrentMove(currentMove + 1);
      setPlayerTurn(false); // Now it's computer's turn
      setMessage("Good move! Computer is thinking...");
    return true;
    
    } else {
      setMessage("Incorrect move. Try again.");
      return false;
    }
  }

  useEffect(() => {
    if (!playerTurn){
      if (currentMove < tacticsData[currentGame].moves.length && currentMove > 0) {
        setMessage("Making move...")
        console.log("response move being made")
        setGameMove();
      } else {
        setMessage("Puzzle completed! Try the next one.");
      }
    }
  }, [playerTurn]);

    return (
      <div>
        <div className="mt-16 ml-20">
        <Chessboard
            key={boardKey}
            id="BasicBoard"
            boardWidth={750}
            position={game.fen()}
            boardOrientation={boardOrientation}
            onPieceDrop={onDrop}
          />
        </div>
        
        {message && (
          <div className="text-center mt-3 text-lg font-semibold">
            {message}
          </div>
        )}

        <div className="mt-5 gap-3 flex justify-center items-center">
          <Button onClick={PrevTactic}><FaArrowLeft /></Button>
          <Button onClick={setGameMove}><FaArrowRight /></Button>
          <Button onClick={NextTactic}>Next</Button>
        </div>
      </div>
    );
}

export default Global;