//Fetches
fetch('/api/players')
  .then(response => response.json())
  .then(players => {
    const playerList = document.getElementById('playerList');
    playerList.innerHTML = '';
    players.forEach(player => {
      const li = document.createElement('li');
      li.textContent = `${player.name} - ${player.level}`;
      playerList.appendChild(li);
    });
  });
  //- copilot

  