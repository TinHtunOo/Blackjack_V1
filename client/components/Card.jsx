const SUIT_SYMBOLS = { spades: "♠", hearts: "♥", diamonds: "♦", clubs: "♣" };
const RED_SUITS = ["hearts", "diamonds"];

function Card({ card, faceDown = false, index = 0, isPlayerHand = true }) {
  const isRed = card && RED_SUITS.includes(card.suit);
  const playerStyle = { animationDelay: `${index < 2 ? index * 500 : 500}ms` };
  const dealerStyle = { animationDelay: `${index * 500}ms` };
  return (
    <div
      className="w-13 h-18 [perspective:800px] animate-deal-in"
      style={isPlayerHand ? playerStyle : dealerStyle}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.4,0.1,0.2,1)] [transform-style:preserve-3d] ${
          faceDown ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        <div className="absolute inset-0 rounded-md [backface-visibility:hidden] bg-card-cream shadow-md flex flex-col items-center justify-center gap-0.5">
          {card && (
            <>
              <span
                className={`font-display font-semibold text-xl leading-none ${
                  isRed ? "text-ink-red" : "text-ink-black"
                }`}
              >
                {card.rank}
              </span>
              <span
                className={`text-lg leading-none ${isRed ? "text-ink-red" : "text-ink-black"}`}
              >
                {SUIT_SYMBOLS[card.suit]}
              </span>
            </>
          )}
        </div>
        <div className="absolute inset-0 rounded-md [backface-visibility:hidden] [transform:rotateY(180deg)] border border-gold bg-[repeating-linear-gradient(135deg,var(--color-felt-light),var(--color-felt-light)_6px,#0a3a2c_6px,#0a3a2c_12px)]" />
      </div>
    </div>
  );
}

export default Card;
