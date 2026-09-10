function ActionButtons({
  phase,
  loading,
  canDoubleDown,
  canSplit,
  onDeal,
  onHit,
  onStand,
  onDoubleDown,
  onSplit,
  onNewRound,
}) {
  const buttonClass =
    "font-body font-medium text-sm px-4.5 py-2.5 rounded border border-gold bg-transparent text-card-cream cursor-pointer transition-colors duration-200 hover:not-disabled:bg-gold hover:not-disabled:text-felt-deep disabled:opacity-35 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-card-cream focus-visible:outline-offset-2";

  if (phase === "idle") {
    return (
      <div className="flex justify-center">
        <button onClick={onDeal} disabled={loading} className={buttonClass}>
          Deal
        </button>
      </div>
    );
  }

  if (phase === "playing") {
    return (
      <div className="flex gap-2.5 justify-center flex-wrap">
        <button onClick={onHit} disabled={loading} className={buttonClass}>
          Hit
        </button>
        <button onClick={onStand} disabled={loading} className={buttonClass}>
          Stand
        </button>
        <button
          onClick={onDoubleDown}
          disabled={loading || !canDoubleDown}
          className={buttonClass}
        >
          Double Down
        </button>
        <button
          onClick={onSplit}
          disabled={loading || !canSplit}
          className={buttonClass}
        >
          Split
        </button>
      </div>
    );
  }

  if (phase === "roundOver") {
    return (
      <div className="flex justify-center">
        <button onClick={onNewRound} disabled={loading} className={buttonClass}>
          New Round
        </button>
      </div>
    );
  }

  return null;
}

export default ActionButtons;
