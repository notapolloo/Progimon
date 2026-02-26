async function loadInventory() {
    const res = await fetch("/api/my-inventory");
    const progimons = await res.json();

    const container = document.getElementById("inventory-container");
    container.innerHTML = "";

    progimons.forEach(p => {
        const img = document.createElement("img");
        img.src = p.img_url;
        img.className = "inventory-img";

        container.appendChild(img);
    });
}

loadInventory();