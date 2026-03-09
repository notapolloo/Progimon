import { useState } from "react";
import PageShell from "../components/PageShell";
import haha from "../music/sfx/haha.wav";
import mcdog from "../music/sfx/mc-dog.wav";
import meow from "../music/sfx/meow.wav";
import meowrgh from "../music/sfx/meowrgh.wav";
import nah from "../music/sfx/nah.wav";
import oiia from "../music/sfx/oiia.wav";



export default function Game1({ navigate }) {
  const [score, setScore] = useState(0);
  const sounds = [haha, mcdog, meow, meowrgh, nah, oiia];

  function playRandomSfx() {
    const randomIndex = Math.floor(Math.random() * sounds.length);
    const audio = new Audio(sounds[randomIndex]);
    void audio.play().catch(() => {});
  }

  function handleClick() {
    setScore((prev) => prev + 1);
    playRandomSfx();
  }

  return (
    <PageShell title="Cookie Clicker">
      <div className="spa-game1-wrap">
        <p className="spa-game1-score">Score: {score}</p>
        <button type="button" className="spa-game1-click" onClick={handleClick}>
          Click me
        </button>
        {navigate ? (
          <button type="button" className="spa-top-button" onClick={() => navigate("/gameHome")}>
            Back to Games
          </button>
        ) : null}
      </div>
    </PageShell>
  );
}
