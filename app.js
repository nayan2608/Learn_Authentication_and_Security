//jshint esversion:6

const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/userDB');
}

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})


const User = mongoose.model('User', userSchema);

app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    const newuser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newuser.save(function(err){
        if (!err){
            res.render("secrets");
        }
        else{
            console.log(err);
        }
    });
})

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function(err, founduser){
        if (err){
            console.log(err);
        }
        else {
            if (founduser){
                if(founduser.password === password){
                    res.render("secrets");
                }
            }
        }
    });
})


app.listen(3000, function(){
    console.log("server is running");
})