async function loadInventory() {
    const res = await fetch("/api/my-inventory");
    const progimons = await res.json();
    
    const container = document.getElementById("inventory-container");
    container.innerHTML = "";
    
    progimons.forEach(p => {
        
        const img = document.createElement("img");
        img.src = p.img_url;
        img.className = "inventory-img";
        img.onclick = () => openModal(p);
        
        container.appendChild(img);
    });
}

function openModal(progimon) {
    document.getElementById("modal-name").innerText = progimon.name;
    document.getElementById("modal-image").src = progimon.img_url;
    document.getElementById("modal-level").innerText = progimon.level; // fixed
    document.getElementById("modal-creator").innerText = progimon.parentUser; // fixed
    
    document.getElementById("progimon-modal").style.display = "flex";
}

function closeModal() {
    document.getElementById("progimon-modal").style.display = "none";
}



loadInventory();