// Card.js
export class Card {
  static RANKS = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];
  static SUITS = ["hearts", "diamonds", "clubs", "spades"];

  constructor(rank, suit) {
    if (!Card.RANKS.includes(rank)) throw new Error(`Invalid rank: ${rank}`);
    if (!Card.SUITS.includes(suit)) throw new Error(`Invalid suit: ${suit}`);
    this.rank = rank;
    this.suit = suit;
  }

  // Blackjack value. Ace returns 11 by default —
  // Hand class will downgrade it to 1 when needed (soft/hard logic).
  get value() {
    if (this.rank === "A") return 11;
    if (["J", "Q", "K"].includes(this.rank)) return 10;
    return Number(this.rank);
  }

  get isAce() {
    return this.rank === "A";
  }

  toString() {
    return `${this.rank}${this.suitSymbol()}`;
  }

  suitSymbol() {
    const symbols = { hearts: "♥", diamonds: "♦", clubs: "♣", spades: "♠" };
    return symbols[this.suit];
  }
}
