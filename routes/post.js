const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const dataToFetch = "_id nane"
const Posts = mongoose.model("Posts"); 

const requireLogin = require('../middleware/requireLogin');


router.get("/seePosts",requireLogin,(req,res)=>{
Posts.find().populate("postedBy","_id name pic").populate("comments.postedBy","_id name").then(post=>{
    res.json({post})
});
})

router.get("/seeFollowedPosts",requireLogin,(req,res)=>{
Posts.find({postedBy:{$in:req.user.following}}).populate("postedBy","_id name p").populate("comments.postedBy","_id name").then(post=>{
    res.json({post})
});
})

router.post('/createPost', requireLogin,(req,res)=>{
    const {title,body,url} = req.body;

    if(!title || !body || !url){
        return res.status(422).json({error: "Please add all the fields"});
    }
    req.user.password = undefined;
    const post = new Posts({
        title,
        body,
        photo: url,
        postedBy: req.user
    });

  post.save().then(result=>{
      res.json({post: result});
  }).catch(error=>{
      console.log(error);
  })
})

router.get('/profile',requireLogin,(req,res)=>{
    Posts.find({postedBy: req.user._id}).populate('postedBy',"_id name")
    .then((post)=>{
        res.json({post});
    });
})

router.put("/like",requireLogin, (req,res) =>{
    Posts.findByIdAndUpdate(req.body.postId,{
        $push:{
            likes: req.user._id
        }
    }, {
        new: true
    }).populate("postedBy","_id name").populate("comments.postedBy","_id name").exec((err,result) =>
    {
        if(err){
            return res.status(422).json({error: err})
        }else{
            res.json(result);
        }
    })
});

router.put("/unlike",requireLogin, (req,res) =>{
    Posts.findByIdAndUpdate(req.body.postId,{
        $pull:{
            likes: req.user._id
        }
    }, {
        new: true
    }).populate("postedBy","_id name").populate("comments.postedBy","_id name").exec((err,result) =>
    {
        if(err){
            return res.status(422).json({error: err})
        }else{
            res.json(result);
        }
    })
});

router.put("/comment",requireLogin, (req,res) =>{
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Posts.findByIdAndUpdate(req.body.postId,{
        $push:{
            comments: comment
        }
    }, {
        new: true
    }).populate("comments.postedBy", "_id name").populate("postedBy", "_id name").exec((err,result) =>
    {
        if(err){
            return res.status(422).json({error: err})
        }else{
            res.json(result);
        }
    })
});

router.put("/deletecomment",requireLogin, (req,res) =>{
    console.log(req.body.commentId)
    Posts.findByIdAndUpdate(req.body.postId,{
        $pull:{
            comments: {
                _id: req.body.commentId
            }
        }
    }, {
        new: true
    }).populate("comments.postedBy", "_id name").populate("postedBy", "_id name").exec((err,result) =>
    {
        if(err){
            return res.status(422).json({error: err})
        }else{
            res.json(result);
        }
    })
});

router.delete("/deletepost/:postId",requireLogin,(req,res) => {
    Posts.findOne({_id: req.params.postId}).populate("postedBy", "_id").exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error: err})
        }
        if(post.postedBy._id.toString() == req.user._id.toString()){
            post.remove().then(result => {
                res.json(result)
            })
        }
    })
})

module.exports = router;