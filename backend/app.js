
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// using a new middleware on the incoming request
// after next() the request continues and the next middleware function can execute
// res.send() sends a response to an http request
// app.use() adding a general middleware, can handle all requests and server side logic

//adding body-parser middleware to parse all incoming request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// adding middleware for enable CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    next();
});

// adding middleware specifically handling POST requests
app.post('/api/posts', (req, res, next) => {
    const post = req.body;
    console.log(post);
    res.status(201).json({
        message: 'Post added Successfully'
    });
});

// first argument in use() is a path filter for the url route of this api endpoint
 app.get('/api/posts', (req, res, next) => {
    const posts = [
        { 
            id: 'fewrdf234324', 
            title: 'First server side post', 
            content: 'This is coming from the server' 
        },
        { 
            id: 'jituzijk5464', 
            title: 'Second server side post', 
            content: 'This is coming from the server!' 
        }
    ];
    res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: posts
    });
});


// setting up the node server to export the express serverside app
// reqister the express files to export in the module.export object: export the entire app including the attached middlewares:
module.exports = app;
