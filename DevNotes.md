 Mongo db new database
  Make login screen (DONE) and database of passwords 
  save and return passwords
  EXPRESS MIDDLEWARE
  SAVE SESSION 
  

  npx vite --port 3000
  npm run build  
  nodemon server.js   


TODO:

[Means_done]


Clickable progis with a limited amount of refreshes per day
[--> Progis on account page
make account page ]
click progis in the progi pad with a drawable progipad-
go to progipad- click progi- 


progipad:

Add a field on the model: in Full/server.js progimonSchema (around line 169), add something like bg_url: { type: String, default: "" }. DONE

Add an authenticated update route: prefer a new endpoint (so you can enforce ownership), e.g. PUT /api/my-progimon/:id/background that checks req.session.userId, finds the progimon owned by that user, and sets bg_url from the request body. 

Make a “Draw Background” page: copy/reuse Full/src/pages/draw.jsx but change the submit to fetch("PUT /api/my-progimon/:id/background", { bg_url: canvas.toDataURL(...) }). Add the route in Full/src/App.jsx and add it to the protected routes in Full/server.js (the protectedClientRoutes array).

Wire it from Inventory: in Full/src/pages/Inventory.jsx, in the modal for selected, add a button that navigates to the background-draw route with the progimon id (query string is simplest). Render it by wrapping the monster image in a div with style={{ backgroundImage: selected?.bg_url ? \url(${selected.bg_url})` : "none" }}`.  

Make it so you automatically own progis when u make them
Make the progipad per profile or dont, might be cute this way
if they dont own a progi, they cant make a progi pad for it
make a button to remake the progi pad