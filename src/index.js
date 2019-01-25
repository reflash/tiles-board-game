import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import { Board } from "./services/board";
import { Player } from "./services/player";

let m = 3;
let board = new Board(6, m);
let isWin = false;
let counter = 0;
let simulatePlayer = new Player();
let maxCounter = 0;

let rerender = () => {
  const rootElement = document.getElementById("root");
  ReactDOM.render(<App />, rootElement);
};

let changeColor = el => {
  board.changeTile(el);
};

let autoStep = () => {
  let options = [...Array(m).keys()].map(x => x + 1);
  let bestStep = simulatePlayer.bestStep(board.tiles, options);
  changeColor(bestStep);
};

function onGameStart() {
  board.reset();
  isWin = false;
  counter = 0;
  maxCounter = 0;
  rerender();
}

function onGameStep() {
  counter++;
  isWin = board.isWinning();
  rerender();
  if (isWin) {
    new Promise(resolve => setTimeout(resolve, 2500)).then(() => {
      onGameStart();
    });
  }
}

function App() {
  return (
    <div className="App">
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
          <div onClick={autoStep} className="elem auto">
            Auto
          </div>
        </div>
      </div>
      <div id="overlay" style={{ display: isWin ? "flex" : "none" }}>
        You won in {counter} steps! Congratulations!
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
