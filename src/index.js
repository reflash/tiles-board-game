import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import { Board } from "./services/board";
import { Player } from "./services/player";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.n = 6;
    this.m = 3;

    this.options = [...Array(this.m).keys()].map(x => x + 1);

    this.state = {
      board: new Board(this.n, this.m),
      simulatedPlayer: new Player(),

      isEnd: false,
      counter: 0,
      score: 0
    };

    this.state.maxCounter = this.simulate();
  }

  // returns number of steps it took for the autoplayer to win
  simulate(): number {
    let boardClone = this.state.board.clone();
    let counter = 0;

    while (!boardClone.isWinning()) {
      counter++;
      let bestStep = this.state.simulatedPlayer.bestStep(
        boardClone.tiles,
        this.options
      );
      boardClone.changeTile(bestStep);
    }

    return counter;
  }

  onGameStart() {
    let newScore = this.state.board.isWinning()
      ? this.state.score + this.state.maxCounter - this.state.counter
      : this.state.score - 1;

    this.state.board.reset();

    this.setState({
      board: this.state.board,
      simulatedPlayer: this.state.simulatedPlayer,

      isEnd: false,
      counter: 0,
      maxCounter: this.simulate(),
      score: this.state.score
    });
  }

  onGameStep() {
    let isEnd =
      this.state.board.isWinning() ||
      this.state.counter + 1 >= this.state.maxCounter;
    this.setState({
      board: this.state.board,
      simulatedPlayer: this.state.simulatedPlayer,

      isEnd: isEnd,
      counter: this.state.counter + 1,
      maxCounter: this.state.maxCounter,
      score: this.state.score
    });

    if (isEnd) {
      new Promise(resolve => setTimeout(resolve, 2500)).then(() => {
        this.onGameStart();
      });
    }
  }

  changeColor(el: number) {
    // if same color
    if (this.state.board.tiles[0][0] === el) return;

    this.state.board.changeTile(el);
    this.onGameStep();
  }

  render() {
    return (
      <div className="App">
        <div className="hint">
          Win the game in {this.state.maxCounter} steps{" "}
        </div>
        <div className="board">
          {this.state.board.tiles.map(line => {
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
                  onClick={() => this.changeColor(el)}
                  className={"elem color-" + el.toString()}
                />
              );
            })}
            <div className="score-nums">
              <div className="score-column">
                <span>Steps: {this.state.counter}</span>
                <span>Score: {this.state.score}</span>
              </div>
            </div>
          </div>
        </div>
        <div
          id="overlay"
          style={{ display: this.state.isEnd ? "flex" : "none" }}
        >
          {this.state.board.isWinning()
            ? "You won in " +
              this.state.counter +
              " steps! Congratulations! +" +
              (this.state.maxCounter - this.state.counter) +
              " points"
            : "You lost -1 point :( Try again, please"}
        </div>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
