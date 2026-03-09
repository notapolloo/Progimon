import { useEffect, useMemo, useRef, useState } from "react";
import PageShell from "../components/PageShell";

const GAME_WIDTH = 900;
const GAME_HEIGHT = 520;
const BASKET_WIDTH = 110;
const FRUIT_SIZE = 26;
const MAX_LIVES = 3;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export default function Game2({ navigate }) {
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [progiFood, setProgiFood] = useState(0);
  const [earned, setEarned] = useState(0);
  const [message, setMessage] = useState("");

  const basketXRef = useRef((GAME_WIDTH - BASKET_WIDTH) / 2);
  const fruitsRef = useRef([]);
  const keysRef = useRef({ left: false, right: false });
  const animationRef = useRef(null);
  const spawnTimerRef = useRef(0);
  const lastTimeRef = useRef(0);
  const gameAreaRef = useRef(null);
  const rewardedRef = useRef(false);

  const [renderState, setRenderState] = useState({ basketX: basketXRef.current, fruits: [] });

  const liveFruitCount = useMemo(() => renderState.fruits.length, [renderState.fruits]);

  async function fetchFood() {
    try {
      const res = await fetch("/api/me/resources", { credentials: "include" });
      if (!res.ok) return;
      const data = await res.json();
      setProgiFood(Number(data.progiFood) || 0);
    } catch {
      // noop
    }
  }

  useEffect(() => {
    fetchFood();
  }, []);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") keysRef.current.left = true;
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") keysRef.current.right = true;
    }

    function onKeyUp(e) {
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") keysRef.current.left = false;
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") keysRef.current.right = false;
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useEffect(() => {
    if (!running) return undefined;

    lastTimeRef.current = performance.now();

    function tick(now) {
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      const speed = 420;
      if (keysRef.current.left) basketXRef.current -= speed * dt;
      if (keysRef.current.right) basketXRef.current += speed * dt;
      basketXRef.current = clamp(basketXRef.current, 0, GAME_WIDTH - BASKET_WIDTH);

      spawnTimerRef.current -= dt;
      if (spawnTimerRef.current <= 0) {
        spawnTimerRef.current = 0.9 + Math.random() * 0.7;
        fruitsRef.current.push({
          id: `${Date.now()}-${Math.random()}`,
          x: Math.random() * (GAME_WIDTH - FRUIT_SIZE),
          y: -FRUIT_SIZE,
          vy: 90 + Math.random() * 120
        });
      }

      let scoreDelta = 0;
      let lifeLost = 0;

      fruitsRef.current = fruitsRef.current.filter((fruit) => {
        fruit.y += fruit.vy * dt;

        const basketTop = GAME_HEIGHT - 36;
        const fruitBottom = fruit.y + FRUIT_SIZE;
        const basketCenter = basketXRef.current + BASKET_WIDTH / 2;
        const fruitCenter = fruit.x + FRUIT_SIZE / 2;
        const horizontalHit = Math.abs(fruitCenter - basketCenter) < BASKET_WIDTH / 2;
        const verticalHit = fruitBottom >= basketTop && fruit.y <= GAME_HEIGHT;

        if (horizontalHit && verticalHit) {
          scoreDelta += 1;
          return false;
        }

        if (fruit.y > GAME_HEIGHT) {
          lifeLost += 1;
          return false;
        }

        return true;
      });

      if (scoreDelta > 0) {
        setScore((prev) => prev + scoreDelta);
      }

      if (lifeLost > 0) {
        setLives((prev) => {
          const next = Math.max(0, prev - lifeLost);
          if (next <= 0) {
            setRunning(false);
          }
          return next;
        });
      }

      setRenderState({ basketX: basketXRef.current, fruits: [...fruitsRef.current] });
      animationRef.current = requestAnimationFrame(tick);
    }

    animationRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [running]);

  useEffect(() => {
    if (running || lives > 0 || rewardedRef.current) return;

    rewardedRef.current = true;
    fetch("/api/minigame/game2/reward", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ score })
    })
      .then((res) => res.json())
      .then((data) => {
        setEarned(Number(data.earned) || 0);
        setProgiFood(Number(data.progiFood) || 0);
        setMessage("Round complete! Reward granted.");
      })
      .catch(() => setMessage("Round complete! Could not grant reward."));
  }, [running, lives, score]);

  function startGame() {
    setScore(0);
    setLives(MAX_LIVES);
    setEarned(0);
    setMessage("");
    rewardedRef.current = false;
    basketXRef.current = (GAME_WIDTH - BASKET_WIDTH) / 2;
    fruitsRef.current = [];
    spawnTimerRef.current = 0.6;
    setRenderState({ basketX: basketXRef.current, fruits: [] });
    setRunning(true);
  }

  function onMouseMove(e) {
    const box = gameAreaRef.current?.getBoundingClientRect();
    if (!box) return;
    const x = e.clientX - box.left - BASKET_WIDTH / 2;
    basketXRef.current = clamp(x, 0, GAME_WIDTH - BASKET_WIDTH);
    setRenderState((prev) => ({ ...prev, basketX: basketXRef.current }));
  }

  return (
    <PageShell title="Fruit Basket">
      <div className="spa-game2-panel">
        <p><strong>Score:</strong> {score}</p>
        <p><strong>Lives:</strong> {lives}</p>
        <p><strong>Fruit On Screen:</strong> {liveFruitCount}</p>
        <p><strong>Your ProgiFood:</strong> {progiFood}</p>
        {earned > 0 ? <p><strong>Last Reward:</strong> +{earned} ProgiFood</p> : null}
        {message ? <p>{message}</p> : null}
        {!running && (
          <button type="button" className="spa-top-button" onClick={startGame}>
            {lives === 0 ? "Play Again" : "Start Game"}
          </button>
        )}
        <button type="button" className="spa-top-button" onClick={() => navigate("/gameHome")}>Back to Games</button>
      </div>

      <div
        ref={gameAreaRef}
        className="spa-game2-area"
        onMouseMove={onMouseMove}
        role="application"
        aria-label="Catch fruit game"
      >
        {renderState.fruits.map((fruit) => (
          <div
            key={fruit.id}
            className="spa-game2-fruit"
            style={{ transform: `translate(${fruit.x}px, ${fruit.y}px)` }}
          />
        ))}

        <div
          className="spa-game2-basket"
          style={{ transform: `translate(${renderState.basketX}px, ${GAME_HEIGHT - 30}px)` }}
        />
      </div>

      <p style={{ textAlign: "center" }}>Controls: move basket with mouse or Arrow keys / A-D.</p>
    </PageShell>
  );
}
