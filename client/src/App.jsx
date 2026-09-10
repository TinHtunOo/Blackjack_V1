import { useBlackjack } from "../hooks/useBlackJack";
import DealerHand from "../components/DealerHand";
import PlayerHands from "../components/PlayerHands";
import ActionButtons from "../components/ActionButtons";
import ResultsPanel from "../components/ResultsPanel";

function App() {
  const { gameState, loading, error, canDoubleDown, canSplit, actions } =
    useBlackjack();

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,var(--color-felt-light),var(--color-felt-deep)_70%)] text-card-cream font-body">
      <div className="max-w-[480px] mx-auto px-5 pt-10 pb-12 flex flex-col gap-10">
        <h1 className="font-display font-semibold text-2xl text-center tracking-wide">
          Blackjack
        </h1>

        {error && (
          <div className="bg-[#4a1f1f] border border-ink-red text-card-cream px-3.5 py-2.5 rounded text-sm text-center">
            {error}
          </div>
        )}

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
          loading={loading}
          canDoubleDown={canDoubleDown}
          canSplit={canSplit}
          onDeal={actions.deal}
          onHit={actions.hit}
          onStand={actions.stand}
          onDoubleDown={actions.doubleDown}
          onSplit={actions.split}
          onNewRound={actions.newRound}
        />

        {gameState.phase === "roundOver" && (
          <ResultsPanel results={gameState.results} />
        )}
      </div>
    </div>
  );
}

export default App;
