function ResultsPanel({ results }) {
  if (!results) return null;

  const isSplit = results.length > 1;

  const outcomeMeta = (result) => {
    if (result === "player") return { label: "Win", colorClass: "text-gold" };
    if (result === "dealer")
      return { label: "Loss", colorClass: "text-ink-red" };
    return { label: "Tie", colorClass: "text-card-cream/70" };
  };

  return (
    <div className="flex flex-col items-center gap-3 font-display">
      <h2 className="text-xl">Results</h2>
      {results.map((r, i) => {
        const { label, colorClass } = outcomeMeta(r.result);
        return (
          <div
            key={i}
            className="flex flex-col items-center gap-0.5 rounded-md border border-gold/20 px-5 py-2.5"
          >
            <p className={`flex items-center gap-1.5 text-lg ${colorClass}`}>
              {isSplit ? `Hand ${i + 1}` : "Player"}: {label}
            </p>
            <p className="text-sm text-card-cream/60 font-body">
              Bet {r.bet} &middot;{" "}
              {r.payout > 0
                ? `+${r.payout}`
                : r.payout === 0
                  ? "Lost"
                  : r.payout}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default ResultsPanel;
