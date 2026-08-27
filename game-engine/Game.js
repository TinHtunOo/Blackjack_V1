import { Deck } from "./Deck.js";
import { Hand } from "./Hand.js";

export class Game {
  constructor() {
    // this.playerHand = new Hand();
    this.playerHands = [new Hand()];
    this.activeHandIndex = 0;
    this.dealerHand = new Hand();
    this.deck = new Deck(8);
    this.deck.shuffle();
  }

  get activeHand() {
    return this.playerHands[this.activeHandIndex];
  }

  dealInitial() {
    // this.playerHands[this.activeHandIndex].clearHand();
    this.activeHandIndex = 0;

    this.playerHands = [new Hand()];
    this.dealerHand.clearHand();

    if (this.deck.needReshuffle()) {
      this.deck = new Deck(8);
      this.deck.shuffle();
      console.log("Deck is reshuffle.");
    }

    for (let i = 2; i > 0; i--) {
      this.playerHands[this.activeHandIndex].addCard(this.deck.draw());
      this.dealerHand.addCard(this.deck.draw());
    }

    if (this.playerHands[this.activeHandIndex].isBlackjack()) {
      console.log("Blackjack.");
      //check dealer hand, if dealer reval card is not ace or 10,J,Q,K then determineWinner() or you win
    }
  }

  hit() {
    const activeHand = this.playerHands[this.activeHandIndex];

    activeHand.addCard(this.deck.draw());
    const handValue = activeHand.getHandValue();

    if (activeHand.isBust()) {
      console.log("the hand is busted.");
      return { isBust: true, handValue };
      //go to determineWinner() or you lose
    }

    return { isBust: false, handValue };
  }

  dealerPlay() {
    while (this.dealerHand.getHandValue() < 17) {
      this.dealerHand.addCard(this.deck.draw());
    }
    const handValue = this.dealerHand.getHandValue();

    if (this.dealerHand.isBust()) {
      console.log("the hand is busted.");
      return { isBust: true, handValue };
    }

    return { isBust: false, handValue };
  }

  stand() {
    const isLastHand = this.activeHandIndex === this.playerHands.length - 1;

    if (isLastHand) {
      let playerHandsValue = [];
      for (let i = 0; i < this.playerHands.length; i++) {
        playerHandsValue.push(this.playerHands[i].getHandValue());
      }
      this.dealerPlay();
      return {
        playerHandsValue,
        dealerHandValue: this.dealerHand.getHandValue(),
      };
    } else {
      this.activeHandIndex++;
      this.playerHands[this.activeHandIndex].addCard(this.deck.draw());
      return {
        message: "Move to next hand",
      };
    }
  }

  determineWinner() {
    const results = [];

    for (let i = 0; i < this.playerHands.length; i++) {
      const activeHand = this.playerHands[i];

      const playerBlackjack = activeHand.isBlackjack();
      const dealerBlackjack = this.dealerHand.isBlackjack();

      if (activeHand.isBust()) {
        results.push({ result: "dealer" });
        continue;
      }

      if (this.dealerHand.isBust()) {
        results.push({ result: "player" });
        continue;
      }

      if (playerBlackjack || dealerBlackjack) {
        if (playerBlackjack && dealerBlackjack) {
          results.push({ result: "tie" });
        } else {
          results.push({
            result: playerBlackjack ? "player" : "dealer",
          });
        }

        continue;
      }

      const playerValue = activeHand.getHandValue();
      const dealerValue = this.dealerHand.getHandValue();

      if (playerValue === dealerValue) {
        results.push({ result: "tie" });
        continue;
      }

      results.push({
        result: playerValue > dealerValue ? "player" : "dealer",
      });
    }

    return results;
  }

  doubleDown() {
    const activeHand = this.playerHands[this.activeHandIndex];

    if (activeHand.cardsInHand.length === 2) {
      activeHand.addCard(this.deck.draw());
      const handValue = activeHand.getHandValue();

      if (activeHand.isBust()) {
        console.log("The hand is busted.");
        return { success: true, isBust: true, handValue };
      }

      return { success: true, isBust: false, handValue };
    } else {
      return {
        success: false,
        message: "The player cannot double down at this point.",
      };
    }
  }

  split() {
    const activeHand = this.playerHands[this.activeHandIndex];
    const cardsInHand = activeHand.cardsInHand;
    if (
      cardsInHand.length === 2 &&
      cardsInHand[0].value === cardsInHand[1].value
    ) {
      const splitCard = cardsInHand.pop();
      const newHand = new Hand();
      newHand.addCard(splitCard);
      activeHand.addCard(this.deck.draw());
      this.playerHands.push(newHand);
      return { success: true, activeHandValue: activeHand.getHandValue() };
    } else {
      return { success: false, message: "The player cannot split them." };
    }
  }
}
