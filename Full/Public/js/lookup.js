async function loadLookup() {
    const res = await fetch("/api/my-inventory");
    const progimons = await res.json();

    const container = document.getElementById("lookup-container");
    container.innerHTML = "";

    progimons.forEach(p => {
        const card = document.createElement("div");
        card.className = "lookup-card";

        card.innerHTML = `
            <img src="${p.img_url}">
            <h3>${p.name}</h3>
            <p>Level: ${p.baseLevel}</p>
            <p>Created By: ${p.creator?.User || "Unknown"}</p>
        `;

        container.appendChild(card);
    });
}

loadLookup();