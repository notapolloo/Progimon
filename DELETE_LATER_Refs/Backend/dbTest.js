const mongoose = require('mongoose');

main();
console.log("DB THis happens before chickens happens");
async function main() {
    mongoose.connect('mongodb://localhost/newdb');
    
    const chickenSchema = new mongoose.Schema({
        name: {type: String, required: true },
        age: {type: Number, required: true },
        color: {type: String, required: true }
    });
    
    
    const Chiciken = mongoose.model("Chicken", chickenSchema);
    //Chicken.find().then((chickens) => console.log(chickens));
    const chickens = await chickenSchema.find();
}