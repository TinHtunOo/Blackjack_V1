import { Deck } from "./Deck.js";
import { Hand } from "./Hand.js";

export class Game {
  constructor() {
    this.playerHand = new Hand();
    this.dealerHand = new Hand();
    this.deck = new Deck(8);
    this.deck.shuffle();
  }

  dealInitial() {
    this.playerHand.clearHand();
    this.dealerHand.clearHand();

    if (this.deck.needReshuffle()) {
      this.deck = new Deck(8);
      this.deck.shuffle();
      console.log("Deck is reshuffle.");
    }

    for (let i = 2; i > 0; i--) {
      this.playerHand.addCard(this.deck.draw());
      this.dealerHand.addCard(this.deck.draw());
    }
  }
}
