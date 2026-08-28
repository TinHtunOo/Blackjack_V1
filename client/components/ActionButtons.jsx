function ActionButtons({
  phase,
  isBust,
  loading,
  canDoubleDown,
  canSplit,
  onDeal,
  onHit,
  onStand,
  onDoubleDown,
  onSplit,
  onSeeResult,
  onNewRound,
}) {
  if (phase === "idle") {
    return (
      <button onClick={onDeal} disabled={loading}>
        Deal
      </button>
    );
  }

  if (phase === "playing" && isBust) {
    return (
      <div className="bust-message">
        <p>Busted!</p>
        <button onClick={onSeeResult} disabled={loading}>
          See Result
        </button>
      </div>
    );
  }

  if (phase === "playing") {
    return (
      <div className="actions">
        <button onClick={onHit} disabled={loading}>
          Hit
        </button>
        <button onClick={onStand} disabled={loading}>
          Stand
        </button>
        <button onClick={onDoubleDown} disabled={loading || !canDoubleDown}>
          Double Down
        </button>
        <button onClick={onSplit} disabled={loading || !canSplit}>
          Split
        </button>
      </div>
    );
  }

  if (phase === "roundOver") {
    return (
      <button onClick={onNewRound} disabled={loading}>
        New Round
      </button>
    );
  }

  return null;
}

export default ActionButtons;
