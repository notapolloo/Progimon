fetch("http://localhost:3000/api/progimon").then(
        (response) => {return response.json()}).then(
        (response) =>{req = response}).then(
        () => {console.log(req);});


function playAudio() {
  //if the audio is already playing, mute it
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


            //grab the progis but only 5 random ones

            .then(data => {
                // data expected to be an array
                ether.innerHTML = '';
                if (!Array.isArray(data) || data.length === 0) {
                    ether.innerHTML = '<p style="color:#fff;text-align:center;">No progimon yet... Weird...</p>';
                    return;
                }
                //take a random sample of 5 progimon
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
                    
                    // Derive candidate image name from type
        
                    const imgSrc = `${m.img_url}`;
                    const fallback = '/imgs/cat.png'; //if imgSrc doesnt show
                    
                    const img = document.createElement('img');``
                    img.src = imgSrc;
                    img.alt = escapeHtml(m.name || 'monster');
                    img.style.width = 'auto';
                    img.style.height = '200px';
                    
                    // If candidate missing, fall back to packaged image
                    img.onerror = function(){ this.onerror = null; this.src = fallback; };
                    
                    const title = document.createElement('div');
                    title.innerHTML = `<strong>${escapeHtml(m.name || 'Unnamed')}</strong>`;
                    const meta = document.createElement('div');
                    meta.style.fontSize = '1em';
                    meta.style.opacity = '1';
                    
                    meta.innerText = `${m.type || ''} — ${m.country || ''}`;
                    
                    li.appendChild(img);
                    li.appendChild(title);
                    li.appendChild(meta);
                    list.appendChild(li);
                });
                
                ether.appendChild(list);
            })
            .catch(err => {
                ether.innerHTML = `<p style="color: red;">Error: ${escapeHtml(err.message)}</p>`;
                console.error('There was a problem with the fetch operation:', err);
            });
        })();


