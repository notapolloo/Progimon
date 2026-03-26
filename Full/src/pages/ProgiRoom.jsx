import { useState } from "react";
import PageShell from "../components/PageShell";

export default function ProgiRoomPage() {
  const [selected, setSelected] = useState(null);
  const params = new URLSearchParams(window.location.search); //progi id?
  const progimonId = params.get("id");
    if (!progimonId) {
      alert("Missing progimon id (open this from Inventory).");
      return;
    }

//find by id? 
//come with id and print out progi and its progipad on the site


  return( 
  <PageShell>

    <h1>Welcome to  {selected?.name} Progi-Pad!</h1>
    <div > 
      <img src={selected?.img_url} width="150" />
      <img id = "ProgiPad" src={selected?.bg_url}/>
    </div>




    </PageShell>
  );

  
}
