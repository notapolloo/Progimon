import { useEffect, useState } from "react";
import PageShell from "../components/PageShell";

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch("/api/my-inventory")
      .then((res) => res.json())
      .then((data) => setInventory(Array.isArray(data) ? data : []))
      .catch(() => setInventory([]));
  }, []);

  return (
    <PageShell title="Welcome to the Progi-pad!">
      <div id="inventory-container" className="grid">
        {inventory.map((p) => (
          <img key={p._id} src={p.img_url} className="inventory-img" onClick={() => setSelected(p)} />
        ))}
      </div>

      <div className="modal" style={{ display: selected ? "flex" : "none" }}>
        <div className="modal-content">
          <span className="close" onClick={() => setSelected(null)}>&times;</span>
          <h2>{selected?.name}</h2>
          <img src={selected?.img_url} width="300" />
          <p>Level: {selected?.level}</p>
          <p>Created By: {selected?.parentUser}</p>
        </div>
      </div>
    </PageShell>
  );
}
