import PageShell from "../components/PageShell";

export default function GameHomePage({ navigate }) {
  const games = [
    { href: "/gamesHTML/Game1.html", img: "/imgs/COOKIE.png", name: "Cookie Clicker" },
    { route: "/Game2", img: "/imgs/basket.png", name: "Fruit Basket" },
    { href: "/gamesHTML/Game3.html", img: "/imgs/card.png", name: "Memory Cards" },
    { href: "/gamesHTML/Game4.html", img: "/imgs/bush.png", name: "Wack-a-Steve!" }
  ];

  return (
    <PageShell title="Pick a mini-game!" className="game-home-bg">
      <div className="game-container">
        <div style={{ marginBottom: "12px" }}>
          <button type="button" className="spa-top-button" onClick={() => navigate("/dum")}>
            Back to Homepage
          </button>
        </div>
        <div className="game-grid">
          {games.map((game) => (
            <div
              key={game.route || game.href}
              className="game-item"
              onClick={() => (game.route ? navigate(game.route) : (window.location.href = game.href))}
            >
              <img src={game.img} className="game-icon" />
              <p className="game-label">{game.name}</p>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
