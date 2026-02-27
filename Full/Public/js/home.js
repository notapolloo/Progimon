console.log("HOME JS IS RUNNING");

function playAudio() {
  var audio = document.getElementById("myAudio");
  if (!audio.paused) {
    audio.pause();
    audio.currentTime = 0;
    return;
  } else audio.play();
}

async function logout(){
  const response = await fetch('/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.ok) {
    console.log('Haha!!!...');
    window.location.href = '/index.html';
  } else {
    console.error('Logout failed');
  }
}

function openModal(progimon) {
  document.getElementById("modal-name").innerText = progimon.name;
  document.getElementById("modal-image").src = progimon.img_url;
  document.getElementById("modal-level").innerText = progimon.level; // fixed
  document.getElementById("modal-creator").innerText = progimon.parentUser; // fixed

  document.getElementById("claim-button").onclick = () => claimProgimon(progimon._id);

  document.getElementById("progimon-modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("progimon-modal").style.display = "none";
}

async function claimProgimon(id) {
  const res = await fetch("/api/claim", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ progimonId: id })
  });

  const data = await res.json();
  alert(data.message);

  closeModal();
}

(function(){
  const ether = document.getElementById('progiSpace');

  function escapeHtml(s){
    return String(s)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  fetch('/api/progimon')
    .then(res => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then(data => {

      ether.innerHTML = '';

      if (!Array.isArray(data) || data.length === 0) {
        ether.innerHTML = '<p style="color:#fff;text-align:center;">No progimon yet... Weird...</p>';
        return;
      }

      // Take random 5
      data = data.sort(() => 0.5 - Math.random()).slice(0, 5);

      const list = document.createElement('ul');
      list.style.listStyle = 'none';
      list.style.display = 'flex';
      list.style.flexWrap = 'wrap';
      list.style.gap = '1rem';
      list.style.padding = '0';
      list.style.justifyContent = 'center';

      data.forEach(m => {

        const li = document.createElement('li');
        li.style.width = '200px';
        li.style.textAlign = 'center';
        li.style.color = '#fff';
        li.style.cursor = "pointer";   // 👈 ADDED

        const imgSrc = `${m.img_url}`;
        const fallback = '/imgs/cat.png';

        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = escapeHtml(m.name || 'monster');
        img.style.width = 'auto';
        img.style.height = '200px';

        img.onerror = function(){
          this.onerror = null;
          this.src = fallback;
        };

        const title = document.createElement('div');
        title.innerHTML = `<strong>${escapeHtml(m.name || 'Unnamed')}</strong>`;

        const meta = document.createElement('div');
        meta.style.fontSize = '1em';
        meta.style.opacity = '1';
        meta.innerText = `Level ${m.level}`;

        li.appendChild(img);
        li.appendChild(title);
        li.appendChild(meta);

        li.onclick = () => openModal(m);

        list.appendChild(li);
      });

      ether.appendChild(list);
    })
    .catch(err => {
      ether.innerHTML = `<p style="color: red;">Error: ${escapeHtml(err.message)}</p>`;
      console.error('There was a problem with the fetch operation:', err);
    });

})();