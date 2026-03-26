import { useEffect, useState } from "react";
import PageShell from "../components/PageShell";

export default function InventoryPage({ navigate }) {
  const [inventory, setInventory] = useState([]);
  const [selected, setSelected] = useState(null);
  const [me, setMe] = useState(null);
  
  const go = (to) => {
    if (typeof navigate === "function") navigate(to);
    else window.location.href = to;
  };
  
  useEffect(() => {
    fetch("/api/my-inventory", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setInventory(Array.isArray(data) ? data : []))
      .catch(() => setInventory([]));
  }, []);

  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setMe(data && data.loggedIn ? data : null))
      .catch(() => setMe(null));
  }, []);

  const isOwner =
    !!selected &&
    !!me &&
    (selected.parentUser === me.username ||
      selected.parentUser === me.userId ||
      selected.parentUser === String(me.userId ?? ""));

  return (
    <PageShell title="Welcome to the Progi-pad!">
    <div style={{ marginBottom: 16, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
    <button
    type="button"
    className="spa-top-button"
    onClick={() => go("/dum")}
    >
    Back to Homepage
    </button>
    <button
    type="button"
    className="spa-top-button"
    onClick={() => go("/progiFood")}
    >
    Go to ProgiFood!
    </button>
    </div>
    <div id="inventory-container" className="grid">
    {inventory.map((p) => (
      <img key={p._id} src={p.img_url} className="inventory-img" onClick={() => setSelected(p)} />
    ))}
    </div>
    
    <div className="modal" style={{ display: selected ? "flex" : "none" }}>
    <div className="modal-content">
    <span className="close" onClick={() => setSelected(null)}>&times;</span>
    <h2>{selected?.name}</h2>
    <div
    style={{
      backgroundImage: selected?.bg_url ? `url(${selected.bg_url})` : "none",
      backgroundSize: "cover",
      backgroundPosition: "center",
      padding: 12,
      borderRadius: 12
    }}
    >
    <img src={selected?.img_url} width="300" />
    </div>
    <p>Level: {selected?.level}</p>
    <p>Created By: {selected?.parentUser}</p>

    {!selected?.bg_url && isOwner && (
      <button
        id="make_room"
        type="button"
        onClick={() => go(`/drawpad?id=${encodeURIComponent(selected?._id ?? "")}`)}
      >
        Make their ProgiPad!
      </button>
    )}
    {selected?.bg_url && isOwner && (
      <button
        id="remake_room"
        type="button"
        onClick={() => go(`/drawpad?id=${encodeURIComponent(selected?._id ?? "")}`)}
      >
        Remake their ProgiPad!
      </button>
    )}

    <button id="go_to_room"
    
    type="button"
    
   
    onClick={() => go(`/progiRoom?id=${encodeURIComponent(selected?._id ?? "")}`)}
    >
    Go to their ProgiPad!
    </button>

    </div>
    </div>
    </PageShell>
  );
}
