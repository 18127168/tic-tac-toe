import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

function Square(props) { 
  const className = 'square ' + (props.class ?? '');
  return (
    <button className={className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const winningLine = this.props.winningLine;

    if (winningLine !== null && winningLine.includes(i)) {
      console.log("true");
    }

    return (
      <Square
        class={ ((winningLine !== null && winningLine.includes(i))? "hightlightCell" : "") }
        value={ this.props.squares[i] }
        onClick={ () => this.props.onClick(i) }
      />
    );
  }

  getRow(i) {
    let items = [];
    for (let j = 0; j < 5; j++) {
      items.push(this.renderSquare(i*5+j));
    }
    return <div className="board-row">{items}</div>;
  }
  
  render() {
    let items = [];

    items.push(<div></div>)
    for (let i = 0; i < 5; i++) {
      items.push(this.getRow(i));
    }
    return <div>{items}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          col: null,
          row: null
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      sortedAsc: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    let postion = calculatePosition(i);
    let winning = calculateWinner(squares);

    if (winning !== null || (squares[i] !== null && squares[i] !== undefined)) {
      return;
    } 
    console.log(squares[i]);
    
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          row: postion.row,
          col: postion.col
        }
      ]),
      selectedItem: i,
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winning = calculateWinner(current.squares);
    const stepNumber = this.state.stepNumber;

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + "(" + step.col + ", " + step.row + ")" :
        'Go to game start';
      return (
        <li key={move}>
          <button
            className={move === stepNumber ? "textBold" : ""} 
            onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winning === null) {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    } else if (winning.win) {
      status = "Winner: " + winning.winner;
    } else {
      status = "This match is draw!"
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winningLine={ winning? (winning.winningLine ?? null) : null }
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.setState({    sortedAsc: !this.state.sortedAsc  })}> Sort The Move </button>
          <ol>{ this.state.sortedAsc? moves : moves.reverse()}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculatePosition(position){
  const col = position%5;
  const row = Math.floor(position/5);

  return { col, row}
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    [0, 5, 10, 15, 20],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],
    [0, 6, 12, 18, 24],
    [4, 8, 12, 16, 20],
  ];
  for (let i = 0; i < lines.length; i++) {
    let [a, b, c, d, e] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d] && squares[a] === squares[e]) {
      return {win: true, winner: squares[a], winningLine: [a, b, c, d, e]} ;
    }
  }

  for (let i = 0; i < squares.length; i++){
    if (squares[i] === null || squares[i] === undefined){
      return null;
    }
  }

  return {win: false} ;
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
