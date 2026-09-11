import Card from "./Card";
import { Crown } from "lucide-react";
import DealerMessageBubble from "./DealerMessageBubble";

function DealerHand({
  dealerCards,
  dealerHandValue,
  dealerMessage,
  dealerMessageKey,
}) {
  return (
    <section className="flex flex-col items-center gap-2.5">
      <h2 className="flex items-center gap-1.5 font-body font-medium text-sm text-card-cream/60">
        <Crown className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
        Dealer
      </h2>
      <div>
        <DealerMessageBubble
          message={dealerMessage}
          triggerKey={dealerMessageKey}
        />
      </div>
      <div className="flex gap-2 min-h-[5.6rem]">
        {dealerCards.map((entry, i) => (
          <Card key={i} card={entry.card} faceDown={entry.hidden} index={i} />
        ))}
      </div>
      <p className="font-display text-2xl min-h-[1.6rem]">
        {dealerHandValue !== null ? dealerHandValue : "\u00A0"}
      </p>
    </section>
  );
}

export default DealerHand;
