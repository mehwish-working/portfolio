const express = require('express');
const path = require('path');
const body_parser = require('body-parser');
const mongoose = require('mongoose');
const { inherits, parseArgs } = require('util');
//npm i init
//npm i mongoose
//npm i express
//npm i body-parser
//npm i nodemon
//package.json
//npm index.js ->to run
const App = express();

App.use(body_parser.urlencoded({
    extended: true
}));

// Serve static files from the "public" directory
App.use(express.static(path.join(__dirname, 'public')));

mongoose.connect("mongodb://127.0.0.1:27017/portfolioDatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (err) => {
    console.error("Database is not connected!", err);
});

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String
});


const user = mongoose.model("visitor", userSchema);

App.post("/submit", async (req, res) => {
    const { name, email,message } = req.body;
    try {
        const newUser = new user({
            name,
            email,
            message,
        });
        await newUser.save();
        res.sendFile(path.join(__dirname, 'public', 'submit.html'));
    } catch (err) {
        console.log("Error saving new user!", err);
        res.status(500).send("Error saving user");
    }
});

App.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

App.listen(8002, () => {
    console.log("Server connected on port 8002!");
});