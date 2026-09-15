import { useState, useEffect } from "react";
import axios from "axios";
import { DEALER_TAUNTS } from "../data/dealerMessages.js";

const API_BASE = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const REVEAL_DELAY = 1000;
const RANK_VALUES = { A: 11, K: 10, Q: 10, J: 10 };

function computeHandValue(cards) {
  let total = 0;
  let aceCount = 0;
  for (const c of cards) {
    const value = RANK_VALUES[c.rank] ?? Number(c.rank);
    total += value;
    if (c.rank === "A") aceCount++;
  }
  while (total > 21 && aceCount > 0) {
    total -= 10;
    aceCount--;
  }
  return total;
}

export function useBlackjack() {
  const [gameState, setGameState] = useState({
    phase: "idle",
    playerHands: [],
    activeHandIndex: 0,
    dealerCards: [],
    dealerHandValue: null,
    results: null,
  });

  const [chips, setChips] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dealerMessage, setDealerMessage] = useState(null);
  const [dealerMessageKey, setDealerMessageKey] = useState(0);
  // fetch starting chip balance on mount, so it's visible before the first deal
  useEffect(() => {
    const loadChips = async () => {
      try {
        const res = await axios.get(`${API_BASE}/chips`);
        setChips(res.data.chips);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load chips.");
      }
    };
    loadChips();
  }, []);

  const fetchResult = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE}/result`);
      const {
        result,
        playerHandsValue,
        dealerCards,
        chips: newChips,
      } = res.data;

      setGameState((prev) => ({ ...prev, phase: "roundOver", results: null }));

      // Reveal the hole card first — cards 0 and 1 are already on the table
      const firstTwo = dealerCards.slice(0, 2);
      setGameState((prev) => ({
        ...prev,
        dealerCards: firstTwo,
        dealerHandValue: computeHandValue(firstTwo.map((e) => e.card)),
      }));
      await wait(REVEAL_DELAY);

      // Reveal any further dealer cards (from dealerPlay hitting) one at a time
      for (let i = 2; i < dealerCards.length; i++) {
        const prefix = dealerCards.slice(0, i + 1);
        setGameState((prev) => ({ ...prev, dealerCards: prefix }));
        await wait(REVEAL_DELAY);
        setGameState((prev) => ({
          ...prev,
          dealerHandValue: computeHandValue(prefix.map((e) => e.card)),
        }));
        await wait(REVEAL_DELAY);
      }

      setGameState((prev) => ({
        ...prev,
        playerHands: prev.playerHands.map((hand, i) => ({
          ...hand,
          value: playerHandsValue[i],
        })),
        results: result, // now [{ result, bet, payout }, ...]
      }));
      const finalDealerValue = computeHandValue(dealerCards.map((e) => e.card));
      if (finalDealerValue === 21) {
        triggerDealerTaunt();
      }
      // final chip balance, after all payouts applied server-side
      setChips(newChips);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch result.");
    } finally {
      setLoading(false);
    }
  };

  const advanceTurn = async () => {
    try {
      const res = await axios.post(`${API_BASE}/stand`);
      if (res.data.playerHandsValue) {
        await fetchResult();
      } else {
        const { nextPlayerCards, playerHandValue } = res.data;

        setGameState((prev) => {
          const updatedHands = [...prev.playerHands];
          updatedHands[prev.activeHandIndex + 1] = {
            ...updatedHands[prev.activeHandIndex + 1], // keep the bet already set by handleSplit
            cards: nextPlayerCards,
            value: null,
            isBust: false,
          };
          return {
            ...prev,
            activeHandIndex: prev.activeHandIndex + 1,
            playerHands: updatedHands,
          };
        });

        await wait(REVEAL_DELAY);

        setGameState((prev) => {
          const updatedHands = [...prev.playerHands];
          updatedHands[prev.activeHandIndex] = {
            ...updatedHands[prev.activeHandIndex],
            value: playerHandValue,
          };
          return { ...prev, playerHands: updatedHands };
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to advance turn.");
    }
  };

  const handleDeal = async (betAmount) => {
    setLoading(true);
    setError(null);
    setDealerMessage(null);
    try {
      const res = await axios.post(`${API_BASE}/deal`, { betAmount });
      const {
        playerCards,
        dealerCards,
        isPlayerBlackjack,
        playerHandValue,
        chips: newChips,
        bet,
      } = res.data;

      setGameState({
        phase: "playing",
        playerHands: [
          { cards: playerCards, value: playerHandValue, isBust: false, bet },
        ],
        activeHandIndex: 0,
        dealerCards,
        dealerHandValue: null,
        results: null,
      });
      setChips(newChips);

      if (isPlayerBlackjack) advanceTurn();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to deal.");
    } finally {
      setLoading(false);
    }
  };

  const handleHit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_BASE}/hit`);
      const { playerCards, isBust, handValue } = res.data;

      setGameState((prev) => {
        const updatedHands = [...prev.playerHands];
        updatedHands[prev.activeHandIndex] = {
          ...updatedHands[prev.activeHandIndex],
          cards: playerCards,
          value: null,
        };
        return { ...prev, playerHands: updatedHands };
      });

      await wait(REVEAL_DELAY);

      setGameState((prev) => {
        const updatedHands = [...prev.playerHands];
        updatedHands[prev.activeHandIndex] = {
          ...updatedHands[prev.activeHandIndex],
          value: handValue,
          isBust,
        };
        return { ...prev, playerHands: updatedHands };
      });

      if (isBust) {
        await advanceTurn();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to hit.");
    } finally {
      setLoading(false);
    }
  };

  const handleStand = async () => {
    setLoading(true);
    setError(null);
    await advanceTurn();
    setLoading(false);
  };

  const handleDoubleDown = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_BASE}/double-down`);
      const { playerCards, isBust, handValue, chips: newChips, bet } = res.data;

      setGameState((prev) => {
        const updatedHands = [...prev.playerHands];
        updatedHands[prev.activeHandIndex] = {
          ...updatedHands[prev.activeHandIndex],
          cards: playerCards,
          value: null,
          bet,
        };
        return { ...prev, playerHands: updatedHands };
      });
      setChips(newChips);

      await wait(REVEAL_DELAY);

      setGameState((prev) => {
        const updatedHands = [...prev.playerHands];
        updatedHands[prev.activeHandIndex] = {
          ...updatedHands[prev.activeHandIndex],
          value: handValue,
          isBust,
        };
        return { ...prev, playerHands: updatedHands };
      });

      await advanceTurn();
    } catch (err) {
      setError(err.response?.data?.message || "Cannot double down.");
    } finally {
      setLoading(false);
    }
  };

  const handleSplit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_BASE}/split`);
      const {
        playerCards,
        handValue,
        nextHandCards,
        chips: newChips,
        bet,
      } = res.data;

      setGameState((prev) => {
        const updatedHands = [...prev.playerHands];
        updatedHands[prev.activeHandIndex] = {
          cards: playerCards,
          value: handValue,
          isBust: false,
          bet,
        };
        updatedHands.push({
          cards: nextHandCards,
          value: null,
          isBust: false,
          bet,
        });
        return { ...prev, playerHands: updatedHands };
      });
      setChips(newChips);
    } catch (err) {
      setError(err.response?.data?.message || "Cannot split.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewRound = () => {
    setDealerMessage(null);
    setGameState({
      phase: "idle",
      playerHands: [],
      activeHandIndex: 0,
      dealerCards: [],
      dealerHandValue: null,
      results: null,
    });
  };

  // add near the other actions:
  const restartChips = async () => {
    try {
      const res = await axios.post(`${API_BASE}/restart-chips`);
      setChips(res.data.chips);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to restart chips.");
    }
  };

  const triggerDealerTaunt = () => {
    const taunt =
      DEALER_TAUNTS[Math.floor(Math.random() * DEALER_TAUNTS.length)];
    setDealerMessage(taunt);
    setDealerMessageKey((k) => k + 1);
  };

  const activeHand = gameState.playerHands[gameState.activeHandIndex];
  const canDoubleDown = Boolean(activeHand && activeHand.cards.length === 2);
  const canSplit = Boolean(
    activeHand &&
    activeHand.cards.length === 2 &&
    activeHand.cards[0].rank === activeHand.cards[1].rank,
  );

  return {
    gameState,
    chips,
    loading,
    error,
    canDoubleDown,
    canSplit,
    dealerMessage,
    dealerMessageKey,
    actions: {
      deal: handleDeal,
      hit: handleHit,
      stand: handleStand,
      doubleDown: handleDoubleDown,
      split: handleSplit,
      newRound: handleNewRound,
      seeResult: fetchResult,
      restartChips,
    },
  };
}
