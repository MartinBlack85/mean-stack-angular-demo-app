
const express = require("express");

const Post = require("../models/post");

// setting up express router
const router = express.Router();


// adding middleware specifically handling POST requests
// instead of app. post, in router we use router.post()
// router path gets pre-filtered app.js
router.post("", (req, res, next) => {
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

router.put("/:id", (req, res, next) => {
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    });
    // finds the record in database based on the id fetched from the dinamic url, saves it based on the object
    Post.updateOne({ _id: req.params.id }, post).then(result => {
        res.status(200).json({message: 'Update was successful!'});
    });
});

// first argument in use() is a path filter for the url route of this api endpoint
 router.get("", (req, res, next) => {
    //find() by default returns all entries from mongoDB
    Post.find().then((documents) => {
        res.status(200).json({
            message: 'Posts fetched successfully!',
            posts: documents
        });
    });
});

router.get("/:id", (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if(post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({message: 'Post not found!'});
        }
    })
});

router.delete("/:id", (req, res, next) => {
    Post.deleteOne({ _id: req.params.id}).then(result => {
        console.log(result);
        res.status(200).json({message: 'Post deleted!'});
    });
});

module.exports = router;