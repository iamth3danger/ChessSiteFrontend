"use client"

import VerticalProgressBar from "./VerticalProgressBar";
import { Chessboard } from "react-chessboard";
import MoveCard from "./MoveCard";
import { useState, useEffect } from "react";
import { Chess, Square, Move, Color } from "chess.js";
import { Converter } from "@/classes/AlgebraicConverter";
import { MoveTree, MoveNode } from "@/classes/MoveTree";
import { ChessGameFetcher } from "@/classes/ChessGameFetcher";
import { ChessGameProcessor } from "@/classes/ChessGameProcessor";

interface EvalResult {
  bestMove: string;
  evaluation: string;
  bestLine: string[];
}

interface ClientSideProps{
    nodes : MoveTree;
}

export interface MoveNodeData {
  id: number;
  moveNumber: number;
  moveString: string;
  fullMove: string;
  count: number;
  winRate: number;
  root: boolean;
  nodeId: string;
  parentId: string;
  username: string;
}

export function ClientSideWrapper(){
      const [game, setGame] = useState<Chess>(new Chess());
      const [stockfish, setStockfish] = useState<Worker | null>(null);
      const [bestMove, setBestMove] = useState("");
      const [evaluation, setEvaluation] = useState("0");
      const [bestLine, setBestLine] = useState<string[]>([]);
      const [moveTree, setMoveTree] = useState<MoveTree>(new MoveTree());
      const [moveNode, setMoveNode] = useState<MoveNode>(new MoveNode("", ""));
      const [moveNumber, setMoveNumber] = useState<number>(0);
      const [data, setData] = useState<MoveNodeData[] | null>(null);

      const findChildren = async(move: string) => {
        if(!data)
          return;
        var match = false;
        for (var node of data){
          if(node.moveString.includes(move)){
            match = true;
            await fetch(`http://localhost:8080/move/child/dangertosh/${node.nodeId}`)
              .then((response) => response.json())
              .then((data) => {
                setData(data);
              });
          }
        }

        if(!match)
          setData(null);
      }

      useEffect(() => {
        fetch("http://localhost:8080/move/first/dangertosh")
          .then((response) => response.json())
          .then((data) => {
            setData(data);
          });
      }, []);

      useEffect(() => {
        const stockfishWorker = new Worker("/js/stockfish-16.1-single.js");
        setStockfish(stockfishWorker);


        stockfishWorker.onmessage = (event) => {
          const message = event.data;
          if (message.startsWith("bestmove")) {
            const move = message.split(" ")[1];
            setBestMove(move);

          }
        };
        return () => {
          stockfishWorker.terminate();
        };
      }, []);

      useEffect(() => {
        const setMoveNodes = async () => {
          const gameFetcher = new ChessGameFetcher(
            "dangertosh",
            "2024",
            "08",
            "2024",
            "11"
          );

          await gameFetcher.fetchGameArchives();
          const gameProcessor = new ChessGameProcessor(
            gameFetcher.logOpenings()
          );
          gameProcessor.init();
          let tree = gameProcessor.getMoveTree();
          let node = tree.getChild();

          // Traverse to the final child node
          while (node.getChildren().length !== 0) {
            node = node.getChild(0)!;
          }

          // Set the move tree state
          setMoveTree(new MoveTree(gameProcessor.getMoveTree()));
        };

        setMoveNodes();
      }, []); // The empty array ensures this runs only once, similar to componentDidMount

      // Log the updated moveTree whenever it changes

      const getEvaluation = (message: string, turn: Color) => {
        let result: EvalResult = { bestMove: "", evaluation: "", bestLine: [] };


        if (message.startsWith("bestmove")) {
          result.bestMove = message.split(" ")[1];
        }

        if (message.includes("info") && message.includes("score")) {
          const scoreParts = message.split(" ");
          const scoreIndex = scoreParts.indexOf("score") + 2; 

          if (scoreParts[scoreIndex - 1] === "cp") {

            let score = parseInt(scoreParts[scoreIndex], 10);
            if (turn !== "b") {
              score = -score; 
            }
            result.evaluation = `${score / 100}`;
          } else if (scoreParts[scoreIndex - 1] === "mate") {

            const mateIn = parseInt(scoreParts[scoreIndex], 10);
            result.evaluation = `Mate in ${Math.abs(mateIn)}`;
          }

          if (message.includes("15")) {
            const lineIndex = scoreParts.indexOf("pv");
            result.bestLine = scoreParts.slice(
              lineIndex + 1,
              scoreParts.length - 1
            );
          }
        }

        return result;
      };

      interface moveParams {
        from: string;
        to: string;
        promotion?: string;
      }

      function makeAMove(move: string | moveParams) {
        let result: Move | null = null;
        try {
          const gameCopy = Object.assign(new Chess(), game);

          result = gameCopy.move(move);
          setMoveNumber(gameCopy.moveNumber());
          gameCopy.turn();
          console.log(gameCopy.history());
          
          let gameHistLength = gameCopy.history().length
          console.log(gameCopy.history()[gameHistLength - 1]);
          findChildren(gameCopy.history()[gameHistLength - 1]);

          if(moveTree){
            if(gameHistLength === 1){
                console.log(gameCopy.history()[gameHistLength - 1]);
                console.log(moveTree.childrenToString());
                let node : MoveNode | null = moveTree.getNode(gameCopy.history()[gameHistLength - 1]);
                console.log(node?.getMove());
                if (node !== null){
                    console.log(node?.getMove());
                    setMoveNode(node!);
                }
            }
            else {
                let node = moveNode?.searchChild(
                gameCopy.history()[gameHistLength - 1]
                );
                if (node !== null) {
                    console.log(node?.getMove());
                    setMoveNode(node!);
                }
            }
        }
          if (stockfish) {
            stockfish.postMessage(`position fen ${gameCopy.fen()}`);
            stockfish.postMessage("go depth 15");

            stockfish.onmessage = (event) => {
              const { bestMove, evaluation, bestLine } = getEvaluation(
                event.data,
                game.turn()
              );
              if (bestMove) setBestMove(bestMove);
              if (evaluation) setEvaluation(evaluation);
              if (bestLine.length !== 0) {
                const converter: Converter = new Converter(gameCopy, bestLine);
                setBestLine(converter.change());
              }
            };
          }
          setGame(gameCopy);
        } catch (e) {}
        return result;
      }

      function onDrop(sourceSquare: Square, targetSquare: Square) {
        const move = makeAMove({
          from: sourceSquare,
          to: targetSquare,
          promotion: "q", 
        });

        //console.log(bestLine);

        // illegal move
        if (move === null) {
          return false;
        }
        return true;
      }


    return (
      <div className="container flex flex-wrap justify-center my-8 xl:max-h-[100vh] border-2 p-2">
        <div className=" mr-4">
          <VerticalProgressBar
            value={parseFloat(evaluation)}
            height={window.innerHeight * 0.73}
          />
        </div>
        <div className="">
          <Chessboard
            id="BasicBoard"
            boardWidth={window.innerWidth * 0.35}
            position={game.fen()}
            onPieceDrop={onDrop}
          />
        </div>
        <div className="ml-5 mt-7">
          <MoveCard bestMove={bestLine.toString()} moveNumber={moveNumber} data={data}/>
        </div>
      </div>
    );
}