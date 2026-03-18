import { useEffect, useState } from "react";
import PageShell from "../components/PageShell";
import steveImg from "../img/steveLook.png"; 
import bushImg from "../img/bush.png";    
import treeImg from "../img/tree.png";    
import "../css/spa.css";

const SPOTS = [
  { top: "20%", left: "10%" },
  { top: "50%", left: "30%" },
  { top: "70%", left: "60%" },
  { top: "30%", left: "70%" },
];

export default function Game4() {
  const [score, setScore] = useState(0);
  const [currentSpot, setCurrentSpot] = useState(0);

  const gameOver = score >= 10; // win condition

  useEffect(() => {
    if (gameOver) return; // stop moving when game ends

    const moveSteve = setInterval(() => {
      const nextSpot = Math.floor(Math.random() * SPOTS.length);
      setCurrentSpot(nextSpot);
    }, 1500);

    return () => clearInterval(moveSteve);
  }, [gameOver]);

  const handleClick = () => {
    if (!gameOver) {
      setScore((prev) => prev + 1);
    }
  };

  const handleRestart = () => {
    setScore(0);
    setCurrentSpot(0);
  };

  return (
    <PageShell>
      <div className="game4-scene">

        {/* 🏆 WIN SCREEN */}
        {gameOver ? (
          <div className="win-screen">
            <h1>You Win! 🎉</h1>
            <button onClick={handleRestart}>Start Over</button>
            <button onClick={() => window.location.href = "/gameHome"}> Return to Game Home </button>
          </div>
        ) : (
          <>
            <h2>Score: {score}</h2>

            <div className="scene-container">
              {/* Bushes and Tree */}
              <img src={bushImg} alt="Bush 1" className="bush bush1" />
              <img src={bushImg} alt="Bush 2" className="bush bush2" />
              <img src={treeImg} alt="Tree" className="tree" />
              <img src={bushImg} alt="Bush 3" className="bush bush3" />

              {/* Steve */}
              <img
                src={steveImg}
                alt="Steve"
                className="steve"
                style={{
                  top: SPOTS[currentSpot].top,
                  left: SPOTS[currentSpot].left,
                }}
                onClick={handleClick}
              />
            </div>
          </>
        )}
      </div>
    </PageShell>
  );
}