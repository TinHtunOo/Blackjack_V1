// test-deck.js

import { Deck } from "./game-engine/Deck.js";
import { Card } from "./game-engine/Card.js";

// adjust the import paths above to match wherever your files actually live

// 1. Build an unshuffled deck and confirm order + count
const deck = new Deck(1);
console.log("Total cards after buildShoe():", deck.cards.length); // expect 52
console.log(
  "First 3 cards (should be in order):",
  deck.cards.slice(0, 3).map((c) => c.toString()),
);
console.log(
  "Last 3 cards (should be in order):",
  deck.cards.slice(-3).map((c) => c.toString()),
);

// 2. Shuffle and confirm order changed but count didn't
deck.shuffle();
console.log(
  "\nAfter shuffle, total cards (should still be 52):",
  deck.cards.length,
);
console.log(
  "First 3 cards now (should look random):",
  deck.cards.slice(0, 3).map((c) => c.toString()),
);
console.log(
  "Last 3 cards now (should look random):",
  deck.cards.slice(-3).map((c) => c.toString()),
);

// 3. Draw a few cards and confirm deck shrinks
const drawn1 = deck.draw();
const drawn2 = deck.draw();
console.log("\nDrew:", drawn1.toString(), drawn2.toString());
console.log("Remaining cards (should be 50):", deck.cards.length);

// 4. Draw a card and check its value/isAce getters actually work
console.log("\nDrawn card value:", drawn1.value, "| isAce:", drawn1.isAce);

// 5. Test needReshuffle() — draw a bunch to push below threshold
while (deck.cards.length > 9) {
  deck.draw();
}
console.log("\nCards left:", deck.cards.length);
console.log(
  "needReshuffle() result (should be true, since 20% of 52 ≈ 10.4):",
  deck.needReshuffle(),
);

// 6. Confirm draw() throws when empty
const emptyDeck = new Deck(1);
for (let i = 0; i < 52; i++) emptyDeck.draw();
try {
  emptyDeck.draw();
} catch (err) {
  console.log("\nExpected error caught:", err.message);
}
