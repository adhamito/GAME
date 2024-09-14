import React from 'react';

function SingelCard({ card, flipCard }) {
  const isEmptyCard = card.src === ""; // Check if the card is empty (no image)

  return (
    <div
      className={`relative cursor-pointer transition-transform duration-300 transform hover:scale-105
      ${isEmptyCard ? 'bg-blue-300 border-2 border-white' : ''} 
      w-20 h-28 sm:w-24 sm:h-32 md:w-32 md:h-36 lg:w-36 lg:h-56 xl:w-36 xl:h-36`} 
      onClick={() => !isEmptyCard && flipCard(card.id)} 
    >
      {card.isFlipped && !isEmptyCard ? (
        <img src={card.src} alt="card" className="w-full h-full object-cover rounded-lg" />
      ) : (
        <div
          className="w-full h-full bg-cover border-2 border-white rounded-lg"
          style={{ backgroundImage: `url('/img/cover.png')` }}
        />
      )}
    </div>
  );
}

export default SingelCard;
