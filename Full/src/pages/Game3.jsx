import { useState, useEffect } from "react";
import PageShell from "../components/PageShell";

// ✅ IMPORT images
import cardBack from "../img/card.png";
import fallbackImg from "../img/cat-2.png";

export default function Game3() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [score, setScore] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    fetch("/api/progimon")
      .then(res => res.json())
      .then(data => {
        const processed = data.map(card => ({
          ...card,
          matched: false,
          imageURL: card.img_url
        }));

        const doubled = [...processed, ...processed]
          .map(card => ({
            ...card,
            uuid: Math.random()
          }))
          .sort(() => Math.random() - 0.5);

        setCards(doubled);
      })
      .catch(err => console.error("Failed to fetch Progimon:", err));
  }, []);

  const handleCardClick = (card) => {
    if (disabled || card.matched) return;

    // prevent clicking same card twice
    if (flippedCards.some(c => c.uuid === card.uuid)) return;

    const newFlipped = [...flippedCards, card];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setDisabled(true);

      const [first, second] = newFlipped;

      if (first._id === second._id) {
        // ✅ MATCH
        setCards(prevCards =>
          prevCards.map(c =>
            c._id === first._id ? { ...c, matched: true } : c
          )
        );

        setScore(s => s + 10);

        setTimeout(() => {
          setFlippedCards([]);
          setDisabled(false);

          // 🏆 CHECK WIN
          setCards(current => {
            const allMatched = current.every(c => c.matched);
            if (allMatched) {
              setGameWon(true);
            }
            return current;
          });
        }, 1200);

      } else {
        // ❌ NOT MATCH
        setTimeout(() => {
          setFlippedCards([]);
          setDisabled(false);
        }, 1800);
      }
    }
  };

  // 🏆 WIN SCREEN
  if (gameWon) {
    return (
      <PageShell>
        <div className="win-screen">
          <h1>🎉 You Win! 🎉</h1>
          <h2>Score: {score}</h2>
          <h3>Moves: {moves}</h3>

          <button onClick={() => window.location.href = "/gameHome"}>
            Return to Game Home
          </button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <h2>Moves: {moves}</h2>
      <h3>Score: {score}</h3>

      <div className="game3-container">
        <div className="memory-board">
          {cards.map(card => {
            const isFlipped =
              flippedCards.some(c => c.uuid === card.uuid) || card.matched;

            return (
              <div
                key={card.uuid}
                className={`memory-card 
                  ${isFlipped ? "flip" : ""} 
                  ${card.matched ? "matched" : ""}
                `}
                onClick={() => handleCardClick(card)}
              >
                <div className="front">
                  <img src={cardBack} alt="Hidden" />
                </div>

                <div className="back">
                  <img
                    src={card.imageURL || fallbackImg}
                    alt="Progimon"
                    onError={(e) => (e.target.src = fallbackImg)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}