function ResultsPanel({ results }) {
  if (!results) return null;

  return (
    <div className="results">
      <h2>Results</h2>
      {results.map((r, i) => (
        <p key={i}>
          Hand {i + 1}: {r.result}
        </p>
      ))}
    </div>
  );
}

export default ResultsPanel;
