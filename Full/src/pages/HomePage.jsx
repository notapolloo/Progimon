import { useEffect, useRef, useState } from "react";
import PageShell from "../components/PageShell";

export default function HomePage({ navigate }) {
  const [progimon, setProgimon] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
  const audioRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/progimon")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load progimon");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const randomFive = [...data].sort(() => 0.5 - Math.random()).slice(0, 5);
        setProgimon(randomFive);
      })
      .catch((err) => {
        if (!cancelled) setMessage(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function playAudio() {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      audio.currentTime = 0;
    } else {
      audio.play();
    }
  }

  async function logout() {
    await fetch("/logout", { method: "POST" });
    navigate("/");
  }

  async function claimProgimon(id) {
    const res = await fetch("/api/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ progimonId: id })
    });
    const data = await res.json();
    alert(data.message || data.error || "Claim result unavailable");
    setSelected(null);
  }

  return (
    <PageShell title="Welcome to Progimon!">
      <div className="top-bar">
        <div className="left-spacer" />
        <div className="header-icons">
          <img src="/imgs/wmc1.ico" className="icon" onClick={logout} />
          <img src="/imgs/itunes1.ico" className="icon" onClick={playAudio} />
          <img src="/imgs/BOOK.png" className="icon" onClick={() => navigate("/lookup")} />
          <img src="/imgs/HOUSETOUR.png" className="icon" onClick={() => navigate("/inventory")} />
          <img src="/imgs/MINIGAME.png" className="icon" onClick={() => navigate("/gameHome")} />
        </div>
      </div>

      <audio ref={audioRef} loop src="/music/clever boy (apollo pet trader)/clever boy (loopable).ogg" />

      <div className="refresh-container">
        <img src="/imgs/REFRESHME.png" className="refresh-button" onClick={() => window.location.reload()} />
      </div>

      <div id="progiSpace">
        {message ? <p style={{ color: "red", textAlign: "center" }}>{message}</p> : null}
        {!message && progimon.length === 0 ? (
          <p style={{ color: "white", textAlign: "center" }}>No progimon yet... Weird...</p>
        ) : null}

        <ul style={{ listStyle: "none", display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center", padding: 0 }}>
          {progimon.map((m) => (
            <li key={m._id} style={{ width: 200, textAlign: "center", color: "white", cursor: "pointer" }} onClick={() => setSelected(m)}>
              <img src={m.img_url} alt={m.name || "monster"} style={{ width: "auto", height: 200 }} onError={(e) => (e.currentTarget.src = "/imgs/cat.png")} />
              <div><strong>{m.name || "Unnamed"}</strong></div>
              <div>Level {m.level}</div>
            </li>
          ))}
        </ul>
      </div>

      <div className="modal" style={{ display: selected ? "flex" : "none" }}>
        <div className="modal-content">
          <span className="close" onClick={() => setSelected(null)}>&times;</span>
          <h2>{selected?.name}</h2>
          <img src={selected?.img_url} width="150" />
          <p>Level: {selected?.level}</p>
          <p>Created By: {selected?.parentUser}</p>
          <button onClick={() => claimProgimon(selected?._id)}>Claim Progimon</button>
        </div>
      </div>
    </PageShell>
  );
}
