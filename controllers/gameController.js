import { Game } from "../game-engine/Game.js";

const game = new Game();

export const deal = (req, res) => {
  game.dealInitial();
  const dealerHand = game.dealerHand;
  const dealerRevealCard = dealerHand.cardsInHand[0];
  const playerCards = game.activeHand.getCardsPlain();
  const dealerCards = [
    {
      card: {
        rank: dealerRevealCard.rank,
        suit: dealerRevealCard.suit,
      },
      hidden: false,
    },
    {
      card: null,
      hidden: true,
    },
  ];
  res.status(200).json({
    status: "success",
    playerCards,
    dealerCards,
  });
};

export const hit = (req, res) => {
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
  const result = game.stand();
  if (result.message) {
    return res.status(200).json({
      status: "success",
      message: result.message,
      nextPlayerCards: game.activeHand.getCardsPlain(),
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
  const result = game.doubleDown();
  if (!result.success) {
    return res.status(400).json({
      message: result.message,
    });
  }
  const playerCards = game.activeHand.getCardsPlain();
  const { isBust, handValue } = result;
  res.status(200).json({
    status: "success",
    playerCards,
    isBust,
    handValue,
  });
};

export const split = (req, res) => {
  const result = game.split();
  if (!result.success) {
    return res.status(400).json({
      message: result.message,
    });
  }
  const playerCards = game.activeHand.getCardsPlain();
  res.status(200).json({
    status: "success",
    playerCards,
    handValue: result.activeHandValue,
  });
};

export const result = (req, res) => {
  const outcome = game.determineWinner();
  const playerHandsValue = game.playerHands.map((hand) => hand.getHandValue());
  const dealerHandValue = game.dealerHand.getHandValue();
  res.status(200).json({
    status: "success",
    result: outcome,
    playerHandsValue,
    dealerHandValue,
  });
};
