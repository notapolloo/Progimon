// server.js
const http = require("http");

num_visits = 0;
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const cors = require("cors");
const path = require('path');
   

main();
async function main() {
   
   mongoose.connect('mongodb://localhost/newdb');
   app.use(express.json());
   // Parse URL-encoded bodies (from HTML forms)
   app.use(express.urlencoded({ extended: true }));
   app.use(cors());
   app.use(express.static(path.join(__dirname, 'public')));   
   app.set("view engine", "pug");
   
   //main page
   app.get("/", function(req, res){
      res.sendFile('i.html', { root: path.join(__dirname, 'public') });
      
   });
   //--------------------------------------------------------------
   app.get("/api/monster",async function(req, res){
      
      //monsters = await getMonsterz();
      //res.send(monsters);
      
      res.sendFile('m.html', { root: path.join(__dirname, 'public') });
      
   });
   
   app.get("/api/make",async function(req, res){
      
      res.sendFile('c.html', { root: path.join(__dirname, 'public') });

   });
      async function getMonsterz() {
     /* console.log('About to delay for literally no reason...');
      await sleep(2000); // Pause for 2 seconds
      console.log('Pointless delay over');
      */
      return await Monsterz.find();
   }   
   //---------------------------------------------------
   const chickenSchema = new mongoose.Schema({
      name: {type: String, required: true },
      age: {type: Number, required: true },
      color: {type: String, required: true }
   });
   
   const monsterzSchema = new mongoose.Schema({ 
      name: {type: String, required: true },
      country: {type: String, required: true },
      type: {type: String, required: true }
   });
   
   const Monsterz = mongoose.model("Monsterz", monsterzSchema);
   const Chicken = mongoose.model("Chicken", chickenSchema);
  
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
   //---------------------------------------------------
   monsterz= {
      1: {"name":"Godzilla", "country":"Japan", "type":"Lizard"},
      2: {"name":"Mothra", "country":"Japan", "type":"Moth"},
      3: {"name":"King Kong", "country":"USA", "type":"Ape"},
      4: {"name":"Deminique", "country": "China", "type":"Dragon"}
   }
   chickens =  {
      1: {"name":"Craig"},
      2: {"name":"Johhny"},
      3: {"name":"Chiquita"}
   };
   next_id = 4;
   
   app.post("/api/chicken", async function(req, res){
      chicken = await Chicken.create(req.body);
      res.send({  "msg":"Chicken created successfully", "id": chicken["_id"], "chicken": chicken });
   });
   

   // DON'T COPY THIS STUFFS 
   app.post("/api/monsterz", async function(req, res){
      console.log(req)
      monster = await Monsterz.create(req.body);
      res.send({  "msg":"A monster is born", "id": monster["_id"], "monster": monster });
   });

   
   //--------------------------------------------------------------
   app.put("/api/chicken/:id", async function(req, res){
      newChicken = req.body;
      id = req.params.id;
      chicken = await Chicken.findById(id);
      if(chicken){ // chicken exists
         
         await Chicken.updateOne({_id: id}, {$set: newChicken});
         chicken = await Chicken.findById(id);
         res.send({"id": chicken["_id"], "chicken": chicken});
      }else{
         res.status(404).send({"error": 404, "msg":"Are you dumb? This chicken does not exist."});
      }
   });
   app.put("/api/monsterz/:id", async function(req, res){
      newMonster = req.body;
      id = req.params.id;
      monster = await Monsterz.findById(id);
      
      if(monster){ // monster exists
         await Monsterz.updateOne({_id: id}, {$set: newMonster});
         monster = await Monsterz.findById(id);
         res.send({"id": monster["_id"], "monster": monster});
      }else{
         res.status(404).send({"error": 404, "msg":"This monster sleeps in the crevices of the earth. Create it first."});
      }
   });
   
   //--------------------------------------------------------------
   
   app.get("/api/chickens/:filter",async function(req, res){
      
      const filter = JSON.parse(req.params.filter);
      console.log(filter);
      chickens;
      chickens = await Chicken.find(filter);
      res.send(chickens);
   });
   
   app.get("/api/monsterz/:filter",async function(req, res){
      const filter = JSON.parse(req.params.filter);
      console.log(filter);
      monsterz;
      monsterz = await Monsterz.find(filter);
      res.send(monsterz);
   });
   
   
   app.get("/api/chicken/:id", async function(req, res){
      id = req.params.id;
      try{chicken = await Chicken.findById(id);
         if(chicken){
            console.log(chicken);
            res.send(chicken);
            
         }}catch(error){
            console.log(error);
            console.log("lmfao");
            res.status(404).send({"error": 404, "msg":"Are you dumb? This chicken does not exist."});      }
         }); 
         
         app.get("/api/monsterz/:id", async function(req, res){
            id = req.params.id;
            try{monster = await Monsterz.findById(id);
               if(monster){
                  console.log(monster);
                  res.send(monster);
               }}catch(error){
                  console.log(error);
                  console.log("lmfao");
                  res.status(404).send({"error": 404, "msg":"This monster sleeps in the crevices of the earth. Create it first."});      }
               });
               
               //--------------------------------------------------------------         
               
               app.delete("/api/chicken/:id", async function(req, res){
                  id = req.params.id;
                  chicken = await Chicken.findById(id);
                  if(chicken){
                     try{
                        await Chicken.deleteOne({_id: id});
                        res.send({"message":`eated chicken of id=${id}`, "response_code":200});
                     }catch(err){
                        console.error(err);
                        res.status(500).send(err);
                     }
                  }else{
                     res.status(404).send({"error": 404, "msg":"Are you dumb? This chicken does not exist."});
                  }
               });
               
               app.delete("/api/monsterz/:id", async function(req, res){
                  id = req.params.id;
                  monster = await Monsterz.findById(id);
                  if(monster){
                     try{
                        await Monsterz.deleteOne({_id: id});
                        res.send({"message":`slain monster of id=${id}`, "response_code":200});
                     }catch(err){
                        console.error
                        res.status(500).send(err); 
                     }
                  }else{
                     res.status(404).send({"error": 404, "msg":"You missed."});
                  }});
                  
                  
                  
                  
                  app.listen(3000, function(){
                     console.log("les get it");
                  });
               }
               
               
               
