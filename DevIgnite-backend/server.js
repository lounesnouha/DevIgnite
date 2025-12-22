const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');  

const db_url = 'mongodb://localhost:27017';  

const client = new MongoClient(db_url);

const connectDB = async () => {
    try {
        await client.connect();
        console.log("The database has been connected successfully");

        const db = client.db("main");  
        console.log("Using DB: main");
        
    } catch (error) {
        console.log("An error occurred while connecting to the database:", error);
    }
};

connectDB();

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
