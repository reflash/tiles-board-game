import { Board } from "./board";

it("board is generated and constraints are complied with", () => {
  let n = 6;
  let m = 3;
  let board = new Board(n, m);

  expect(board.tiles.length).toBe(n);
  expect(board.tiles[0].length).toBe(n);
  expect(board.tiles.every(line => line.every(e => e > 0 && e <= m))).toBe(
    true
  );
});

// using Map, because Set has no interface for tuples
// Map = { row: Set { column } }
let getAllConnectedCoord = (tiles, n, m, color, nodes = new Map()) => {
  let row = nodes.get(n);
  if (row && row.has(m)) return nodes;

  if (row) row.add(m);
  else nodes.set(n, new Set([m]));

  let nmax = tiles.length - 1;
  let mmax = tiles[0].length - 1;
  // north
  if (n > 0 && tiles[n - 1][m] === color)
    getAllConnectedCoord(tiles, n - 1, m, color, nodes);
  // east
  if (m < mmax && tiles[n][m + 1] === color)
    getAllConnectedCoord(tiles, n, m + 1, color, nodes);
  // south
  if (n < nmax && tiles[n + 1][m] === color)
    getAllConnectedCoord(tiles, n + 1, m, color, nodes);
  // west
  if (m > 0 && tiles[n][m - 1] === color)
    getAllConnectedCoord(tiles, n, m - 1, color, nodes);

  return nodes;
};

let mapOfSetsToArray = map => {
  let res = [];
  for (var [key, value] of map) for (var item of value) res.push([key, item]);
  return res;
};

it("base node changes color to target and all the connected node either", () => {
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
  let board = new Board(n, m, testTiles);

  let baseColor = board.tiles[0][0];
  let targetColor = 3; // Select the color blue = 3
  let nodes = getAllConnectedCoord(board.tiles, 0, 0, baseColor);

  board.changeTile(targetColor);

  let newNodes = mapOfSetsToArray(nodes).map(
    arr => board.tiles[arr[0]][arr[1]]
  );

  expect(board.tiles[0][0]).toBe(targetColor);

  // > 1 if any extra nodes except for the base one
  if (newNodes.length > 1) {
    expect(newNodes[1]).toBe(targetColor);
    expect([0, targetColor]).toContain(newNodes.reduce((a, b) => a ^ b));
  }
});

it("if all tiles are of the same color => winning state", () => {
  let n = 6;
  let m = 3;
  let color = 2;
  let testTiles = Array(n + 1)
    .fill(color)
    .map(() => Array(n + 1).fill(color));
  let board = new Board(n, m, testTiles);
  expect(board.isWinning()).toBe(true);
});

it("if we reset the board, tiles state changes", () => {
  let n = 6;
  let m = 3;
  let board = new Board(n, m);
  let tiles = board.tiles;

  board.reset();
  expect(board.tiles).not.toEqual(tiles);
});

it("if we clone the board, tiles are different object but contain the same data", () => {
  let n = 6;
  let m = 3;
  let board = new Board(n, m);
  let boardClone = board.clone();

  expect(board.tiles).not.toBe(boardClone.tiles);
  expect(board.tiles).toEqual(boardClone.tiles);
});
