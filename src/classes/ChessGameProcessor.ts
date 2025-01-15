import { WeeklyData } from './WeeklyData';
import { PercentageInfo } from './PercentageInfo';
import { ChessGameFetcher } from './ChessGameFetcher';
import { IResultName, IGameInfo, GameInfo } from './GameInfo';
import { OpeningResults } from './OpeningResults';
import { Chess } from 'chess.js';
import { MoveTree } from './MoveTree'
import { scrapeOpening, moveScraper } from '@/functions/MoveScraper';
export class ChessGameProcessor {
  private gameInfo: GameInfo[];
  private openingResults: OpeningResults = new OpeningResults();
  private moveTree : MoveTree = new MoveTree();

  constructor(gameInfo: GameInfo[]) {
    this.gameInfo = gameInfo;
  }

  init(){
    this.findResults();
  }

  private findResults() {
    for (var info of this.gameInfo) {
      this.openingResults.updateOpeningResults(info.getResultName());
      this.moveTree.pgnNodeConversion(moveScraper(info.getPgn()), info.getResultName().result);
    }
  }


  getResults(){
    return this.openingResults;
  }

  getMoveTree(){ return this.moveTree; }


}