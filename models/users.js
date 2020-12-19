const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;
const userSchema = mongoose.Schema({
   name: {
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true
   },
   password: {
      type: String,
      required: true
   },
   followers: [
      {type: ObjectId, ref: "Users"}
   ] ,
   following: [
      {type: ObjectId, ref: "Users"}
   ] ,
   pic:{
      type: String,
      default: "https://euroavia-oostende.eu/home/wp-content/uploads/2017/09/img_profile.png"
   }
});

mongoose.model("Users", userSchema);