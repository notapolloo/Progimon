// server.js
const http = require("http");

num_visits = 0;
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const cors = require("cors");
const path = require('path');

//Notes:
/*
When trying to reach the data base use / in front of the data base name like so:
mongoose.connect('mongodb://localhost/progimon');

// Return all monsters as JSON
app.get('/api/monsterz', async function(req, res){
try{
const monsters = await Monsterz.find();
res.json(monsters);
}catch(err){
console.error('Failed to get monsters', err);
res.status(500).send({ error: 'Server error' });
}
});

*/

main(); 
async function main() {
   mongoose.connect('mongodb://localhost/progimon');
   app.use(express.json());
   // Parse URL-encoded bodies (from HTML forms)
   app.use(express.urlencoded({ extended: true }));
   app.use(cors());
   app.use(express.static(path.join(__dirname, 'public')));
   
   
   app.get("/", function(req, res){
      res.sendFile('index.html', { root: path.join(__dirname, 'public') });
      
   });
   
   app.get("/api/register",async function(req, res){
      
      res.sendFile('register.html', { root: path.join(__dirname, 'public') });
      
   });
   
   const AccountSchema = new mongoose.Schema({ 
      User: {type: String, required: true},
      Password: {type: String, required: true},
      UserID: {type: Number, required: true}
   });
   const progimonSchema = new mongoose.Schema({ 
      name: {type: String, required: true},
      level: {type: Number, required: true},
      ObjectID: {type: String, required: true}
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
      app.get('/api/ACCOUNTSDEV', async function(req, res){
      try{
         const Accounts = await Accounts.find();
         res.json(Accounts);
      }catch(err){
         console.error('Failed to get accounts', err);
         res.status(500).send({ error: 'Server error' });
      }
   });  

   //POST
   app.post('/api/progimon', async function(req, res){
      console.log(req)
      progi = await Progimon.create(req.body);
      res.send(progi + " said, 'it's progin' time' and progied all over the place.");
   });
   //--
   app.post('/api/ACCOUNTSDEV', async function(req, res){
      console.log(req)
      progi = await Accounts.create(req.body);
      res.send(progi + " said, 'Welcome to the world of Progis man!'");
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
            
            
            
            
            
            
            
            
            app.listen(3000, function(){
               console.log("its progin' time (port 3000)");
            });
         }//last line of main
         