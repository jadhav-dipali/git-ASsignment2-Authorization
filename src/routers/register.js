const express= require("express")
const Register = require("../model/registerSchema")
const router = new express.Router();
const Posts = require("../model/PostsSchema")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRATE_KEY = process.env.SECRATE_KEY;


router.post("/register"  ,async(req,res)=>{
    try{
        let strongPass = await bcrypt.hash(req.body.password , 10)//
        let data1 = new Register({name:req.body.name,
            email:req.body.email,
            password: strongPass
        })
     let createData = await data1.save();
     res.status(201).send(createData);
    }catch(err){
        res.status(400).send(err.message);
    }
})

router.get("/register" , async(req,res)=>{
    try{
       let readData = await Register.find();
       res.status(200).send(readData)
    }catch(err){
        res.status(400).send(err.message)
    }
})


router.post("/login" , async(req, res)=>{
    try{
        let user = await Register.findOne({email:req.body.email})//
        if(user){
            let matchPass = await bcrypt.compare(req.body.password, user.password)//true
            if(matchPass){
              const token = await jwt.sign({_id:user._id}, SECRATE_KEY);
              res.status(200).send({status:"Successfully login" , token:token})
            }else{
                res.status(401).send("User Details Not Match")
            }
        }else{
            res.status(401).send("User not found")
        }
    
    }catch(err){
        res.status(400).send(err.message);
    }
})



router.post("/posts" , async(req,res)=>{
    try{
      if(req.headers.authorization){
        let userVar = jwt.verify(req.headers.authorization, SECRATE_KEY)//id idt //
        let data = new Posts(
        {  
            userId:userVar._id,//id 
            title:req.body.title,
            body:req.body.body,
            image:req.body.image
        })
        let createPost =await data.save();
        res.status(201).send({status:"You successfully create data",createPost});
      }
    }catch(err){
        res.status(400).send(err.message)
    }
})


router.get("/posts" , async(req,res)=>{
    try{
      if(req.headers.authorization){
        let readData = await Posts.find();
        res.status(200).send(readData);
      }else{
        res.status(401).send({message:"unauthorized User"}) 
      }
    }catch(err){
        res.status(400).send(err.message)
    }
})




router.put("/posts/:id", async(req,res)=>{
    try{
        if(req.headers.authorization){
      let userVar = jwt.verify(req.headers.authorization, SECRATE_KEY)//id
      let _id =req.params.id;//post id
      let post = await Posts.findOne({_id:_id});//user id
      if(post){
        if(userVar._id===post.userId){//tokan id === user id
            let updateData =  await Posts.findByIdAndUpdate(_id,req.body,{new:true})
             res.status(200).send({status:"You successfully update data" , updateData})
           }else{
            res.status(401).send("you can`t update the post")
           }
      }else{
        res.status(401).send({message:"Invalid Data"}) 
      }
     
     }
    }catch(err){
        res.status(400).send(err.message);
    }
})



router.delete("/posts/:id", async(req,res)=>{
    try{
      if(req.headers.authorization){
      let userVar = jwt.verify(req.headers.authorization, SECRATE_KEY)
      let _id =req.params.id;
      let post = await Posts.findOne({_id:_id});
      if(post){
        if(userVar._id===post.userId){
            let deleteData =  await Posts.findByIdAndDelete(_id)
             res.status(200).send({status:"SuccessFully Deleted Data",deleteData})
           }else{
            res.status(401).send("you can`t delete the post")
           }
        }
        else{
            res.status(401).send({message:"invalid Data"}) 
        }
      
     }
     else{
        res.status(401).send("you can`t delete the post") 
     }
    }catch(err){
        res.status(400).send(err.message);
    }
})










module.exports = router;