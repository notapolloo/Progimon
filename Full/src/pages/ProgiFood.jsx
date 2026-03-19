import { useEffect, useState } from "react";
import PageShell from "../components/PageShell";

export default function ProgiFoodPage({ navigate }) {
  const [progiFood, setProgiFood] = useState(0);
  const [inventory, setInventory] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [feedingId, setFeedingId] = useState("");

  async function loadPage() {
    setLoading(true);
    try {
      const [resourcesRes, inventoryRes] = await Promise.all([
        fetch("/api/me/resources", { credentials: "include" }),
        fetch("/api/my-inventory", { credentials: "include" })
      ]);

      const [resourcesData, inventoryData] = await Promise.all([
        resourcesRes.json().catch(() => ({})),
        inventoryRes.json().catch(() => [])
      ]);

      setProgiFood(Number(resourcesData?.progiFood) || 0);
      setInventory(Array.isArray(inventoryData) ? inventoryData : []);
    } catch {
      setProgiFood(0);
      setInventory([]);
      setStatus("Could not load your ProgiFood page.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPage();
  }, []);

  async function feedProgimon(id) {
    setFeedingId(id);
    setStatus("");

    try {
      const res = await fetch("/api/progifood/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ progimonId: id })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus(data.error || "Feeding failed");
        return;
      }

      setProgiFood(Number(data.progiFood) || 0);
      setInventory((current) =>
        current.map((progimon) => (progimon._id === id ? { ...progimon, ...data.progimon } : progimon))
      );
      setStatus(data.message || "Progimon fed successfully");
    } catch {
      setStatus("Feeding failed");
    } finally {
      setFeedingId("");
    }
  }

  return (
    <PageShell title="Feed your Progimon!">
      <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
        <button type="button" className="spa-top-button" onClick={() => navigate("/inventory")}>
          Back to Inventory
        </button>
        <button type="button" className="spa-top-button" onClick={() => navigate("/dum")}>
          Back to Homepage
        </button>
      </div>

      <div id="progiSpace" style={{ padding: 20 }}>
        <p style={{ textAlign: "center", color: "white", fontSize: "1.2rem" }}>
          <strong>Your ProgiFood:</strong> {progiFood}
        </p>
        <p style={{ textAlign: "center", color: "white" }}>
          Each feeding uses 1 ProgiFood and gives a Progimon 1 level.
        </p>
        {status ? <p style={{ textAlign: "center", color: "white" }}>{status}</p> : null}
        {loading ? <p style={{ textAlign: "center", color: "white" }}>Loading your Progimon...</p> : null}
        {!loading && inventory.length === 0 ? (
          <p style={{ textAlign: "center", color: "white" }}>You do not have any claimed Progimon yet.</p>
        ) : null}

        <div className="spa-account-grid">
          {inventory.map((progimon) => (
            <div key={progimon._id} className="lookup-card">
              <img src={progimon.img_url} alt={progimon.name} />
              <h3>{progimon.name}</h3>
              <p>Level: {progimon.level}</p>
              <p>Created By: {progimon.parentUser}</p>
              <button
                type="button"
                className="spa-top-button"
                disabled={feedingId === progimon._id || progiFood < 1}
                onClick={() => feedProgimon(progimon._id)}
              >
                {feedingId === progimon._id ? "Feeding..." : "Feed 1 ProgiFood"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
