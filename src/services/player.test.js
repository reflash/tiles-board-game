import { Player } from "./player";
import { Board } from "./board";

it("player makes a greediest step", () => {
  let n = 6;
  let m = 3;
  let testTiles = [
    [2, 2, 1, 3, 2, 1],
    [3, 2, 3, 2, 3, 2],
    [2, 3, 2, 3, 1, 3],
    [2, 2, 2, 1, 2, 3],
    [2, 1, 2, 2, 1, 2],
    [3, 2, 1, 2, 3, 1]
  ];
  let options = [...Array(m).keys()].map(x => x + 1);

  let board = new Board(n, m, testTiles);
  let player = new Player();

  let nextStep = player.bestStep(board.tiles, options);

  expect(nextStep).toBe(3); // 3 is the best step for our algorithm
});
