function ResultsPanel({ results }) {
  if (!results) return null;

  return (
    <div className="flex flex-col items-center gap-3 font-display">
      <h2 className="text-xl">Results</h2>
      {results.map((r, i) => (
        <p key={i} className="text-lg">
          Hand {i + 1}: {r.result}
        </p>
      ))}
    </div>
  );
}

export default ResultsPanel;
