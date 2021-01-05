const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const users = mongoose.model("Users")

const {JWT_SECRET} = require('../config/keys');
module.exports = (req,res,next) =>{

   const {authorization} = req.headers;
   if(!authorization){
      return res.status(401).json({error: "You need to login for this page"});
      
   }

   const token = authorization.replace("Bearer ","");
   jwt.verify(token,JWT_SECRET, (err,payload)=>{
      if(err){
         return res.status(401).json({error: "You need to login for this page"});
      }
      const {_id} = payload;
      users.findById(_id).then((foundUser)=>{
         req.user = foundUser;
         next();
      });
      
   })
}