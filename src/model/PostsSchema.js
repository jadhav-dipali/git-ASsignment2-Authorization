const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    body:{
        type:String,
        require:true
    },
    image:{
        type:String,
        require:true,
    },
    userId:{
        type:String,
        require:true
    }
})

const Posts = new mongoose.model("Post" , postSchema);

module.exports = Posts;