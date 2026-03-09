import { useEffect, useRef, useState } from "react";
import PageShell from "../components/PageShell";
import wmc1Icon from "../img/wmc1.ico";
import itunesIcon from "../img/itunes1.ico";
import bookIcon from "../img/BOOK.png";
import houseTourIcon from "../img/HOUSETOUR.png";
import minigameIcon from "../img/MINIGAME.png";
import refreshIcon from "../img/REFRESHME.png";
import catFallback from "../img/cat.png";
import cleverBoyLoop from "../music/clever boy (apollo pet trader)/clever boy (loopable).ogg";

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

  async function deleteMyProgimon(id) {
    if (!id) return;
    const ok = window.confirm("Delete this progimon? This cannot be undone.");
    if (!ok) return;

    const res = await fetch(`/api/my-progimon/${id}`, {
      method: "DELETE",
      credentials: "include"
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data.error || "Could not delete progimon. You can only delete progimon you created.");
      return;
    }

    setProgimon((prev) => prev.filter((p) => p._id !== id));
    setSelected(null);
    alert(data.message || "Progimon deleted");
  }

  return (
    <PageShell title="Welcome to Progimon!">
      <div className="top-bar">
        <div className="left-spacer" />
        <div className="header-icons">
          <img src={wmc1Icon} className="icon" onClick={logout} />
          <img src={itunesIcon} className="icon" onClick={playAudio} />
          <img src={bookIcon} className="icon" onClick={() => navigate("/lookup")} />
          <img src={houseTourIcon} className="icon" onClick={() => navigate("/inventory")} />
          <img src={minigameIcon} className="icon" onClick={() => navigate("/gameHome")} />
          <button type="button" className="spa-top-button" onClick={() => navigate("/accpage")}>Account</button>
        </div>
      </div>

      <audio ref={audioRef} loop src={cleverBoyLoop} />

      <div className="refresh-container">
        <img src={refreshIcon} className="refresh-button" onClick={() => window.location.reload()} />
      </div>

      <div id="progiSpace">
        {message ? <p style={{ color: "red", textAlign: "center" }}>{message}</p> : null}
        {!message && progimon.length === 0 ? (
          <p style={{ color: "white", textAlign: "center" }}>No progimon yet... Weird...</p>
        ) : null}

        <ul style={{ listStyle: "none", display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center", padding: 0 }}>
          {progimon.map((m) => (
            <li key={m._id} style={{ width: 200, textAlign: "center", color: "white", cursor: "pointer" }} onClick={() => setSelected(m)}>
              <img src={m.img_url} alt={m.name || "monster"} style={{ width: "auto", height: 200 }} onError={(e) => (e.currentTarget.src = catFallback)} />
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
          <button onClick={() => deleteMyProgimon(selected?._id)}>Delete Progimon</button>
        </div>
      </div>
    </PageShell>
  );
}
