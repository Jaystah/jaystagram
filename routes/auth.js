const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

const {JWT_SECRET} = require('../keys');
const users = mongoose.model("Users");

const loginRequired = require('../middleware/requireLogin');


router.post("/signup",(req,res) => {
   const {name,email,password,pic} = req.body;

   if(!name || !email || !password){
      return res.status(422).json({
         error: "Please enter all the fields"
      });
   }

   users.findOne({email:email}).then((savedUser) =>{
      if(savedUser){
         return res.status(422).json({
            error: "The user with email " + email + ", already exists"
         });
      }
      bcryptjs.hash(password, 10).then((hashedPass) => {
         const user = new users({
            email,
            name,
            password: hashedPass,
            pic
         });
         user.save().then((user)=>{
            res.json({
               message: "Saved succesfully"
            })
         }).catch((err)=>{
            console.log(err);
         });
      })

   }).catch((err)=>{
      console.log(err);
   })
   
});

router.post("/signin",(req,res)=>{
   const {email,password} = req.body;
      if(!email || !password){
         res.status(422).json({error: "Please provide email and password"});
      }
   users.findOne({email:email}).then(savedUser=>{
      if(!savedUser){
         return res.status(422).json({error: "Invalid email or password"})
      }
      bcryptjs.compare(password, savedUser.password).then(
         function(match){
            if(!match){
               return res.status(422).json({error: "Invalid email or password"});
            }
           const token =  jwt.sign({_id : savedUser._id}, JWT_SECRET);
           const {_id,name,email,followers,following,pic} = savedUser;
           res.json({token,user:{
            _id,
            name,
            email,
            followers,
            following,
            pic
           }});
         }
      );
   })
});

module.exports = router;
