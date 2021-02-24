
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

//connecting to mongoDB
//can define a custom dabase name
mongoose.connect('mongodb+srv://Martin:sVtczoTlsEKkccoY@cluster0.sa3o8.mongodb.net/mean-stack-tutorialDB?retryWrites=true&w=majority')
    .then(() => {
        console.log('Connected to database!');
    })
    .catch(() => {
        console.log('Connection failed!');
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
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    next();
});

// adding middleware specifically handling POST requests
app.post('/api/posts', (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    //sending and saving data in mongoDB
    //monggose and mongoDB will automatically query the dabase and insert a new entry (document)
    post.save().then(createdPost => {
        res.status(201).json({
            message: 'Post added Successfully',
            postId: createdPost._id
            });
    });
});

// first argument in use() is a path filter for the url route of this api endpoint
 app.get('/api/posts', (req, res, next) => {
    //find() by default returns all entries from mongoDB
    Post.find().then((documents) => {
        res.status(200).json({
            message: 'Posts fetched successfully!',
            posts: documents
        });
    });
});

app.delete('/api/posts/:id', (req, res, next) => {
    Post.deleteOne({ _id: req.params.id}).then(result => {
        console.log(result);
        res.status(200).json({message: 'Post deleted!'});
    });
});


// setting up the node server to export the express serverside app
// reqister the express files to export in the module.export object: export the entire app including the attached middlewares:
module.exports = app;
