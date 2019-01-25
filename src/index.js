import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import { Board } from "./services/board";
import { Player } from "./services/player";

let m = 3;
let board = new Board(6, m);
let isWin = false;
let counter = 0;
let player = new Player();

let rerender = () => {
  const rootElement = document.getElementById("root");
  ReactDOM.render(<App />, rootElement);
};

let changeColor = async el => {
  counter++;
  board.changeTile(el);
  isWin = board.isWinning();
  rerender();
  if (isWin) {
    new Promise(resolve => setTimeout(resolve, 2500)).then(() => {
      board.reset();
      isWin = false;
      counter = 0;
      rerender();
    });
  }
};

let autoStep = () => {
  let options = [...Array(m).keys()].map(x => x + 1);
  let bestStep = player.bestStep(board.tiles, options);
  changeColor(bestStep);
};

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
