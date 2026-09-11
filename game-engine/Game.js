import { Deck } from "./Deck.js";
import { Hand } from "./Hand.js";

export class Game {
  constructor() {
    this.playerHands = [new Hand()];
    this.playerBets = [0];
    this.activeHandIndex = 0;
    this.dealerHand = new Hand();
    this.deck = new Deck(8);
    this.deck.shuffle();
    this.chips = 1000; // starting balance
  }

  get activeHand() {
    return this.playerHands[this.activeHandIndex];
  }

  dealInitial(betAmount) {
    if (typeof betAmount !== "number" || betAmount <= 0) {
      return { success: false, message: "Invalid bet amount." };
    }
    if (betAmount > this.chips) {
      return { success: false, message: "Not enough chips." };
    }

    this.chips -= betAmount;
    this.playerBets = [betAmount];
    this.activeHandIndex = 0;
    this.playerHands = [new Hand()];
    this.dealerHand.clearHand();

    if (this.deck.needReshuffle()) {
      this.deck = new Deck(8);
      this.deck.shuffle();
    }

    for (let i = 2; i > 0; i--) {
      this.playerHands[this.activeHandIndex].addCard(this.deck.draw());
      this.dealerHand.addCard(this.deck.draw());
    }

    return {
      success: true,
      isPlayerBlackjack: this.playerHands[0].isBlackjack(),
    };
  }

  hit() {
    const activeHand = this.activeHand;
    activeHand.addCard(this.deck.draw());
    const handValue = activeHand.getHandValue();

    if (activeHand.isBust()) {
      return { isBust: true, handValue };
    }
    return { isBust: false, handValue };
  }

  doubleDown() {
    const activeHand = this.activeHand;
    const currentBet = this.playerBets[this.activeHandIndex];

    if (activeHand.cardsInHand.length !== 2) {
      return {
        success: false,
        message: "The player cannot double down at this point.",
      };
    }
    if (currentBet > this.chips) {
      return { success: false, message: "Not enough chips to double down." };
    }

    this.chips -= currentBet;
    this.playerBets[this.activeHandIndex] = currentBet * 2;

    activeHand.addCard(this.deck.draw());
    const handValue = activeHand.getHandValue();

    if (activeHand.isBust()) {
      return { success: true, isBust: true, handValue };
    }
    return { success: true, isBust: false, handValue };
  }

  split() {
    const activeHand = this.activeHand;
    const cardsInHand = activeHand.cardsInHand;
    const currentBet = this.playerBets[this.activeHandIndex];

    if (
      cardsInHand.length !== 2 ||
      cardsInHand[0].value !== cardsInHand[1].value
    ) {
      return { success: false, message: "The player cannot split them." };
    }
    if (currentBet > this.chips) {
      return { success: false, message: "Not enough chips to split." };
    }

    this.chips -= currentBet;

    const splitCard = cardsInHand.pop();
    const newHand = new Hand();
    newHand.addCard(splitCard);
    activeHand.addCard(this.deck.draw());

    this.playerHands.push(newHand);
    this.playerBets.push(currentBet);

    return { success: true, activeHandValue: activeHand.getHandValue() };
  }

  stand() {
    const isLastHand = this.activeHandIndex === this.playerHands.length - 1;

    if (isLastHand) {
      let playerHandsValue = [];
      for (let i = 0; i < this.playerHands.length; i++) {
        playerHandsValue.push(this.playerHands[i].getHandValue());
      }

      const isPlayerBlackjack =
        this.playerHands.length === 1 && this.activeHand.isBlackjack();

      if (
        !this.playerHands.every((hand) => hand.isBust()) &&
        !isPlayerBlackjack
      ) {
        this.dealerPlay();
      }

      return {
        playerHandsValue,
        dealerHandValue: this.dealerHand.getHandValue(),
      };
    } else {
      this.activeHandIndex++;
      this.playerHands[this.activeHandIndex].addCard(this.deck.draw());
      return { message: "Move to next hand" };
    }
  }

  dealerPlay() {
    while (this.dealerHand.getHandValue() < 17) {
      this.dealerHand.addCard(this.deck.draw());
    }
    const handValue = this.dealerHand.getHandValue();

    if (this.dealerHand.isBust()) {
      return { isBust: true, handValue };
    }
    return { isBust: false, handValue };
  }

  determineWinner() {
    const isOriginalHand = this.playerHands.length === 1;
    const results = [];

    for (let i = 0; i < this.playerHands.length; i++) {
      const activeHand = this.playerHands[i];
      const bet = this.playerBets[i];
      const playerBlackjack = isOriginalHand && activeHand.isBlackjack();
      const dealerBlackjack = this.dealerHand.isBlackjack();

      let outcome;
      if (activeHand.isBust()) {
        outcome = "dealer";
      } else if (this.dealerHand.isBust()) {
        outcome = "player";
      } else if (playerBlackjack || dealerBlackjack) {
        outcome =
          playerBlackjack && dealerBlackjack
            ? "tie"
            : playerBlackjack
              ? "player"
              : "dealer";
      } else {
        const playerValue = activeHand.getHandValue();
        const dealerValue = this.dealerHand.getHandValue();
        outcome =
          playerValue === dealerValue
            ? "tie"
            : playerValue > dealerValue
              ? "player"
              : "dealer";
      }

      let payout = 0;
      if (outcome === "player") {
        payout = playerBlackjack ? bet * 3 : bet * 2;
      } else if (outcome === "tie") {
        payout = bet;
      }
      // outcome === "dealer" → payout stays 0, bet already deducted

      this.chips += payout;
      results.push({ result: outcome, bet, payout });
    }

    return results;
  }

  resetChips(amount = 1000) {
    this.chips = amount;
  }
}
