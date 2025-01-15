


export class urker {
  uciWorker = (file: string, actions: Array<string>): void => {
    const worker = new Worker(file);


    worker.addEventListener("message", (e) => {
      const move = e.data.match(/^bestmove\s([a-h][1-8])([a-h][1-8])/);
      console.log(move);
    });
  };
}
