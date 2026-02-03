// server.js
const http = require("http");

num_visits = 0;
const express = require("express");
const app = express();
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
   // Parse URL-encoded bodies (from HTML forms)
   app.use(express.urlencoded({ extended: true }));
   app.use(
      session({
         name: "progimon.sid",
         secret: process.env.SESSION_SECRET || "dev-only-secret-change-me",
         resave: false,
         saveUninitialized: false,
         store: MongoStore.create({ mongoUrl: "mongodb://localhost/progimon" ,
            collectionName: "sessions",
            ttl: 60 * 60 * 24 * 7, // 7 days
         }),
         cookie: {
            httpOnly: true,
            sameSite: "lax",
            secure: false, // set true when HTTPS
            maxAge: 1000 * 60 * 60 * 24 * 7,
         },
      })
   );
   app.use(cors());
   app.use(express.static("Public"));
   
   app.get("/", function(req, res){
      res.sendFile('index.html', { root: path.join(__dirname, 'public') });
      
   });
   
   app.get("/api/register",async function(req, res){
      
      res.sendFile('register.html', { root: path.join(__dirname, 'public') });
      
   });
   
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
   app.post("/api/progimon", requireAuth, async (req, res) => {
      console.log(req)
      const progi = await Progimon.create(req.body);
      res.send(progi + " said, 'it's progin' time' and progied all over the place.");
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
         
         res.status(201).send({ message: "Welcome to the world of Progis man!", user: newAccount.User });
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
                     //AUTH ROUTES login stuff              
                     app.post("/api/login", async (req, res) => {
                        try {
                           const { User, Password } = req.body;
                           if (!User || !Password) {
                              return res.status(400).json({ error: "Missing credentials" });
                           }
                           
                           const account = await Accounts.findOne({ User });
                           if (!account) return res.status(401).json({ error: "Invalid login" });
                           
                           const ok = await bcrypt.compare(Password, account.PasswordHash);
                           if (!ok) return res.status(401).json({ error: "Invalid login" });
                           
                           // ✅ Create session
                           req.session.userId = account._id.toString();
                           req.session.username = account.User;
                           
                           res.json({ message: "Logged in", user: account.User });
                        } catch (err) {
                           console.error(err);
                           res.status(500).json({ error: "Server error brodie " });
                        }
                     });
                     app.post("/api/logout", (req, res) => {
                        req.session.destroy((err) => {
                           if (err) return res.status(500).json({ error: "Logout failed" });
                           
                           res.clearCookie("progimon.sid");
                           res.json({ message: "Logged out" });
                        });
                     });
                     //who am I test
                     app.get("/api/me", (req, res) => {
                        if (!req.session.userId) {
                           return res.status(401).json({ loggedIn: false });
                        }
                        res.json({
                           loggedIn: true,
                           userId: req.session.userId,
                           username: req.session.username,
                        });
                     });
                     
                     //middleware
                     function requireAuth(req, res, next) {
                        if (!req.session.userId) {
                           return res.status(401).send("Not logged in");
                        }
                        next();
                     }
                     
                     
                     
                     
                     
                     app.listen(3000, function(){
                        console.log("its progin' time (port 3000)");
                     });
                  }//last line of main
                  