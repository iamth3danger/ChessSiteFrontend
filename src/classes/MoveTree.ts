import { getAlgebraicMove } from "@/functions/MoveScraper";

interface IAlgebraicWin {
  algebraic: string;
  result: string;
}

enum ColorPlayed{
    WHITE,
    BLACK
}

interface IMoveNodeData {
    num: number;
    move : string;
    color : ColorPlayed;
}

export class MoveNode {
  private moveNumber: number;
  private moveString: string;
  private move: string
  private count: number = 0;
  private winRate: number;
  private children: MoveNode[] = [];
  private colorPlayed: ColorPlayed;

  constructor(move: string, result: string) {
    this.move = move;
    const {moveNumber, moveString} = getAlgebraicMove(move);
    this.moveNumber = parseInt(moveNumber.charAt(0));
    this.colorPlayed = moveNumber.length == 2 ? ColorPlayed.WHITE : ColorPlayed.BLACK;
    this.moveString = moveString;
    this.count++;
    this.winRate = result === "win" ? 1 : 0;
  }

  update(result: string) {
    var numResult = result === "win" ? 1 : 0;
    this.winRate = (this.winRate * this.count + numResult) / (this.count + 1);
    this.count++;
  }

  addChild(node: MoveNode) {
    this.children.push(node);
  }

  getChild(iter: number) {
    if (iter >= 0 && iter < this.children.length) {
      return this.children.at(iter);
    } else throw new Error("invalid arguments");
  }

  searchChild(move: string) : MoveNode | null {
    for (let child of this.children){
      if(child.moveString === move){
        return child;
      }
    }
    return null;
  }

  getChildren() : MoveNode[] {
    return this.children;
  }

  getMoveNumber() {
    return this.moveNumber;
  }

  getNodeData() : IMoveNodeData {
    return {
        num : this.moveNumber,
        move : this.moveString,
        color : this.colorPlayed
    };
  }

  getMoveStr() : string {
    return this.moveString;
  }

  getMove() {
    return this.move;
  }
}

export class MoveTree {
  private moveNodes: MoveNode[] = [];

  constructor(moveTree?: MoveTree) {
    if (moveTree !== undefined)
      this.moveNodes = moveTree.moveNodes
  }

  pgnNodeConversion(moves: string[], result: string) {
    var start = moves[0];
    for (var node of this.moveNodes) {
      if (node.getMove() === start) {
        node.update(result);
        this.addToNodes(node, moves, 1, result)
      }
    }

    this.moveNodes.push(new MoveNode(start, result));
    var newNode : MoveNode = this.moveNodes.at(this.moveNodes.length - 1)!;
    this.addToNodes(newNode, moves, 1, result);
  }

  addToNodes(
    node: MoveNode,
    moves: string[],
    i: number,
    result: string,
  ) {
    for (var child of node.getChildren()){
        if (child.getMove() === moves[i] && i < moves.length){
            node = child;
            node.update(result);
            i++;
            this.addToNodes(node, moves, i, result);
        }
    }
    this.nodeRecursion(node, moves, i, result);
  }

  nodeRecursion(
    node: MoveNode,
    moves: string[],
    i: number,
    result: string,
  ) {
    if (i < moves.length) {
      node.addChild(new MoveNode(moves[i], result));
      node = node.getChild(0)!;
      i++;
      this.nodeRecursion(node, moves, i, result);
    } else {
      return;
    }
  }

  getChild(){
    return this.moveNodes[0];
  }

  getNode(move: string): MoveNode | null {
    for (let node of this.moveNodes){
      if(node.getMoveStr() === move){
        return node;
      }
    }

    return null;
  }

  childrenToString(){
    var childStr = "Children : "
    for (var child of this.moveNodes){
      childStr += child.getMoveStr() + " ";
    }
    return childStr;
  }
}
