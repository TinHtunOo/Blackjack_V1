function DealerHand({ dealerCards, dealerHandValue }) {
  return (
    <div className="dealer-area">
      <h2>Dealer</h2>
      <div className="cards">
        {dealerCards.map((entry, i) =>
          entry.hidden ? (
            <div key={i} className="card hidden-card">
              🂠
            </div>
          ) : (
            <div key={i} className="card">
              {entry.card.rank} {entry.card.suit}
            </div>
          ),
        )}
      </div>
      {dealerHandValue !== null && <p>Dealer value: {dealerHandValue}</p>}
    </div>
  );
}

export default DealerHand;
