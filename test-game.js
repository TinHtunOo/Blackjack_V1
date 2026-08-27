// test-game-2.js
import { Game } from "./game-engine/Game.js";

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

const game = new Game();

console.log("=== Round 1: Deal Initial ===");
game.dealInitial();
printState(game, "After dealInitial");

console.log("\n=== Player hits once ===");
const hitResult = game.hit();
console.log("Hit result:", hitResult);
printState(game, "After hit");

// Only attempt doubleDown if hand still has room to matter (won't be legal after a hit, expect failure)
console.log(
  "\n=== Player tries doubleDown after already hitting (should fail) ===",
);
console.log(game.doubleDown());

console.log(
  "\n=== Player stands (only 1 hand, so dealer should play immediately) ===",
);
const standResult = game.stand();
console.log("Stand result:", standResult);
printState(game, "After stand");

console.log("\n=== Determine winner ===");
console.log(game.determineWinner());

// --- Round 2: test doubleDown on a fresh 2-card hand ---
console.log("\n\n=== Round 2: Deal Initial ===");
game.dealInitial();
printState(game, "After dealInitial (round 2)");

console.log("\n=== Player doubles down (should succeed, exactly 2 cards) ===");
const ddResult = game.doubleDown();
console.log("DoubleDown result:", ddResult);
printState(game, "After doubleDown");

console.log("\n=== Player stands after double down ===");
console.log(game.stand());
printState(game, "After stand (round 2)");

console.log("\n=== Determine winner (round 2) ===");
console.log(game.determineWinner());

// --- Round 3: sanity check that state resets correctly ---
console.log("\n\n=== Round 3: Deal Initial (confirm reset) ===");
game.dealInitial();
console.log("playerHands.length (should be 1):", game.playerHands.length);
console.log("activeHandIndex (should be 0):", game.activeHandIndex);
printState(game, "After dealInitial (round 3)");
