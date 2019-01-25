// Use the idea similar to flood, but count border colors instead
let findEachColorFloodAmount = (
  tiles,
  tilesVisitor,
  n,
  m,
  nmax,
  mmax,
  target_color,
  colors
) => {
  if (tilesVisitor[n][m]) return colors;
  if (tiles[n][m] !== target_color) {
    // increment color amount
    colors.set(tiles[n][m], colors.get(tiles[n][m]) + 1);
    return colors;
  }
  tilesVisitor[n][m] = true;

  // north
  if (n > 0)
    findEachColorFloodAmount(
      tiles,
      tilesVisitor,
      n - 1,
      m,
      nmax,
      mmax,
      target_color,
      colors
    );
  // east
  if (m < mmax)
    findEachColorFloodAmount(
      tiles,
      tilesVisitor,
      n,
      m + 1,
      nmax,
      mmax,
      target_color,
      colors
    );
  // south
  if (n < nmax)
    findEachColorFloodAmount(
      tiles,
      tilesVisitor,
      n + 1,
      m,
      nmax,
      mmax,
      target_color,
      colors
    );
  // west
  if (m > 0)
    findEachColorFloodAmount(
      tiles,
      tilesVisitor,
      n,
      m - 1,
      nmax,
      mmax,
      target_color,
      colors
    );

  return colors;
};

export class Player {
  bestStep(tiles, options) {
    let optionsMap = new Map(options.map(i => [i, 0]));
    let nmax = tiles.length - 1;
    let mmax = tiles[0].length - 1;
    let tilesVisitor = Array(nmax + 1)
      .fill(false)
      .map(() => Array(nmax + 1).fill(false)); // contains bools that indicate if a tile was visited

    let colorsFloodAmount = findEachColorFloodAmount(
      tiles,
      tilesVisitor,
      0,
      0,
      nmax,
      mmax,
      tiles[0][0],
      optionsMap
    );

    let bestStepColor = 0;
    let bestStepValue = -1;
    colorsFloodAmount.forEach((value, key, map) => {
      if (value > bestStepValue) {
        bestStepColor = key;
        bestStepValue = value;
      }
    });

    return bestStepColor;
  }
}
