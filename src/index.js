import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import { Board } from "./services/board";
import { Player } from "./services/player";

let m = 3;
let board = new Board(6, m);
let isEnd = false;
let counter = 0;
let simulatePlayer = new Player();
let maxCounter = 0;
let score = 1; // 1 for initial decrement
onGameStart();

// returns number of steps it took for the autoplayer to win
function simulate(): number {
  let options = [...Array(m).keys()].map(x => x + 1);
  let boardClone = board.clone();
  let counter = 0;

  while (!boardClone.isWinning()) {
    counter++;
    let bestStep = simulatePlayer.bestStep(boardClone.tiles, options);
    boardClone.changeTile(bestStep);
  }

  return counter;
}

function rerender() {
  const rootElement = document.getElementById("root");
  ReactDOM.render(<App />, rootElement);
}

function onGameStart() {
  if (board.isWinning()) {
    score += maxCounter - counter;
  } else {
    score--;
  }

  board.reset();
  isEnd = false;
  counter = 0;
  maxCounter = simulate();
  rerender();
}

function onGameStep() {
  counter++;
  rerender();
  isEnd = board.isWinning() || counter >= maxCounter;
  if (isEnd) {
    new Promise(resolve => setTimeout(resolve, 2500)).then(() => {
      onGameStart();
    });
  }
}

function changeColor(el: number) {
  // if same color
  if (board.tiles[0][0] === el) return;

  board.changeTile(el);
  onGameStep();
}

function App() {
  return (
    <div className="App">
      <div className="hint">Win the game in {maxCounter} steps </div>
      <div className="board">
        {board.tiles.map(line => {
          var lines = line.map(el => {
            return <div className={"elem color-" + el.toString()} />;
          });
          return <div className="line">{lines}</div>;
        })}
      </div>
      <div className="control">
        <div className="line">
          {[1, 2, 3].map(el => {
            return (
              <div
                onClick={() => changeColor(el)}
                className={"elem color-" + el.toString()}
              />
            );
          })}
          <div className="score-nums">
            <div className="score-column">
              <span>Steps: {counter}</span>
              <span>Score: {score}</span>
            </div>
          </div>
        </div>
      </div>
      <div id="overlay" style={{ display: isEnd ? "flex" : "none" }}>
        {board.isWinning()
          ? "You won in " +
            counter +
            " steps! Congratulations! +" +
            (maxCounter - counter) +
            " points"
          : "You lost -1 point :( Try again, please"}
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
