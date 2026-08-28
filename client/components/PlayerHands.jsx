function PlayerHands({ playerHands, activeHandIndex }) {
  return (
    <div className="player-area">
      <h2>Player</h2>
      {playerHands.map((hand, i) => (
        <div
          key={i}
          className={`hand ${i === activeHandIndex ? "active" : ""}`}
        >
          <div className="cards">
            {hand.cards.map((c, j) => (
              <div key={j} className="card">
                {c.rank} {c.suit}
              </div>
            ))}
          </div>
          {hand.value !== null && <p>Value: {hand.value}</p>}
          {hand.isBust && <p className="bust-label">Busted</p>}
        </div>
      ))}
    </div>
  );
}

export default PlayerHands;
