const mongoose = require("mongoose");
const initdata = require("./data.js");
const listing = require("../models/listing.js");

main()
    .then(() => {
        console.log("Database connection established");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
    console.log("Connected to MongoDB");
}

const initDb = async () => {

        await listing.deleteMany({});
        // Insert new listings from data
        initdata.data=initdata.data.map((obj) => ({ ...obj, owner:"6856f84bfec7b9da64b0c4ad" }));
        await listing.insertMany(initdata.data);
        console.log("Database initialized with sample data");
    
}

initDb();