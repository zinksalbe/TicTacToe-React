import { useState } from 'react';
import swapIcon from "./images/swap.png";

function Square({ value, onSquareClick, isWinningIndex }) {
  const naming = "square" + (isWinningIndex ? " winnerSquare" : "");
  return <button className={naming} onClick={onSquareClick}> {value} </button>;
}

function Board({ xIsNext, squares, onPlay, winner, winnerIndexes }) {

  function handleClick(i) {
    // return if cell is already set to a value -> don't override
    if (squares[i] != null || calculateWinner(squares).winner) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  function updateStatus() {
    if (winner) {
      return "Winner: " + winner;
    } else if (!squares.includes(null)) {
      return "It's a Draw!";
    } else {
      return `Next player: ${xIsNext ? 'X' : 'O'}`;
    }
  }

  return (
    <>
      <div className="status">{updateStatus()}</div>
      {Array(3).fill(null).map((_, row) => {
        return (
          <div key={row} className="board-row">
            {Array(3).fill(null).map((_, col) => {
              const index = row * 3 + col;
              return <Square key={col} value={squares[index]} onSquareClick={() => handleClick(index)}
                isWinningIndex={winnerIndexes.includes(index)} />;
            })}
          </div>
        );
      })}
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
      return { winner: squares[a], winnerIndexes: [a, b, c] }; // return the winner
    }
  }
  return { winner: null, winnerIndexes: [] }; // no winner found
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [isMovesReversed, setIsMovesReversed] = useState(false);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 == 0;
  const { winner, winnerIndexes } = calculateWinner(currentSquares);


  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  const moves = history.map((squares, move) => {
    if (move === currentMove) {
      return (
        <li key={move}>
          <button className='historyButton'>{"➡️ Move #" + move}</button>
        </li >
      );
    }
    return (
      <li key={move}>
        <button className='historyButton' onClick={() => setCurrentMove(move)}>
          {`${move > 0 ? "Go to move #" + move : "Go to game start"}`}
        </button>
      </li>
    );
  });

  return (
    <>
      <div className="game">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} winner={winner} winnerIndexes={winnerIndexes} />
        </div>
        <div className="game-info">
          <div className='history'>
            <ol>
              {isMovesReversed ? moves.reverse() : moves}
            </ol>
            <button className="swapButton" onClick={() => setIsMovesReversed(!isMovesReversed)}><img className="swapIcon" src={swapIcon} alt="Swap Icon" /></button>
          </div>
          <button onClick={() => { setHistory([Array(9).fill(null)]); setCurrentMove(0); }}>Reset</button>
        </div>
      </div>
    </>
  );
}