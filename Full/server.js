// server.js

const http = require("http");

num_visits = 0;
const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');

const session = require("express-session");
const MongoStore = require("connect-mongo").default;



main();
async function main() {
   mongoose.connect('mongodb://localhost/progimon');
   app.use(express.json());
   app.use(express.urlencoded({ extended: true }));
   

   app.use(cors());
   //app.use(express.static("Public"));

   
   app.use(
      session({
         secret: "progimon-secret", // change this to a strong secret in production .env
         name: "progimon.sid",
         resave: false,
         saveUninitialized: false,
         store: MongoStore.create({ mongoUrl: "mongodb://localhost/progimon" }),
         cookie: {
            httpOnly: true,
            sameSite: "lax",
            secure: false, // set true when HTTPS
            maxAge: 1000 * 60 * 60 * 24 * 7,
         },
         
      }));


     app.use((req, res, next) => {
         const publicPages = ["/index.html", "/register.html"];
      
         if (
            req.path.endsWith(".html") &&
            !publicPages.includes(req.path) &&
            !req.session?.userId
         ) {
            return res.redirect("/index.html");
         }
      
         next();
      });
      

      app.use(express.static("public"));

      

      function requireAuth(req, res, next) {
         if (req.session.userId === undefined) {
            return res.redirect('/index.html');
         }
         next();
      }
      
      // :white_check_mark: LOGIN ROUTE — MUST BE HERE
      
      
      app.get("/", function(req, res){
         res.sendFile('index.html', { root: path.join(__dirname, 'public') });
         
      });
      
      app.get("/api/register",async function(req, res){
         
         res.sendFile('register.html', { root: path.join(__dirname, 'public') });
         
      });

      // Protected routes - require authentication
      

   app.get("/gameHome", requireAuth, (req, res) => {
      res.sendFile(path.join(__dirname, "public", "gameHome.html"));
   });

   app.get("/progiRoom", requireAuth, (req, res) => {
      res.sendFile(path.join(__dirname, "public", "ProgiRoom.html"));
   });

   app.get("/progiFood", requireAuth, (req, res) => {
      res.sendFile(path.join(__dirname, "public", "ProgiFood.html"));
   });

   app.get("/inventory", requireAuth, (req, res) => {
      res.sendFile(path.join(__dirname, "public", "Inventory.html"));
   });

   app.get("/lookup", requireAuth, (req, res) => {
      res.sendFile(path.join(__dirname, "public", "LookUp.html"));
   });

   app.get("/draw", requireAuth, (req, res) => {
      res.sendFile(path.join(__dirname, "public", "draw.html"));
   });

   app.get("/dum", requireAuth, (req, res) => {
      res.sendFile(path.join(__dirname, "public", "dum.html"));
   });

   app.get("/reactTest", requireAuth, (req, res) => {
      res.sendFile(path.join(__dirname, "public", "ReactTest.html"));
   });




      //login route and logout route
      app.post("/login", async (req, res) => {
         try {const { User, password } = req.body;
         
         const account = await Accounts.findOne({ User: User });
         
         if (!account) {
            return res.json({ success: false });
         }
         
         const match = await bcrypt.compare(password, account.PasswordHash);
         if (!match) {
            return res.json({ success: false });
         }
         
         req.session.userId = account._id;
         res.json({ success: true });
         
      } catch (err) {
         console.error(" Login error:", err);
         res.status(500).json({ success: false });
      }
   });
   
   app.post("/logout", (req, res) => {
      req.session.destroy((err) => {
         if (err) return res.status(500).json({ error: "Logout failed" });
         
         res.clearCookie("progimon.sid");
         res.json({ message: "Logged out" });
      });
   });





   // Define Mongoose schemas and models
   const AccountSchema = new mongoose.Schema({ 
      User: {type: String, required: true},
      Email: {type: String, required: true},
      PasswordHash: { type: String, required: true },
   });
   const progimonSchema = new mongoose.Schema({ 
      name: {type: String, required: true},
      level: {type: Number, required: true},
      img_url: {type: String, required: true},
      parentUser: {type: String, required: true} // username of owner maybe link to acc page
   });
   const Progimon = mongoose.model("Progimon", progimonSchema);
   const Accounts = mongoose.model("Accounts", AccountSchema);
   
   // Return all progimon as JSON
   //GET JSON
   app.get('/api/progimon', async function(req, res){
      try{
         const progimon = await Progimon.find();
         res.json(progimon);
      }catch(err){
         console.error('Failed to get progimon', err);
         res.status(500).send({ error: 'Server error' });
      }
   });
   //--
   //DANGEROUS TO KEEP DELETE LATER
   app.get("/api/ACCOUNTSDEV", async (req, res) => {
      try {
         const accounts = await Accounts.find();
         res.json(accounts);
      } catch (err) {
         res.status(500).send({ error: "Server error" });
      }
   }); 
   
   //POST
/*    app.post("/api/progimon", requireAuth, async (req, res) => {
      console.log(req)
      const progi = await Progimon.create(req.body);
      return res.redirect("/dum.html");
      //res.send(progi + " said, 'it's progin' time' and progied all over the place.");
   }); */
   app.post("/api/progimon", requireAuth, async (req, res) => {

    const progi = await Progimon.create({
        name: req.body.name,
        level: req.body.level,
        img_url: req.body.img_url,
        parentUser: req.session.userId   // 🔥 attach session user
    });

    return res.redirect("/dum.html");
});
   //--
   app.post("/api/ACCOUNTSDEV", async (req, res) => {
      try {
         const { User, Email, Password } = req.body;
         
         // Basic validation
         if (!User || !Email || !Password) {
            return res.status(400).send({ error: "Missing fields homie" });
         }
         
         // Prevent duplicate usernames/emails (simple check)
         const existing = await Accounts.findOne({
            $or: [{ User }, { Email }],
         });
         if (existing) {
            return res.status(409).send({ error: "Sorry brah! I already know someone like that!" });
         }
         
         const PasswordHash = await bcrypt.hash(Password, 12);
         
         const newAccount = await Accounts.create({
            User,
            Email,
            PasswordHash,
         });
         
         // Optional: auto-login right after register
         req.session.userId = newAccount._id.toString();
         req.session.username = newAccount.User;

         return res.redirect("/draw");

         
         //res.status(201).send({ message: "Welcome to the world of Progis man!", user: newAccount.User });
      } catch (err) {
         console.error(err);
         res.status(500).send({ error: "Server error brodie" });
      }
   });
   
   //PUT
   //showcase?
   app.put("/api/progimon/:id", async function(req, res){
      newProgimon = req.body;
      id = req.params.id;
      progi = await Progimon.findById(id);
      
      if(progi){ // progimon exists
         await Progimon.updateOne({_id: id}, {$set: newProgimon});
         progi = await Progimon.findById(id);
         res.send({"id": progi["_id"], "progimon": progi});
      }else{
         res.status(404).send({"error": 404, "msg":"Dude, I like- called out super loud for this guy and he's not here! Maybe bro doesn't exist!."});
      }
   });
   //--
   app.put("/api/ACCOUNTSDEV/:id", async function(req, res){
      newAccount = req.body;
      id = req.params.id;
      account = await Accounts.findById(id);
      
      if(account){ // account exists
         await Accounts.updateOne({_id: id}, {$set: newAccount});
         account = await Accounts.findById(id);
         res.send({"id": account["_id"], "account": account});
      }else{
         res.status(404).send({"error": 404, "msg":"Does bro even exist yet? I don't see them in my omniscient awareness of all users."});
      }
   });
   
   //get by id  
   app.get("/api/progimon/:id", async function(req, res){
      id = req.params.id;
      try{progimon = await Progimon.findById(id);
         if(progimon){
            console.log(progimon);
            res.send(progimon);
         }}catch(error){
            console.log(error);
            console.log("lmfao");
            res.status(404).send({"error": 404, "msg":"Dude, I like- called out super loud for this guy and he's not here! Maybe bro doesn't exist!."});      }
         });
         //--
         app.get("/api/ACCOUNTSDEV/:id", async function(req, res){
            id = req.params.id;
            try{account = await Accounts.findById(id);
               if(account){
                  console.log(account);
                  res.send(account);
               }}catch(error){
                  console.log(error);
                  console.log("lmfao");
                  res.status(404).send({"error": 404, "msg":"Does bro even exist yet? I don't see them in my omniscient awareness of all users."});      }
               });
               //protected map route
               //might not work
               app.get("/map", requireAuth, (req, res) => {
                  res.sendFile("map.html", { root: path.join(__dirname, "public") });
               });            
               
               //delete
               app.delete("/api/progimon/:id", async function(req, res){
                  id = req.params.id;
                  progimon = await Progimon.findById(id);
                  if(progimon){
                     try{
                        await Progimon.deleteOne({_id: id});
                        res.send({"message":`Progimon of id=${id} has been deleted. 'G night lil' dude! See ya in cyberspace!`, "response_code":200});
                     }catch(err){
                        console.error
                        res.status(500).send(err); 
                     }
                  }else{
                     res.status(404).send({"error": 404, "msg":"Error! Bro doesn't wanna sleep just yet!"});
                  }});        
                  //--
                  app.delete("/api/ACCOUNTSDEV/:id", async function(req, res){
                     id = req.params.id;
                     account = await Accounts.findById(id);
                     if(account){
                        try{
                           await Accounts.deleteOne({_id: id});
                           res.send({"message":`Account of id=${id} has been deleted. Hope ya had fun!`, "response_code":200});
                        }catch(err){
                           console.error
                           res.status(500).send(err); 
                        }
                     }else{
                        res.status(404).send({"error": 404, "msg":"Error! Brodie doesn't wanna sleep just yet!"});
                     }});  

                     //who am I test
                     app.get("/api/me", (req, res) => {
                        if (!req.session.userId) {
                           return res.status(401).json({ loggedIn: false, message: "Not logged in req.session.userId is " + req.session.userId });
                        }
                        res.json({
                           loggedIn: true,
                           userId: req.session.userId,
                           username: req.session.username,
                        });
                     });
                     
                     //middleware
                     
                     
                     
                     
                     
                     app.listen(3000, function(){ 
                        console.log("its progin' time (port 3000)");
                     });
                  }//last line of main
                  