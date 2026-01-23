//FETCH ALL works
// Fetch all of the chickens
fetch("http://localhost:3000/api/chickens").then(
    (response) => {return response.json()}).then(
        (response) =>{req = response}).then(
            () => {console.log(req);});

// Fetch all of the monsters
fetch("http://localhost:3000/api/monsterz").then(
    (response) => {return response.json()}).then(
        (response) =>{req = response}).then(
            () => {console.log(req);});

//FETCH ONLY ONE works
// Fetch only this chicken
fetch("http://localhost:3000/api/chickens/"+JSON.stringify({_id:"Your ID here"}))
.then(
    (response) => {return response.json()}).then(
        (response) =>{req = response}).then(
            () => {console.log(req);});

//fetch only this monster
fetch("http://localhost:3000/api/monsterz/"+JSON.stringify({_id:"Your ID here"}))
.then(
    (response) => {return response.json()}).then(
        (response) =>{req = response}).then(
            () => {console.log(req);});

//FILTERS works
//fetch a chicken of this color
fetch("http://localhost:3000/api/chickens/"+JSON.stringify({color: "Your color here"}))
.then(
    (response) => {return response.json()}).then(
        (response) =>{req = response}).then(
            () => {console.log(req);});

//fetch a monsterz of this name
fetch("http://localhost:3000/api/monsterz/"+JSON.stringify({color: "Your color here"}))
.then(
    (response) => {return response.json()}).then(
        (response) =>{req = response}).then(
            () => {console.log(req);});

//MAKE works
// Make a new chick
fetch("http://localhost:3000/api/chicken", {
    method:"POST", 
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({name: "Your name here", age: "Numarical age", color:"Your color here"}) })
    .then((response) => {console.log(response.json())});

// Make a new monster
fetch("http://localhost:3000/api/monsterz", {
    method:"POST", 
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({name: "Your name here", country: "Place of birth", type:"Your type here"}) })
    .then((response) => {console.log(response.json())});

//UPDATE
// Update Chicken to be older works
fetch(`http://localhost:3000/api/chicken/${encodeURIComponent("Your ID here")}`, 
    {method:"PUT", 
        headers:{'Content-Type':'application/json'}
        ,body:JSON.stringify({age: "3300"}) })
        .then((response) => {console.log(response.json())});

// Update monster to be different
fetch(`http://localhost:3000/api/monsterz/${encodeURIComponent("Your ID here")}`, 
    {method:"PUT", 
        headers:{'Content-Type':'application/json'}
        ,body:JSON.stringify({type: "weird"}) })
        .then((response) => {console.log(response.json())});


//DELETE works
// Delete chicken by id
fetch(`http://localhost:3000/api/chicken/${encodeURIComponent("Your ID here")}`,
{method:'DELETE'})
.then(response => {
    if (!response.ok) throw new Error(`Delete failed: ${response.status} ${response.statusText}`);
    return response.json();});

// Delete monster by id
fetch(`http://localhost:3000/api/monsterz/${encodeURIComponent("Your ID here")}`,
{method:'DELETE'})
.then(response => {
    if (!response.ok) throw new Error(`Delete failed: ${response.status} ${response.statusText}`);
    return response.json();});
//--
fetch(`http://monsterhouse.qzz.io/api/monsterz/${encodeURIComponent("6936f73b7928eeed75e2982a")}`,
{method:'DELETE'})
.then(response => {
    if (!response.ok) throw new Error(`Delete failed: ${response.status} ${response.statusText}`);
    return response.json();});
    //for web
