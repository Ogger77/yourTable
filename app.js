var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    app = express(),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer");
    
//  MOMENt adding
app.locals.moment = require("moment");

//App conifg    
mongoose.connect("mongodb://localhost/your_table");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//SMS config
const puretext = require('puretext');
  require('request');

  

//Mongoose/model config
var userSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    number: String,
    phone: {type: String, required: true},
    note: String,
    created: {type: Date, default: Date.now}
});
var User = mongoose.model("User", userSchema);

//RESTful route
app.get("/", function(req, res){
   res.redirect("/users"); 
});

// INDEX route
app.get("/users", function(req, res){
    User.find({}, function(err, users){
        if(err){
            console.log("ERROR!!!");
        } else {
            res.render("index", {users: users});
        }
    });
});

app.get("/users", function(req, res){
    res.render("index");
});



// NEW route
app.get("/users/new", function(req, res){
    res.render("new");
});

//CREATE route
app.post("/users", function(req, res){
    User.create(req.body.user, function(err, newUser){
        if(err){
            res.render("index");
        } else {
            res.redirect("/users");
        }
    });
});

// SHOW route
app.get("/users/:id", function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            res.redirect("/users");
        } else {
            res.render("show", {user: foundUser});
        }
    });
});

// EDIT route
app.get("/users/:id/edit", function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            res.redirect("/users");
        } else{
            res.render("edit", {user: foundUser});
        }
    });
});

// UPDATE route
app.put("/users/:id", function(req, res){
    User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedUser){
        if(err){
            res.redirect("/users");
        } else {
            res.redirect("/users/" + req.params.id);
        }
    });
});

// DELETE rpute
app.delete("/users/:id", function(req, res){
   User.findByIdAndRemove(req.params.id, function(err){
       if(err){
         res.redirect("/users");  
       } else {
         res.redirect("/users");
       }
   });
});

//SMS route

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("yourTable v2 Sever is running");
});
