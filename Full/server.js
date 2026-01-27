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
}
