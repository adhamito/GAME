import React, { useState, useEffect, useRef } from 'react';
import SingelCard from './components/SingelCard';

const images = [
  { src: "/img/goalkeeper-glove-soccer-sport-free-vector.jpg" },
  { src: "/img/owngoal.png" },
  { src: "/img/red.png" },
  { src: "/img/yellow.png" },
  { src: "/img/sports-soccer.png" },
  { src: "/img/soccer.png" },
  { src: "/img/takling.jpg" }
];

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function App() {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [showWinMessage, setShowWinMessage] = useState(false);
  const [stage, setStage] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(30);
  const [showTimer, setShowTimer] = useState(false);
  const winSound = new Audio('/audio/win.mp3');
  const winMusic = useRef(new Audio('/audio/GTA-San-Andreas-Mission-Passed.mp3'));
  const intervalRef = useRef(null);

  const cardCounts = [12, 16, 20, 24, 28, 32, 36, 40];

  const shuffle = () => {
    const numCards = cardCounts[stage];
    const totalUniqueImages = images.length;

    const winningImage = images[getRandomInt(0, totalUniqueImages - 1)].src;

    const cardSet = [
      { src: winningImage }, { src: winningImage }, { src: winningImage },
      ...images
        .filter(img => img.src !== winningImage)
        .slice(0, Math.min(numCards - 3, totalUniqueImages - 1))
        .map(img => ({ src: img.src })),
    ];

    const additionalCards = [
      ...cardSet,
      ...Array(numCards - cardSet.length).fill({ src: "" })
    ].sort(() => Math.random() - 0.5)
      .slice(0, numCards)
      .map((card, index) => ({ ...card, id: index, isFlipped: true }));

    setCards(additionalCards);
    setFlippedIndices([]);
    setShowWinMessage(false);
    setGameOver(false);
    winMusic.current.pause();
    winMusic.current.currentTime = 0;

    setTimeout(() => {
      setCards(prevCards => prevCards.map(card => ({ ...card, isFlipped: false })));
      resetAndStartTimer();
    }, 1000);
  };

  const flipCard = (id) => {
    if (flippedIndices.length === 3 || cards.find(card => card.id === id).isFlipped) return;

    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, isFlipped: true } : card
      )
    );
    setFlippedIndices((prev) => [...prev, id]);
  };

  useEffect(() => {
    if (flippedIndices.length === 3) {
      const [firstIndex, secondIndex, thirdIndex] = flippedIndices;
      const firstCard = cards.find((card) => card.id === firstIndex);
      const secondCard = cards.find((card) => card.id === secondIndex);
      const thirdCard = cards.find((card) => card.id === thirdIndex);

      setTimeout(() => {
        if (firstCard.src === secondCard.src && firstCard.src === thirdCard.src) {
          winSound.play();
          winMusic.current.play();
          setShowWinMessage(true);
          setGameOver(true);
          clearInterval(intervalRef.current);

          setTimeout(() => {
            if (stage < cardCounts.length - 1) {
              setStage(prevStage => prevStage + 1);
              shuffle();
            } else {
              alert("Congratulations! You've completed all stages!");
            }
          }, 7000);
        } else {
          setTimeout(() => {
            setCards((prevCards) =>
              prevCards.map((card) =>
                card.id === firstIndex || card.id === secondIndex || card.id === thirdIndex
                  ? { ...card, isFlipped: false }
                  : card
              )
            );
          }, 1000);
        }
        setFlippedIndices([]);
      }, 1000);
    }
  }, [flippedIndices, cards, stage]);

  const resetAndStartTimer = () => {
    clearInterval(intervalRef.current);
    setTimer(30);
    setShowTimer(true);
    intervalRef.current = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer === 1) {
          clearInterval(intervalRef.current);
          setGameOver(true);
          setStage(0);
          setCards([]);
          setTimer(null);
          setShowTimer(false);
          winMusic.current.play();
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (timer === null) return;
    if (timer <= 0) {
      clearInterval(intervalRef.current);
      setGameOver(true);
      setShowTimer(false);
      winMusic.current.play();
    }
  }, [timer]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-100 flex flex-col items-center justify-center py-10">
      <h1 className="text-4xl font-bold text-white mb-8">Magic Match</h1>
      <button
        onClick={() => {
          shuffle();
          setShowTimer(true);
        }}
        className={`border-2 border-pink-900 px-4 py-2 bg-pink-600 text-white rounded shadow-md hover:bg-pink-700 transition duration-300 ${gameOver ? 'hidden' : ''}`}>
        New Game
      </button>

      {showTimer && (
        <div className={`text-white text-3xl mb-4 ${timer <= 4 ? 'text-red-500' : timer <= 19 ? 'text-orange-500' : 'text-green-500'}`}>
          {timer}
        </div>
      )}

      <div className={`grid gap-4 mt-8 ${cards.length === 12 ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : cards.length === 16 ? 'grid-cols-2 sm:grid-cols-4' : cards.length === 20 ? 'grid-cols-2 sm:grid-cols-5' : cards.length === 24 ? 'grid-cols-2 sm:grid-cols-6' : cards.length === 28 ? 'grid-cols-2 sm:grid-cols-7' : cards.length === 32 ? 'grid-cols-2 sm:grid-cols-8' : cards.length === 36 ? 'grid-cols-2 sm:grid-cols-9' : cards.length === 40 ? 'grid-cols-2 sm:grid-cols-10' : ''}`}>
        {cards.map((card) => (
          <SingelCard
            card={card}
            flipCard={flipCard}
            key={card.id}
          />
        ))}
      </div>

      {showWinMessage && (
        <div className="w-96 h-64 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 bg-white rounded shadow-lg flex flex-col items-center">
          <img src="/img/congratulations.png" alt="Congratulations" className="w-64 h-32 mb-4" />
          <h2 className="text-2xl font-bold text-green-600">You Win!</h2>
          <audio src="/Audio/audio.mp3" autoPlay />
        </div>
      )}

      {gameOver && !showWinMessage && (
        <div className="w-96 h-64 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 bg-white rounded shadow-lg flex flex-col items-center">
          <h2 className="text-2xl font-bold text-red-600">Loser Yahooooooo!</h2>
          <audio src="/Audio/loser.mp3" autoPlay />
          <button
            onClick={() => {
              shuffle();
              setShowTimer(true);
            }}
            className="border-2 border-pink-900 px-4 py-2 bg-pink-600 text-white rounded shadow-md hover:bg-pink-700 transition duration-300 mt-4">
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
