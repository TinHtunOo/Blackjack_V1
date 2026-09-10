import { useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:3000/api/game";
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const REVEAL_DELAY = 1000; // slightly longer than a single card's ~400ms deal-in animation
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // const fetchResult = async () => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const res = await axios.get(`${API_BASE}/result`);
  //     const {
  //       result,
  //       playerHandsValue,
  //       dealerHandValue,
  //       dealerCardsValue,
  //       dealerCards,
  //     } = res.data;
  //     setGameState((prev) => ({
  //       ...prev,
  //       phase: "roundOver",
  //       results: result,
  //       dealerCards,
  //       dealerHandValue,
  //       playerHands: prev.playerHands.map((hand, i) => ({
  //         ...hand,
  //         value: playerHandsValue[i],
  //       })),
  //     }));
  //   } catch (err) {
  //     setError(err.response?.data?.message || "Failed to fetch result.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchResult = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE}/result`);
      const { result, playerHandsValue, dealerCards } = res.data;

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
        await wait(REVEAL_DELAY); // let the new card finish dropping in
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
        results: result,
      }));
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

  const handleDeal = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_BASE}/deal`);
      const { playerCards, dealerCards, isPlayerBlackjack, playerHandValue } =
        res.data;

      setGameState({
        phase: "playing",
        playerHands: [
          { cards: playerCards, value: playerHandValue, isBust: false },
        ],
        activeHandIndex: 0,
        dealerCards,
        dealerHandValue: null,
        results: null,
      });
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
      const { playerCards, handValue, nextHandCards } = res.data;
      setGameState((prev) => {
        const updatedHands = [...prev.playerHands];

        updatedHands[prev.activeHandIndex] = {
          cards: playerCards,
          value: handValue,
          isBust: false,
        };

        updatedHands.push({
          cards: nextHandCards,
          value: null,
          isBust: false,
        });

        return { ...prev, playerHands: updatedHands };
      });
    } catch (err) {
      setError(err.response?.data?.message || "Cannot split.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewRound = () => {
    setGameState({
      phase: "idle",
      playerHands: [],
      activeHandIndex: 0,
      dealerCards: [],
      dealerHandValue: null,
      results: null,
    });
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
    loading,
    error,
    canDoubleDown,
    canSplit,
    actions: {
      deal: handleDeal,
      hit: handleHit,
      stand: handleStand,
      doubleDown: handleDoubleDown,
      split: handleSplit,
      newRound: handleNewRound,
      seeResult: fetchResult,
    },
  };
}
