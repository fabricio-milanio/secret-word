import './App.css';
import { useState, useCallback, useEffect } from 'react';
import { wordsList } from './data/words';
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  {
    id: 1, name: 'start',
  },
  {
    id: 2, name: 'game',
  },
  {
    id: 3, name: 'end',
  }
]

function App() {
  const guessesQnt = 3;
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState('');
  const [pickedCategory, setPickedCategory] = useState('');
  const [letters, setLetter] = useState('');
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetter] = useState([]);
  const [guesses, setGuesses] = useState(guessesQnt);
  const [score, setScore] = useState(0)


  const pickWordAndCategory = useCallback(() => {
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];
    const word = words[category][Math.floor(Math.random() * words[category].length)];

    return {word, category};
  }, [words]);
  
  const startGame = useCallback(() => {
    clearLetterStates();
    const { word, category } = pickWordAndCategory();
    let wordLetters = word.split('');
    wordLetters = wordLetters?.map((letter) => letter.toLowerCase());
    setPickedWord(word);
    setPickedCategory(category);
    setLetter(wordLetters);
    setGuesses(guessesQnt);
    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    if (guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return;
    }
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((prev) => [...prev, normalizedLetter])
    } else {
      setWrongLetter((prev) => [...prev, normalizedLetter])
      setGuesses((prev) => prev -1)
    }

  }

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetter([]);
  }

  useEffect(() => {
    if (guesses === 0) {
      clearLetterStates();
      setGameStage(stages[2].name)
    }
  }, [guesses])

  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];
    if (guessedLetters.length > 0 && guessedLetters.length === uniqueLetters.length) {
      setScore((prev) => prev += 100);
      startGame();
    }
  }, [guessedLetters, letters, startGame])

    const retry = () => {
      setScore(0);
      setGuesses(guessesQnt);
    setGameStage(stages[0].name);
  }

  return (
    <div className="App">
      { gameStage === 'start' && <StartScreen startGame={ startGame } /> }
      { gameStage === 'game' && <Game 
      verifyLetter={verifyLetter}
      pickedWord={pickedWord}
      pickedCategory={pickedCategory}
      letters={letters}
      guessedLetters={guessedLetters}
      wrongLetters={wrongLetters}
      guesses={guesses}
      score={score}
        /> }
      { gameStage === 'end' && <GameOver retry={retry} score={score} /> }
    </div>
  );
}

export default App;
