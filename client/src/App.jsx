import { useState } from "react";
import axios from "axios";
import PlayerHands from "../components/PlayerHands";
import ActionButtons from "../components/ActionButtons";
import ResultsPanel from "../components/ResultsPanel";
import "./App.css";
import DealerHand from "../components/dealerHand";

const API_BASE = "http://localhost:3000/api/game";

function App() {
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

  const handleDeal = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_BASE}/deal`);
      const { playerCards, dealerCards } = res.data;
      setGameState({
        phase: "playing",
        playerHands: [{ cards: playerCards, value: null, isBust: false }],
        activeHandIndex: 0,
        dealerCards,
        dealerHandValue: null,
        results: null,
      });
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
          cards: playerCards,
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

  const handleDoubleDown = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_BASE}/double-down`);
      const { playerCards, isBust, handValue } = res.data;
      setGameState((prev) => {
        const updatedHands = [...prev.playerHands];
        updatedHands[prev.activeHandIndex] = {
          cards: playerCards,
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

  const fetchResult = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE}/result`);
      const { result, playerHandsValue, dealerHandValue, dealerCards } =
        res.data;
      setGameState((prev) => ({
        ...prev,
        phase: "roundOver",
        results: result,
        dealerCards,
        dealerHandValue,
        playerHands: prev.playerHands.map((hand, i) => ({
          ...hand,
          value: playerHandsValue[i],
        })),
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
        setGameState((prev) => ({
          ...prev,
          activeHandIndex: prev.activeHandIndex + 1,
        }));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to advance turn.");
    }
  };

  const handleStand = async () => {
    setLoading(true);
    setError(null);
    await advanceTurn();
    setLoading(false);
  };

  const handleSplit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_BASE}/split`);
      const { playerCards, handValue } = res.data;
      setGameState((prev) => {
        const updatedHands = [...prev.playerHands];
        updatedHands[prev.activeHandIndex] = {
          cards: playerCards,
          value: handValue,
          isBust: false,
        };
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
  const canDoubleDown = activeHand && activeHand.cards.length === 2;
  const canSplit =
    activeHand &&
    activeHand.cards.length === 2 &&
    activeHand.cards[0].rank === activeHand.cards[1].rank;

  return (
    <div className="app">
      <h1>Blackjack</h1>
      {error && <div className="error">{error}</div>}

      <DealerHand
        dealerCards={gameState.dealerCards}
        dealerHandValue={gameState.dealerHandValue}
      />
      <PlayerHands
        playerHands={gameState.playerHands}
        activeHandIndex={gameState.activeHandIndex}
      />

      <ActionButtons
        phase={gameState.phase}
        isBust={gameState.isBust}
        loading={loading}
        canDoubleDown={canDoubleDown}
        canSplit={canSplit}
        onDeal={handleDeal}
        onHit={handleHit}
        onStand={handleStand}
        onDoubleDown={handleDoubleDown}
        onSplit={handleSplit}
        onSeeResult={fetchResult}
        onNewRound={handleNewRound}
      />

      {gameState.phase === "roundOver" && (
        <ResultsPanel results={gameState.results} />
      )}
    </div>
  );
}

export default App;
