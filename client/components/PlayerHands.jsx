import Card from "./Card";
import { User, Coins, AlertTriangle } from "lucide-react";

function PlayerHands({ playerHands, activeHandIndex }) {
  return (
    <section className="flex flex-col items-center gap-2.5">
      <h2 className="flex items-center gap-1.5 font-body font-medium text-sm text-card-cream/60">
        <User className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
        You
      </h2>
      <div className="flex gap-7 flex-wrap justify-center">
        {playerHands.map((hand, i) => (
          <div
            key={i}
            className={`flex flex-col items-center gap-2 rounded-md px-3.5 py-3 transition-shadow duration-300 ${
              i === activeHandIndex
                ? "shadow-[0_0_0_1px_var(--color-gold),0_0_18px_rgba(199,163,76,0.35)]"
                : ""
            }`}
          >
            <div className="flex gap-2 min-h-[5.6rem]">
              {hand.cards.map((c, j) => (
                <Card key={j} card={c} index={j} />
              ))}
            </div>

            <p className="hand-value">
              {hand.value !== null ? hand.value : "\u00A0"}
            </p>
            {hand.bet != null && (
              <p className="flex items-center gap-1 text-xs text-card-cream/60 font-body">
                <Coins className="w-3 h-3" strokeWidth={2} aria-hidden="true" />
                {hand.bet}
              </p>
            )}
            {hand.isBust && (
              <p className="bust-tag flex items-center gap-1">
                <AlertTriangle
                  className="w-3 h-3"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                Bust
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default PlayerHands;
