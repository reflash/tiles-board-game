let repeat = (fn, n) =>
  Array(n)
    .fill(0)
    .map(fn);
let rand = m => () => Math.floor(Math.random() * m + 1);
let generate = (n, m) => repeat(() => repeat(rand(m), n), n);

// Used the flood fill algorithm https://en.wikipedia.org/wiki/Flood_fill
let floodFill = (board, n, m, target_color, replacement_color) => {
  if (target_color === replacement_color) return;
  if (board[n][m] !== target_color) return;
  board[n][m] = replacement_color;

  let nmax = board.length - 1;
  let mmax = board[0].length - 1;

  // north
  if (n > 0) floodFill(board, n - 1, m, target_color, replacement_color);
  // east
  if (m < mmax) floodFill(board, n, m + 1, target_color, replacement_color);
  // south
  if (n < nmax) floodFill(board, n + 1, m, target_color, replacement_color);
  // west
  if (m > 0) floodFill(board, n, m - 1, target_color, replacement_color);

  return;
};

export class Board {
  constructor(n, m, tiles = []) {
    this.n = n;
    this.m = m;
    this._tiles = tiles.length ? tiles : generate(n, m);
  }

  changeTile(replacement_color) {
    let base_color = this._tiles[0][0];
    floodFill(this._tiles, 0, 0, base_color, replacement_color);
  }

  isWinning() {
    let baseColor = this._tiles[0][0];

    for (var row of this._tiles)
      for (var cell of row) if (cell !== baseColor) return false;

    return true;
  }

  reset() {
    this._tiles = generate(this.n, this.m);
  }

  get tiles() {
    return this._tiles;
  }
}
