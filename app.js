const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname+"/date.js");
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static('public'));

mongoose.connect("mongodb+srv://ak8923307022:Akash123@cluster0.ulu0n2f.mongodb.net/todolistDB")


const userSchima = {
    email:{type:String,  unique: true},
    password:String,
    list:[String]
}

const User = mongoose.model("User",userSchima);

app.get("/",function(req,res){
    res.render("register",{status:""});
})


app.get("/login",function(req,res){
    res.render("login",{loginStatus:"     "});
})

app.get("/reset",function(req,res){
    res.render("reset");
})


app.post("/home", async function(req,res){
   await User.updateOne({email:req.body.userEmail},{$push:{list:req.body.newitem}});
    User.findOne({email:req.body.userEmail}).then(function(foundUser){
         const day = date.getDay();
         res.render("list",{listTitle: day,newListItems: foundUser.list,userEmail:req.body.userEmail});
    })
    
});


app.post("/register",function(req,res){
    User.findOne({email:req.body.email}).then(function(foundUser){
        if(foundUser)
        {
            res.render("register",{status: "User Already Exist !"})
        }else{
            const newUser = new User({
                email:req.body.email,
                password:req.body.password,
                list:[]
            })
            newUser.save();
            res.redirect("/login");
        }
    })
    
})

app.post("/login",function(req,res){
    User.findOne({email:req.body.email,password:req.body.password}).then(function(foundUser){
        if(!foundUser){
            res.render("login",{loginStatus:"User Not Found !"});
        }else{
            const day = date.getDay();
            res.render("list",{listTitle: day,newListItems: foundUser.list,userEmail:req.body.email});
        }
    })
})

app.post("/delete", async function(req,res){
    
    await User.updateOne({email:req.body.userEmail},{$pull:{list:req.body.checkbox}})
    User.findOne({email:req.body.userEmail}).then(function(foundUser){
        const day = date.getDay();
        res.render("list",{listTitle: day,newListItems: foundUser.list,userEmail:req.body.userEmail});
   })
})

app.post("/logout",function(req,res){
    res.redirect("login");
})

app.listen(process.env.PORT|| 3000, function(){
    console.log("Server is running on port 3000.");
});