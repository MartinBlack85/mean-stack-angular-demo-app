
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//importing the pots routes from the router file component
const postsRoutes = require("./routes/posts");

const app = express();

//connecting to mongoDB
//can define a custom dabase name
mongoose.connect("connectionString")
    .then(() => {
        console.log("Connected to database!");
    })
    .catch(() => {
        console.log("Connection failed!");
    });

// using a new middleware on the incoming request
// after next() the request continues and the next middleware function can execute
// res.send() sends a response to an http request
// app.use() adding a general middleware, can handle all requests and server side logic

//adding body-parser middleware to parse all incoming request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// adding middleware for enable CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
});

//setup the posts router for use in express
app.use("/api/posts", postsRoutes);


// setting up the node server to export the express serverside app
// reqister the express files to export in the module.export object: export the entire app including the attached middlewares:
module.exports = app;
