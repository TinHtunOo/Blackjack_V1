// test-split.js
import { Game } from "./game-engine/Game.js";
import { Card } from "./game-engine/Card.js";

function printState(game, label) {
  console.log(`\n--- ${label} ---`);
  game.playerHands.forEach((hand, i) => {
    console.log(
      `Player hand ${i}${i === game.activeHandIndex ? " (active)" : ""}:`,
      hand.cardsInHand.map((c) => c.toString()),
      "value:",
      hand.getHandValue(),
    );
  });
  console.log(
    "Dealer hand:",
    game.dealerHand.cardsInHand.map((c) => c.toString()),
    "value:",
    game.dealerHand.getHandValue(),
  );
}

// --- Test 1: natural split scenario, dealt randomly, may or may not be eligible ---
console.log("=== Attempt 1: deal until we get a pair (random) ===");
const game = new Game();
let dealt = false;
for (let attempts = 0; attempts < 200 && !dealt; attempts++) {
  game.dealInitial();
  const hand = game.playerHands[0];
  if (hand.cardsInHand[0].value === hand.cardsInHand[1].value) {
    dealt = true;
  }
}
printState(game, "Dealt hand eligible for split");

console.log("\n=== Split ===");
const splitResult = game.split();
console.log("Split result:", splitResult);
printState(game, "After split");

console.log(
  "\n=== Player stands on hand 0 (should auto-draw 2nd card for hand 1) ===",
);
console.log(game.stand());
printState(game, "After standing on hand 0");

console.log(
  "\n=== Player stands on hand 1 (last hand, dealer should play) ===",
);
console.log(game.stand());
printState(game, "After standing on hand 1 (dealer played)");

console.log("\n=== Determine winner (should be array of 2 results) ===");
console.log(game.determineWinner());

// --- Test 2: forced scenario, manually constructed cards, to test split() eligibility rejection ---
console.log("\n\n=== Attempt 2: forced NON-pair hand, split should fail ===");
const game2 = new Game();
game2.dealInitial();
// Force a non-matching hand manually regardless of what was dealt
game2.playerHands[0].clearHand();
game2.playerHands[0].addCard(new Card("K", "spades"));
game2.playerHands[0].addCard(new Card("7", "hearts"));
printState(game2, "Forced non-pair hand");
console.log("Split attempt (should fail):", game2.split());

// --- Test 3: forced 3-card hand, split should fail (not exactly 2 cards) ---
console.log("\n\n=== Attempt 3: forced 3-card hand, split should fail ===");
const game3 = new Game();
game3.dealInitial();
game3.playerHands[0].clearHand();
game3.playerHands[0].addCard(new Card("8", "spades"));
game3.playerHands[0].addCard(new Card("8", "hearts"));
game3.playerHands[0].addCard(new Card("2", "clubs"));
printState(game3, "Forced 3-card hand");
console.log("Split attempt (should fail, not 2 cards):", game3.split());
