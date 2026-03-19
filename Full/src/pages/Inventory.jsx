import { useEffect, useState } from "react";
import PageShell from "../components/PageShell";

export default function InventoryPage({ navigate }) {
  const [inventory, setInventory] = useState([]);
  const [selected, setSelected] = useState(null);
  
  const go = (to) => {
    if (typeof navigate === "function") navigate(to);
    else window.location.href = to;
  };
  
  useEffect(() => {
    fetch("/api/my-inventory")
    .then((res) => res.json())
    .then((data) => setInventory(Array.isArray(data) ? data : []))
    .catch(() => setInventory([]));
  }, []);
  
  return (
    <PageShell title="Welcome to the Progi-pad!">
    <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}>
    <button
    type="button"
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
    <button
    type="button"
    disabled={!selected?._id}
    //onClick={() => go(`/drawPad?id=${encodeURIComponent(selected?._id ?? "")}`)}
    onClick={() => go("/progiRoom")}
    >
    Go to their ProgiPad!
    </button>
    </div>
    </div>
    </PageShell>
  );
}
