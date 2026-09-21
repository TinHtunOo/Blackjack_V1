import { useEffect, useState } from "react";
import { Info, X } from "lucide-react";

const RULES = [
  {
    title: "Objective",
    text: "Get a hand value closer to 21 than the dealer, without going over.",
  },
  {
    title: "Card values",
    text: "Number cards count as their face value. J, Q, K count as 10. An Ace counts as 11, or 1 if 11 would bust the hand.",
  },
  {
    title: "Your turn",
    text: "Hit to take another card. Stand to keep your current hand and end your turn. Double Down doubles your bet, deals exactly one more card, and ends your turn — only available on your first two cards. Split separates two matching-value cards into two independent hands, each with its own bet, and adds a second card to the first hand — only available on your first two cards.",
  },
  {
    title: "Dealer's turn",
    text: "Once you've finished, the dealer reveals their hidden card and must hit until reaching 17 or more.",
  },
  {
    title: "Payouts",
    text: "A normal win pays 1:1. A natural blackjack (an Ace + a 10-value card on your first two cards) pays 2:1. A push (tie) returns your bet. A loss forfeits your bet.",
  },
];

function RulesModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="How to play"
        className="flex items-center justify-center w-9 h-9 rounded-full border border-gold/60 text-card-cream cursor-pointer transition-colors duration-200 hover:bg-gold hover:text-felt-deep"
      >
        <Info className="w-4.5 h-4.5" strokeWidth={2} aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-[2px]"
          onClick={() => setIsOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="rules-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-md max-h-[85vh] sm:max-h-[80vh] overflow-y-auto bg-felt-light border border-gold/40 rounded-t-2xl sm:rounded-2xl px-5 pt-5 pb-8 sm:p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                id="rules-title"
                className="font-display text-xl text-card-cream"
              >
                How to Play
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close"
                className="flex items-center justify-center w-8 h-8 rounded-full text-card-cream/70 cursor-pointer hover:text-card-cream hover:bg-card-cream/10 transition-colors duration-200"
              >
                <X className="w-4.5 h-4.5" strokeWidth={2} aria-hidden="true" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {RULES.map((section) => (
                <div key={section.title}>
                  <h3 className="font-body font-semibold text-sm text-gold mb-1">
                    {section.title}
                  </h3>
                  <p className="font-body text-sm text-card-cream/85 leading-relaxed">
                    {section.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default RulesModal;
