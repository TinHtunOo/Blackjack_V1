import { Game } from "../game-engine/Game.js";

const games = new Map();

function getGame(req) {
  const sessionId = req.sessionId;
  if (!games.has(sessionId)) {
    games.set(sessionId, new Game());
  }
  return games.get(sessionId);
}

export const restartChips = (req, res) => {
  const game = getGame(req);
  game.resetChips();
  res.status(200).json({ status: "success", chips: game.chips });
};

export const deal = (req, res) => {
  const game = getGame(req);
  const { betAmount } = req.body;
  const result = game.dealInitial(betAmount);

  if (!result.success) {
    return res.status(400).json({ message: result.message });
  }

  const dealerHand = game.dealerHand;
  const dealerRevealCard = dealerHand.cardsInHand[0];
  const playerCards = game.activeHand.getCardsPlain();
  const playerHandValue = game.activeHand.getHandValue();
  const dealerCards = [
    {
      card: { rank: dealerRevealCard.rank, suit: dealerRevealCard.suit },
      hidden: false,
    },
    { card: null, hidden: true },
  ];

  res.status(200).json({
    status: "success",
    playerCards,
    playerHandValue,
    isPlayerBlackjack: result.isPlayerBlackjack,
    dealerCards,
    chips: game.chips,
    bet: game.playerBets[0],
  });
};

export const hit = (req, res) => {
  const game = getGame(req);
  const result = game.hit();
  const playerCards = game.activeHand.getCardsPlain();
  const { isBust, handValue } = result;
  res.status(200).json({
    status: "success",
    playerCards,
    isBust,
    handValue,
  });
};

export const stand = (req, res) => {
  const game = getGame(req);
  const result = game.stand();
  if (result.message) {
    return res.status(200).json({
      status: "success",
      message: result.message,
      nextPlayerCards: game.activeHand.getCardsPlain(),
      playerHandValue: game.activeHand.getHandValue(),
    });
  }
  const { playerHandsValue, dealerHandValue } = result;
  res.status(200).json({
    status: "success",
    playerHandsValue,
    dealerHandValue,
    dealerCards: game.dealerHand.getCardsPlain(),
  });
};

export const doubleDown = (req, res) => {
  const game = getGame(req);
  const result = game.doubleDown();
  if (!result.success) {
    return res.status(400).json({ message: result.message });
  }
  const playerCards = game.activeHand.getCardsPlain();
  const { isBust, handValue } = result;
  res.status(200).json({
    status: "success",
    playerCards,
    isBust,
    handValue,
    chips: game.chips,
    bet: game.playerBets[game.activeHandIndex],
  });
};

export const split = (req, res) => {
  const game = getGame(req);
  const result = game.split();
  if (!result.success) {
    return res.status(400).json({ message: result.message });
  }
  const playerCards = game.activeHand.getCardsPlain();
  const nextHandCards =
    game.playerHands[game.playerHands.length - 1].getCardsPlain();
  res.status(200).json({
    status: "success",
    playerCards,
    handValue: result.activeHandValue,
    nextHandCards,
    chips: game.chips,
    bet: game.playerBets[game.activeHandIndex],
  });
};

export const result = (req, res) => {
  const game = getGame(req);
  const outcome = game.determineWinner(); // now [{result, bet, payout}, ...]
  const playerHandsValue = game.playerHands.map((hand) => hand.getHandValue());
  const dealerHandValue = game.dealerHand.getHandValue();
  const dealerCards = game.dealerHand.cardsInHand.map((c) => ({
    card: { rank: c.rank, suit: c.suit },
    hidden: false,
  }));

  res.status(200).json({
    status: "success",
    result: outcome,
    playerHandsValue,
    dealerHandValue,
    dealerCards,
    chips: game.chips,
  });
};

export const getChips = (req, res) => {
  const game = getGame(req);
  res.status(200).json({
    status: "success",
    chips: game.chips,
  });
};
