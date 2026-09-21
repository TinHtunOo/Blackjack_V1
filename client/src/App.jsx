import DealerHand from "../components/DealerHand";
import PlayerHands from "../components/PlayerHands";
import ActionButtons from "../components/ActionButtons";
import ResultsPanel from "../components/ResultsPanel";
import { Coins, AlertCircle } from "lucide-react";
import { useBlackjack } from "../hooks/useBlackjack";
import RulesModal from "../components/RulesModal";

function App() {
  const {
    gameState,
    chips,
    loading,
    error,
    canDoubleDown,
    canSplit,
    dealerMessage,
    dealerMessageKey,
    actions,
  } = useBlackjack();

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,var(--color-felt-light),var(--color-felt-deep)_70%)] text-card-cream font-body">
      <div className="max-w-[700px] mx-auto px-5 pt-10 pb-12 flex flex-col gap-8">
        <div className="flex items-center justify-between pb-4 border-b border-gold/25">
          <h1 className="font-display font-semibold text-2xl tracking-wide text-black uppercase flex items-center gap-1">
            <span>
              Black<span className="text-red-600">jack</span>
            </span>
          </h1>
          <RulesModal />
          <div className="flex items-center gap-1.5 font-display text-lg text-gold">
            <Coins className="w-4.5 h-4.5" strokeWidth={2} aria-hidden="true" />
            {chips !== null ? chips : "\u00A0"}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-[#4a1f1f] border border-ink-red text-card-cream px-3.5 py-2.5 rounded text-sm">
            <AlertCircle
              className="w-4 h-4 shrink-0 text-ink-red"
              aria-hidden="true"
            />
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col gap-8 rounded-xl border border-gold/20 bg-felt-rail/40 px-4 py-7 shadow-[inset_0_0_40px_rgba(0,0,0,0.25)]">
          <DealerHand
            dealerCards={gameState.dealerCards}
            dealerHandValue={gameState.dealerHandValue}
            dealerMessage={dealerMessage}
            dealerMessageKey={dealerMessageKey}
          />
          <PlayerHands
            playerHands={gameState.playerHands}
            activeHandIndex={gameState.activeHandIndex}
          />
        </div>

        <ActionButtons
          phase={gameState.phase}
          loading={loading}
          chips={chips}
          canDoubleDown={canDoubleDown}
          canSplit={canSplit}
          onDeal={actions.deal}
          onHit={actions.hit}
          onStand={actions.stand}
          onDoubleDown={actions.doubleDown}
          onSplit={actions.split}
          onNewRound={actions.newRound}
          onRestartChips={actions.restartChips}
        />
        <div className="lg:absolute lg:right-50 lg:top-30 ">
          {gameState.phase === "roundOver" && (
            <ResultsPanel results={gameState.results} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
