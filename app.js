const express = require('express');
const mongoose = require('mongoose');

const app = express();

const keys = require('./config/keys.js');

mongoose.connect(keys.MONGOURL, {
   useNewUrlParser: true,
   useUnifiedTopology: true
});

mongoose.connection.on("connected",function(){
console.log("Succesfully connected");
})

mongoose.connection.on("error",function(err){
   console.log("Error: ", err);
})
require("./models/users");
require("./models/post");
app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));

const PORT = process.env.PORT || 6969;

if(process.env.NODE_ENV=="production"){
   app.use(express.static('client/build'))
   const path = require('path');
   app.get("*",(req,res)=>{
      res.sendFile(path.resolve(__dirname, 'client','build','index.html'));
   })
}

app.listen(PORT, ()=>{
   console.log("Server runned op ",PORT);
})