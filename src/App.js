import Die from "./Die";
import React from "react";
import { nanoid } from "nanoid";
import "./App.css";

function App() {
  // Create a state variable that will store the array of dice.
  const [diceArr, setDiceArr] = React.useState(allNewDice());

  // Create a state variable that will store whether the game is finished or not. Default to "false".
  const [tenzies, setTenzies] = React.useState(false);

  // Create a state variable that will store the number of moves the player has made.
  const [moves, setMoves] = React.useState(0);

  // Create a variable that will store the best score of the game (fewer moves).
  const [bestScore, setBestScore] = React.useState(999);

  // Everytime the best score gets lower, set it in local storage.
  React.useEffect(() => {
    localStorage.setItem("BestScore", JSON.stringify(bestScore));
  }, [bestScore]);

  // Check to see if the number of moves is at the end of the game is lower than the best score. If it is, set the best score.
  React.useEffect(() => {
    if (moves < bestScore && moves > 0) {
      setBestScore(moves);
    }
  }, [tenzies]);

  // Check if the game has ended.
  React.useEffect(() => {
    // Create a const that will store true or false depending on whether all dice are held or not.
    const allHeld = diceArr.every((die) => die.isHeld);

    // Store the first value that has been held.
    const firstValue = diceArr[0].value;

    // Check if all the dice have the value of the first held die.
    const allSameValue = diceArr.every((die) => die.value === firstValue);

    // If all dice are held and have the same value, set the end game value (tenzies) to true.
    if (allHeld && allSameValue) {
      setTenzies(true);
    }
  }, [diceArr]);

  // Function to generate random dice.
  function allNewDice() {
    // Create an empty array.
    let randomArr = [];

    // Push 10 dice objects inside the array that will store a value, an isHeld boolean and an id.
    for (let i = 0; i < 10; i++) {
      randomArr.push({
        value: Math.ceil(Math.random() * 6),
        isHeld: false,
        id: nanoid(),
      });
    }

    return randomArr;
  }

  // Roll the dice.
  function rollDice() {
    // Check if game has ended.
    if (tenzies) {
      endGame();
    }

    // Add 1 to the moves
    setMoves((prevMove) => prevMove + 1);

    // Re-roll the dice that are not held. Map through all dice and re-assign the value to the ones where isHeld is false.
    setDiceArr((oldDice) =>
      oldDice.map((die) => {
        if (die.isHeld === true) {
          return die;
        } else {
          return {
            ...die,
            value: Math.ceil(Math.random() * 6),
          };
        }
      })
    );
  }

  // Function to hold a die. Where the id of the die is equal to the selected one's id, change the isHeld Value.
  function holdDice(id) {
    setDiceArr((oldDice) =>
      oldDice.map((die) => {
        if (die.id === id) {
          return {
            ...die,
            isHeld: !die.isHeld,
          };
        } else return die;
      })
    );
  }

  // Reset the game.
  function endGame() {
    setTenzies(false);
    setDiceArr(allNewDice());
    setMoves(-1);
  }

  // Render all dice.
  const diceElements = diceArr.map((die) => {
    return (
      <Die
        key={die.id}
        value={die.value}
        isHeld={die.isHeld}
        onHoldDice={() => holdDice(die.id)}
      />
    );
  });

  // Game UI. All elements will be rendered according to the conditions they met.
  // If the game has ende, instead of the game instructions the text will change to "You Won!"
  // If there is no best score yet display "-". Otherwise display the actual best score.
  // The button text will display "Roll" if the game is on-going and "New Game" if the game has ended.
  return (
    <main>
      <div className="gameContainer">
        <h1 className="title">Tenzies</h1>
        <p className="instructions">
          {tenzies
            ? "You Won!"
            : "Roll until all dice are the same. Click each die to freeze it at its current value between rolls."}
        </p>
        <div className="mainContainer">{diceElements}</div>

        <p className="currentScore ">Current Score: {moves}</p>
        <p className="bestScore ">
          Best Score:
          {JSON.parse(localStorage.getItem("BestScore")) === 999
            ? " -"
            : " " + JSON.parse(localStorage.getItem("BestScore"))}
        </p>
        <button className="rollDice" onClick={rollDice}>
          {tenzies ? "New Game" : "Roll"}
        </button>
      </div>
    </main>
  );
}

export default App;
