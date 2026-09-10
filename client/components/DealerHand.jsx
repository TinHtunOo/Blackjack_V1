import Card from "./Card";

function DealerHand({ dealerCards, dealerHandValue }) {
  return (
    <section className="flex flex-col items-center gap-2.5">
      <h2 className="font-body font-medium text-sm text-card-cream/60">
        Dealer
      </h2>
      <div className="flex gap-2 min-h-[5.6rem]">
        {dealerCards.map((entry, i) => (
          <Card
            key={i}
            card={entry.card}
            faceDown={entry.hidden}
            index={i}
            // isPlayerHand={false}
          />
        ))}
      </div>
      <p className="font-display text-2xl min-h-[1.6rem]">
        {dealerHandValue !== null ? dealerHandValue : "\u00A0"}
      </p>
    </section>
  );
}

export default DealerHand;
