import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return <button className="square" onClick={onSquareClick}>{value}</button>;
}

function Board({ xIsNext, squares, onPlay }) {
  // const [xIsNext, setXIsNext] = useState(true);
  // const [squares, setSquares] = useState(Array(9).fill(null));
  // Not needed anymore since we move this to the top level of Game

  function handleClick(i) {
    // return if cell is already set to a value -> don't override
    if (squares[i] != null || calculateWinner(squares)) return;

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);

  function updateStatus() {
    if (winner) {
      return "Winner: " + winner;
    } else if (!squares.includes(null)) {
      return "It's a Draw!";
    } else {
      return `Next player: ${xIsNext ? 'X' : 'O'}`;
    }
  }

  function renderBoard() {
    const boardRows = [];
    for (let row = 0; row < 3; row++) {
      const boardSquares = [];
      for (let col = 0; col < 3; col++) {
        const index = row * 3 + col;
        boardSquares.push(
          <Square key={index} value={squares[index]} onSquareClick={() => handleClick(index)} />
        );
      }
      boardRows.push(
        <div key={row} className="board-row">
          {boardSquares}
        </div>
      );
    }
    return boardRows;
  }

  return (
    <>
      <div className="status">{updateStatus()}</div>
      {renderBoard()}
    </>
  );
}

function calculateWinner(squares) {
  // all possible combinations
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null; // no winner found
}

export default function Game() {
  // const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0)
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 == 0;

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }

    if (move === currentMove) {
      description = "➡️ Move #" + move;
      return (
        <li key={move}>
          <button className='historyButton'>{description}</button>
        </li >
      );
    }

    return (
      <li key={move}>
        <button className='historyButton' onClick={() => setCurrentMove(move)}>
          {description}
        </button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ul>
          {moves}
        </ul>
      </div>
    </div>
  );
}