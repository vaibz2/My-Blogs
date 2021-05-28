const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
const myPassword = ""; // add your new password here   

//connect to database
mongoose.connect("mongodb+srv://admin", {useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false});
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// DataBase schema
const postsSchema = new mongoose.Schema({
    title: String,
    content: String,
    postDate: String,
    imageUrl: String
});
const Post = mongoose.model("Post", postsSchema);

app.get("/", function(req, res){
  Post.find({}, function(err, result){
    if(err){
      console.log(err);
    } else {
      res.render("home", {postsData: result});
    }
  });
});

app.get("/compose", function(req, res){
  Post.find({}, function(err, result){
    if(err){
      console.log(err);
    } else {
      res.render("compose", {postsData: result});
    }
  });
});

app.post("/compose", function(req, res){
  const title_len = (req.body.postTitle).length;
  const content_len = (req.body.postContent).length;
  if(title_len === 0 || content_len === 0){
    res.redirect("/compose");
  } else {
    const months_list = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const today = new Date();
    const publishDate = months_list[today.getMonth()] + " " + today.getDate() + ", " + today.getFullYear();
    if(myPassword === req.body.password){
      const post = new Post({
        title: req.body.postTitle,
        content: req.body.postContent,
        postDate: publishDate,
        imageUrl: req.body.image_url
      });
      post.save();
      res.redirect("/");
    } 
    else {
      res.redirect("/compose");
    }
  }
});

app.get("/posts/:postName", function(req, res){
  const paramName = _.lowerCase(req.params.postName);
  Post.find({}, function(err, result){
    if(err){
      console.log(err);
    } else {
      result.forEach(function(aPost){
        const currentTitle = _.lowerCase(aPost.title);
        if(currentTitle === paramName){
          res.render("post", {clickedPost: aPost});
        }
      });
    }
  });
});  

app.get("/delete", function(req, res){
  Post.find({}, function(err, result){
    if(err){
      console.log(err);
    } else {
      res.render("delete", {postsData: result});
    }
  });
});

app.post("/delete", function(req, res){
  const delPostId = req.body.btn;
  if(myPassword === req.body.password){
    Post.findByIdAndRemove(delPostId, function(err){
      if(err){
        console.log(err);
      } else {
        res.redirect("/delete");
      }
    });
  } else {
      res.redirect("/delete");
  }
});

 let port = process.env.PORT;
 if(port == null || port == ""){
  port = 3000;
 }

app.listen(port, function() {
  console.log("Server started on port 3000");
});