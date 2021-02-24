//creating the post model using mongoose

const mongoose = require('mongoose');

//creating a schema - blueprint with mongoose
//custom js object will hold the configuration
//using vanilla javascript type notation do define the property types
const postSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true }
});

//turning the definition into a model:
//first argument is  the name of the model, second argument is the schema we want to use
//the model also provides a constructor function to able to isntantiate the model as a class in other files
//the model can be used outside of this file
//the Collection name in mongoDB will be lowercase and plural version of the model name (posts)
module.exports = mongoose.model('Post', postSchema);