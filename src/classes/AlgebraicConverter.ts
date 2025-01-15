import { Chess, Square, Piece, PieceSymbol } from "chess.js";

const STOCKFISH_NOTATION = "c7c5,c2c3,d7d5,e4d5,d8d5,g1f3,g8f6,b1a3,b8c6,f1c4";

const VALID_SQUARES = new Set<Square>([
  "a8",
  "b8",
  "c8",
  "d8",
  "e8",
  "f8",
  "g8",
  "h8",
  "a7",
  "b7",
  "c7",
  "d7",
  "e7",
  "f7",
  "g7",
  "h7",
  "a6",
  "b6",
  "c6",
  "d6",
  "e6",
  "f6",
  "g6",
  "h6",
  "a5",
  "b5",
  "c5",
  "d5",
  "e5",
  "f5",
  "g5",
  "h5",
  "a4",
  "b4",
  "c4",
  "d4",
  "e4",
  "f4",
  "g4",
  "h4",
  "a3",
  "b3",
  "c3",
  "d3",
  "e3",
  "f3",
  "g3",
  "h3",
  "a2",
  "b2",
  "c2",
  "d2",
  "e2",
  "f2",
  "g2",
  "h2",
  "a1",
  "b1",
  "c1",
  "d1",
  "e1",
  "f1",
  "g1",
  "h1",
]);

const VALID_PIECE_SYMBOL = new Set<PieceSymbol>(["p", "n", "b", "r", "q", "k"]);

export class Converter {
  game: Chess;
  stockFishNotation : string[];

  constructor(game : Chess, stockFishNotation : string[]) {
    this.game = new Chess(game.fen());
    this.stockFishNotation = stockFishNotation;
  }

  private toSquare(value: string): Square | undefined {
    return VALID_SQUARES.has(value as Square) ? (value as Square) : undefined;
  }

  private toPieceSymbol(value: string): PieceSymbol | undefined {
    return VALID_PIECE_SYMBOL.has(value as PieceSymbol)
      ? (value as PieceSymbol)
      : undefined;
  }

  private hasUpperCase(str : string) {
    return str !== str.toLowerCase();
  }


  change(): string[] {
    var line: string[] = this.stockFishNotation;
    var algebraicNotation: string[] = [];
    var position: Square = "e4";
    for (var move of line) {
      var startingString: string = move.substring(0, 2);
      var startingSquare: Square | undefined = this.toSquare(startingString);

      if (startingSquare) {
        var PieceSymbol = this.game.get(startingSquare).type;
        var pieceString = "";
        switch (PieceSymbol) {
          case "p":
            break;
          case "n":
            pieceString = "N";
            break;
          case "b":
            pieceString = "B";
            break;
          case "r":
            pieceString = "R";
            break;
          case "k":
            pieceString = "K";
            break;
          case "q":
            pieceString = "Q";
            break;
          default:
            break;
        }
        var endMove = move.substring(2, 4)
        var algebraicForm : string = ""
        for (var gameMove of this.game.moves()){
            if(pieceString.length === 0){
                if(gameMove.includes(endMove) && !this.hasUpperCase(gameMove)){
                    algebraicForm = gameMove;
                    break;
                }
            }
            else {
                if (gameMove.includes(endMove) && gameMove.includes(pieceString)) {
                  algebraicForm = gameMove;
                  break;
                }
            }
        }
        algebraicNotation.push(algebraicForm);
        this.game.move(algebraicForm);
      } else {
        throw new Error(`parameter is not a move! ${startingSquare}`);
      }
    }
    return algebraicNotation;
  }

}
