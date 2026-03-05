import { useEffect, useState } from "react";
import PageShell from "../components/PageShell";

export default function LookupPage() {
  const [progimon, setProgimon] = useState([]);

  useEffect(() => {
    fetch("/api/my-inventory")
      .then((res) => res.json())
      .then((data) => setProgimon(Array.isArray(data) ? data : []))
      .catch(() => setProgimon([]));
  }, []);

  return (
    <PageShell title="Look up your Progimon!">
      <div id="lookup-container" className="grid">
        {progimon.map((p) => (
          <div className="lookup-card" key={p._id}>
            <img src={p.img_url} />
            <h3>{p.name}</h3>
            <p>Level: {p.level}</p>
            <p>Created By: {p.parentUser || "Unknown"}</p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
