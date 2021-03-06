require("dotenv").config();

var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    app = express(),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer");
    cookieParser = require('cookie-parser'),

//  MOMENt adding
app.locals.moment = require("moment");

//App conifg    
var url = process.env.DATABASEURL || "mongodb://localhost/your_table";
mongoose.connect(url);
app.set("view engine", "ejs");
app.use(express.static("public"));
// app.use('/static', express.static(__dirname + '/static'))
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
   res.render("landing"); 
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
            res.render("new");
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
        
        //SMS SEND
         let text = {
          // To Number is the number you will be sending the text to.
          toNumber: '+1' + foundUser.phone,
          // From number is the number you will buy from your admin dashboard
          fromNumber: '+12183316746',
          // Text Content
          smsBody: 'Your table is ready. Please see the host within 5 mins', 
          apiToken: 'ap4yss'
        };

         puretext.send(text, function (err, response) {
            if(err) console.log(err);
            else console.log(response);
          });
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

// DELETE route
app.delete("/users/:id", function(req, res){
   User.findByIdAndRemove(req.params.id, function(err){
       if(err){
         res.redirect("/users");  
       } else {
         res.redirect("/users");
       }
   });
});



// app.listen(1337, '127.0.0.1', function(){
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("yourTable v2 Sever is running");
});
