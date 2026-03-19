import { useEffect, useState } from "react";
import PageShell from "../components/PageShell";

export default function AccountPage({ navigate }) {
  const [me, setMe] = useState(null);
  const [myProgimon, setMyProgimon] = useState([]);
  const [claimedProgimon, setClaimedProgimon] = useState([]);
  const [status, setStatus] = useState("");

  async function loadProgimonLists() {
    try {
      const [createdRes, claimedRes] = await Promise.all([
        fetch("/api/my-progimon", { credentials: "include" }),
        fetch("/api/my-inventory", { credentials: "include" })
      ]);

      const [createdData, claimedData] = await Promise.all([
        createdRes.json().catch(() => []),
        claimedRes.json().catch(() => [])
      ]);

      setMyProgimon(Array.isArray(createdData) ? createdData : []);
      setClaimedProgimon(Array.isArray(claimedData) ? claimedData : []);
    } catch {
      setMyProgimon([]);
      setClaimedProgimon([]);
    }
  }

  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setMe(data))
      .catch(() => setMe(null));

    loadProgimonLists();
  }, []);

  async function deleteOne(id) {
    const ok = window.confirm("Delete this progimon?");
    if (!ok) return;

    const res = await fetch(`/api/my-progimon/${id}`, { method: "DELETE", credentials: "include" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setStatus(data.error || "Delete failed");
      return;
    }

    await loadProgimonLists();
    setStatus(data.message || "Deleted");
  }

  async function deleteAll() {
    const ok = window.confirm("Delete ALL progimon you created?");
    if (!ok) return;

    const res = await fetch("/api/my-progimon", { method: "DELETE", credentials: "include" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setStatus(data.error || "Delete all failed");
      return;
    }

    await loadProgimonLists();
    setStatus(data.message || "All deleted");
  }

  const createdIds = new Set(myProgimon.map((p) => p._id));

  return (
    <PageShell title="My Account Page">
      <div id="account-content">
        <div className="account-info">
          <h2>Account Information</h2>
          <p><strong>User:</strong> {me?.username || "Unknown"}</p>
          <p><strong>User ID:</strong> {me?.userId || "Unknown"}</p>
          <p><strong>ProgiFood Amount:</strong> {me?.progiFood || "Unknown"} </p>
          <button type="button" className="spa-top-button" onClick={() => navigate("/dum")}>Back to Home</button>
          <button type="button" className="spa-danger-button" onClick={deleteAll}>Delete All My Progimon</button>
          {status ? <p>{status}</p> : null}
        </div>

        <h2 className="spa-section-title">Progimon I Created</h2>
        <div className="spa-account-grid">
          {myProgimon.length === 0 ? <p>You have not created any progimon yet.</p> : null}
          {myProgimon.map((p) => (
            <div key={p._id} className="lookup-card">
              <img src={p.img_url} alt={p.name} />
              <h3>{p.name}</h3>
              <p>Level: {p.level}</p>
              {claimedProgimon.some((c) => c._id === p._id) ? <p className="spa-chip">Also Claimed</p> : null}
              <button type="button" className="spa-danger-button" onClick={() => deleteOne(p._id)}>
                Delete
              </button>
            </div>
          ))}
        </div>

        <h2 className="spa-section-title">Progimon I Claimed</h2>
        <div className="spa-account-grid">
          {claimedProgimon.length === 0 ? <p>You have not claimed any progimon yet.</p> : null}
          {claimedProgimon.map((p) => (
            <div key={p._id} className="lookup-card">
              <img src={p.img_url} alt={p.name} />
              <h3>{p.name}</h3>
              <p>Level: {p.level}</p>
              {createdIds.has(p._id) ? <p className="spa-chip">Created By You</p> : null}
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
