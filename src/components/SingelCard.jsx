// SingelCard.js
import React from 'react';

function SingelCard({ card, flipCard }) {
  const isEmptyCard = card.src === ""; // Check if the card is empty (no image)

  return (
    <div
      className={`relative w-32 h-44 cursor-pointer ${
        isEmptyCard ? 'bg-blue-300 border-2 border-white' : ''
      }`}
      onClick={() => !isEmptyCard && flipCard(card.id)} 
    >
      
      {card.isFlipped && !isEmptyCard ? (
        <img src={card.src} alt="card" className="w-full h-full object-cover rounded-lg" />
      ) : (
        <div
className="w-full h-full bg-cover border-2 border-white"
style={{ backgroundImage: `url('/img/cover.png')` }}
/>
      )}
    </div>
  );
}

export default SingelCard;



