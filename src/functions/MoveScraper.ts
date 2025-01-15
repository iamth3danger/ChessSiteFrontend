
export function moveScraper(moves: string) {
  moves = removeBrackets(moves);
  var moveSplit: string[] = moves.split(" ");
  moveSplit = moveSplit.slice(0, moveSplit.length - 1)
  var movesList: string[] = [];

  for (let i = 0; i < moveSplit.length - 1; i += 3) {
    movesList.push(moveSplit[i] + " " + moveSplit[i + 1]);
  }

  return movesList;
}

function removeBrackets(input: string): string {
  return input
    .replace(/\[.*?\]/g, "")
    .replace(/{.*?}/g, "")
    .trim();
}

export function getAlgebraicMove(move: string) {
  const split = move.split(" ");
  var moveObj = { moveNumber: split[0], moveString: split[1] };
  return moveObj;
}

export function scrapeOpening(input: string) {
  const regex = /"https:\/\/www\.chess\.com\/openings\/[^"]*"/;

  // Match the URL
  const match = input.match(regex);

  if (match) {
    // Extract and remove the quotes
    const url = match[0].slice(1, -1);
    const opening = url.split("/");
    return opening[4].replace("-", " ");
  } else {
    console.log("No matching URL found.");
  }
}
