import Card from "./Card";

function PlayerHands({ playerHands, activeHandIndex }) {
  return (
    <section className="flex flex-col items-center gap-2.5">
      <h2 className="font-body font-medium text-sm text-card-cream/60">You</h2>
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
            <p className="font-display text-2xl min-h-[1.6rem]">
              {hand.value !== null ? hand.value : "\u00A0"}
            </p>
            {hand.isBust && (
              <p className="text-xs text-ink-red bg-card-cream px-2 py-0.5 rounded-sm">
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
