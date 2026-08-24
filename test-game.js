// test-game.js
import { Game } from "./game-engine/Game.js";

const game = new Game();

console.log("=== Deal Initial ===");
game.dealInitial();
console.log(
  "Player cards:",
  game.playerHand.cardsInHand.map((c) => c.toString()),
  "value:",
  game.playerHand.getHandValue(),
);
console.log(
  "Dealer cards:",
  game.dealerHand.cardsInHand.map((c) => c.toString()),
  "value:",
  game.dealerHand.getHandValue(),
);

console.log("\n=== Player hits once ===");
const hitResult = game.hit();
console.log("Hit result:", hitResult);
console.log(
  "Player cards now:",
  game.playerHand.cardsInHand.map((c) => c.toString()),
);

console.log("\n=== Player stands (dealer plays) ===");
const standResult = game.stand();
console.log("Stand result:", standResult);
console.log(
  "Dealer cards now:",
  game.dealerHand.cardsInHand.map((c) => c.toString()),
  "value:",
  game.dealerHand.getHandValue(),
);

console.log("\n=== Determine winner ===");
console.log(game.determineWinner());

// --- Second round, to confirm clearHand() actually resets things ---
console.log("\n\n=== Round 2: dealInitial again ===");
game.dealInitial();
console.log(
  "Player cards (should be fresh, only 2):",
  game.playerHand.cardsInHand.map((c) => c.toString()),
);
console.log(
  "Dealer cards (should be fresh, only 2):",
  game.dealerHand.cardsInHand.map((c) => c.toString()),
);
console.log(game.determineWinner());
