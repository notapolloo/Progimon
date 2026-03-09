import PageShell from "../components/PageShell";
import cookieImg from "../img/COOKIE.png";
import basketImg from "../img/basket.png";
import cardImg from "../img/card.png";
import bushImg from "../img/bush.png";


export default function GameHomePage({ navigate }) {
  const games = [
    { route: "/Game1", img: cookieImg, name: "Cookie Clicker" },
    { route: "/Game2", img: basketImg, name: "Fruit Basket" },
    { route: "/Game3", img: cardImg, name: "Memory Cards" },
    { route: "/Game4", img: bushImg, name: "Wack-a-Steve!" }
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
