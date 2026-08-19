export class Hand {
  constructor() {
    this.cardsInHand = [];
  }

  addCard(card) {
    this.cardsInHand.push(card);
  }

  clearHand() {
    this.cardsInHand = [];
  }

  getHandValue() {
    let total = 0;
    let aceCount = 0;

    for (const card of this.cardsInHand) {
      total += card.value;
      if (card.isAce) aceCount++;
    }

    while (total > 21 && aceCount > 0) {
      total -= 10;
      aceCount--;
    }

    console.log("total", total);
    console.log("aceCount", aceCount);

    return total;
  }

  isBust() {
    return this.getHandValue() > 21;
  }

  isBlackjack() {
    return this.cardsInHand.length === 2 && this.getHandValue() === 21;
  }
}
