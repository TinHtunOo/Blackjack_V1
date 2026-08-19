// test-hand.js
import { Hand } from "./game-engine/Hand.js";
import { Card } from "./game-engine/Card.js";

// 1. Simple hand, no Aces
// const hand1 = new Hand();
// hand1.addCard(new Card("10", "spades"));
// hand1.addCard(new Card("9", "hearts"));
// console.log("Hand [10, 9] value (expect 19):", hand1.getHandValue());
// console.log("isBust (expect false):", hand1.isBust());
// console.log("isBlackjack (expect false):", hand1.isBlackjack());

// // 2. Natural blackjack
// const hand2 = new Hand();
// hand2.addCard(new Card("A", "spades"));
// hand2.addCard(new Card("K", "hearts"));
// console.log("\nHand [A, K] value (expect 21):", hand2.getHandValue());
// console.log("isBlackjack (expect true):", hand2.isBlackjack());

// // 3. One Ace downgrade: [A, 9, 5]
// const hand3 = new Hand();
// hand3.addCard(new Card("A", "spades"));
// hand3.addCard(new Card("9", "hearts"));
// hand3.addCard(new Card("5", "clubs"));
// console.log("\nHand [A, 9, 5] value (expect 15):", hand3.getHandValue());
// console.log("isBust (expect false):", hand3.isBust());
// console.log("isBlackjack (expect false, it's 3 cards):", hand3.isBlackjack());

// // 4. Two Aces: [A, A, 9]
// const hand4 = new Hand();
// hand4.addCard(new Card("A", "spades"));
// hand4.addCard(new Card("A", "hearts"));
// hand4.addCard(new Card("9", "clubs"));
// console.log("\nHand [A, A, 9] value (expect 21):", hand4.getHandValue());
// console.log("isBust (expect false):", hand4.isBust());
// console.log("isBlackjack (expect false, it's 3 cards):", hand4.isBlackjack());

// // 5. Genuine bust, no Aces: [10, 9, 5]
// const hand5 = new Hand();
// hand5.addCard(new Card("10", "spades"));
// hand5.addCard(new Card("9", "hearts"));
// hand5.addCard(new Card("5", "clubs"));
// console.log("\nHand [10, 9, 5] value (expect 24):", hand5.getHandValue());
// console.log("isBust (expect true):", hand5.isBust());

// 6. Three Aces: [A, A, A]
const hand6 = new Hand();
hand6.addCard(new Card("A", "spades"));
hand6.addCard(new Card("A", "hearts"));
hand6.addCard(new Card("A", "clubs"));
console.log("\nHand [A, A, A] value (expect 13):", hand6.getHandValue());
console.log("isBust (expect false):", hand6.isBust());
