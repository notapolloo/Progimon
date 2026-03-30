import { useEffect, useState } from "react";
import PageShell from "../components/PageShell";

export default function ProgiRoomPage({ navigate }) {
  const [me, setMe] = useState(null);
  const [curProgimon, setCurProgimon] = useState(null);
  const [loading, setLoading] = useState(true);

  const params = new URLSearchParams(window.location.search);
  const progimonId = params.get("id");


  const go = (to) => {
    if (typeof navigate === "function") navigate(to);
    else window.location.href = to;
  };

  if (!progimonId) {
    alert("Missing progimon id (open this from Inventory).");
    go("/inventory");
  }
  
  
  
  
  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => setMe(data && data.loggedIn ? data : null))
    .catch(() => setMe(null));
  }, []);
  
  useEffect(() => {
    if (!progimonId) return;

    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/progimon/${encodeURIComponent(progimonId)}`, {
          credentials: "include"
        });

        if (!res.ok) {
          const details = await res.text().catch(() => "");
          console.log("Failed to load progimon for ProgiRoom", res.status, details);
          alert(`failed to load ProgiPad (HTTP ${res.status})`);
          go("/inventory");
          return;
        }

        const data = await res.json().catch(() => null);
        if (!cancelled) setCurProgimon(data);
      } catch (err) {
        console.log("Failed to load progimon for ProgiRoom", err);
        alert("failed to load ProgiPad");
        go("/inventory");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [progimonId]);
    
    
    return( 
      <PageShell>
      
      <h1 id="main-heading3" >Welcome to {curProgimon?.name}'s Progi-Pad!</h1>
      
      <div id="ProgiPad"> 
      {!loading && curProgimon?.img_url ? <img id="ProgionPad" src={curProgimon.img_url}  /> : null}
      {!loading && curProgimon?.bg_url ? <img id="ProgiPadbg" src={curProgimon.bg_url} /> :  null}
      </div>
      
      
      
      
      </PageShell>
    );
  }
  
  
  
