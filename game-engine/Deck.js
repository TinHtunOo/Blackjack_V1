import { Card } from "./Card.js";

export class Deck {
  constructor(numDecks = 1) {
    this.numDecks = numDecks;
    this.cards = this.buildShoe();
  }

  buildShoe() {
    const shoe = [];
    for (let i = 0; i < this.numDecks; i++) {
      for (const suit of Card.SUITS) {
        for (const rank of Card.RANKS) {
          shoe.push(new Card(rank, suit));
        }
      }
    }
    return shoe;
  }

  //Fisher-Yates shuffle
  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      let postitionToSwap = Math.floor(Math.random() * (i + 1));
      let cardToHold = this.cards[postitionToSwap];
      this.cards[postitionToSwap] = this.cards[i];
      this.cards[i] = cardToHold;
    }
  }

  draw() {
    if (this.cards.length === 0)
      throw new Error("The desk is empty at this point");
    // const drawedCard = this.cards.shift();
    const drawnCard = this.cards.pop();
    return drawnCard;
  }

  needReshuffle() {
    const reshuffleThreshore = 20; // 20%
    return this.cards.length < (this.numDecks * 52 * reshuffleThreshore) / 100;
  }
}
