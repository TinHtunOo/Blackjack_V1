import { useMemo, useState } from "react";
import { GAMBLING_QUOTES } from "../data/dealerMessages";
import {
  Plus,
  Minus,
  Hand,
  Layers,
  SplitSquareHorizontal,
  RotateCw,
  RotateCcw,
} from "lucide-react";

function ActionButtons({
  phase,
  loading,
  chips,
  canDoubleDown,
  canSplit,
  onDeal,
  onHit,
  onStand,
  onDoubleDown,
  onSplit,
  onNewRound,
  onRestartChips,
}) {
  const [betAmount, setBetAmount] = useState(50);
  const isBroke = chips !== null && chips <= 0;
  const quote = useMemo(
    () => GAMBLING_QUOTES[Math.floor(Math.random() * GAMBLING_QUOTES.length)],
    [isBroke],
  );
  const buttonClass =
    "flex items-center gap-1.5 font-body font-medium text-sm px-4.5 py-2.5 rounded border border-gold bg-transparent text-card-cream cursor-pointer transition-colors duration-200 hover:not-disabled:bg-gold hover:not-disabled:text-felt-deep disabled:opacity-35 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-card-cream focus-visible:outline-offset-2";

  const inputClass =
    "font-body text-sm w-14 text-center bg-transparent text-card-cream focus-visible:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  const stepperButtonClass =
    "flex items-center justify-center w-7 h-7 rounded-full border border-gold/50 text-card-cream cursor-pointer transition-colors duration-200 hover:not-disabled:bg-gold hover:not-disabled:text-felt-deep hover:not-disabled:border-gold disabled:opacity-30 disabled:cursor-not-allowed";

  const adjustBet = (delta) => {
    setBetAmount((prev) => {
      const base = Number.isFinite(prev) ? prev : 0;
      return Math.max(1, base + delta);
    });
  };

  if (phase === "idle") {
    if (chips !== null && chips <= 0) {
      return (
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-card-cream/70">Out of chips.</p>
          <button
            onClick={onRestartChips}
            disabled={loading}
            className={buttonClass}
          >
            <RotateCcw className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
            Restart with 1000 chips
          </button>
          <p className="font-display italic text-sm text-gold/80 text-center max-w-[260px]">
            &ldquo;{quote}&rdquo;
          </p>
        </div>
      );
    }
    const betInvalid =
      !Number.isFinite(betAmount) ||
      betAmount <= 0 ||
      (chips !== null && betAmount > chips);

    return (
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <label
            htmlFor="bet-amount"
            className="font-body text-sm text-card-cream/70"
          ></label>
          <div className="flex items-center gap-1.5 rounded-full border border-gold pl-2 pr-1.5 py-1.5">
            <button
              type="button"
              onClick={() => adjustBet(-10)}
              disabled={loading}
              className={stepperButtonClass}
              aria-label="Decrease bet by 10"
            >
              <Minus
                className="w-3.5 h-3.5"
                strokeWidth={2.5}
                aria-hidden="true"
              />
            </button>

            <input
              id="bet-amount"
              type="number"
              min="1"
              step="1"
              value={betAmount}
              onChange={(e) => setBetAmount(Number(e.target.value))}
              disabled={loading}
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => adjustBet(10)}
              disabled={loading}
              className={stepperButtonClass}
              aria-label="Increase bet by 10"
            >
              <Plus
                className="w-3.5 h-3.5"
                strokeWidth={2.5}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
        <button
          onClick={() => onDeal(betAmount)}
          disabled={loading || betInvalid}
          className={buttonClass}
        >
          Deal
        </button>
        {betInvalid && chips !== null && betAmount > chips && (
          <p className="text-xs text-ink-red">Not enough chips.</p>
        )}
      </div>
    );
  }

  if (phase === "playing") {
    return (
      <div className="flex gap-2.5 justify-center flex-wrap">
        <button onClick={onHit} disabled={loading} className={buttonClass}>
          <Plus className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
          Hit
        </button>
        <button onClick={onStand} disabled={loading} className={buttonClass}>
          <Hand className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
          Stand
        </button>
        <button
          onClick={onDoubleDown}
          disabled={loading || !canDoubleDown}
          className={buttonClass}
        >
          <Layers className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
          Double Down
        </button>
        <button
          onClick={onSplit}
          disabled={loading || !canSplit}
          className={buttonClass}
        >
          <SplitSquareHorizontal
            className="w-4 h-4"
            strokeWidth={2}
            aria-hidden="true"
          />
          Split
        </button>
      </div>
    );
  }

  if (phase === "roundOver") {
    return (
      <div className="flex  justify-center">
        <button onClick={onNewRound} disabled={loading} className={buttonClass}>
          <RotateCw className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
          New Round
        </button>
      </div>
    );
  }

  return null;
}

export default ActionButtons;
