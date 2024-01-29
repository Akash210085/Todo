const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname+"/date.js");
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static('public'));

// const items = ["Buy food","Cook food","Eat food"];
// const workList = [];

mongoose.connect("mongodb+srv://ak8923307022:Akash123@cluster0.ulu0n2f.mongodb.net/todolistDB")

// const itemsSchema = new mongoose.Schema({
//     name:String
// })

// OR

const itemsSchema = {
    name:String
}

const workSchema = {
    name:String
}

const userSchima = {
    email:String,
    password:String
}

const Item = mongoose.model("Item",itemsSchema);
const workItem = mongoose.model("workItem",workSchema);
const User = mongoose.model("User",userSchima);

app.get("/",function(req,res){
    res.render("register");
})

app.get("/home", function(req,res){
    const day = date.getDay();
    

    Item.find().then(function(items){
        res.render("list",{listTitle: day,newListItems: items});
    })
    
});

app.get("/login",function(req,res){
    res.render("login");
})

app.get("/reset",function(req,res){
    res.render("reset");
})

const item1 = new Item({
    name:"Welcome todo list!"
})

const defaultItems = [item1];

const listSchima = {
    name:String,
    items:itemsSchema
}
const List = mongoose.model("List",listSchima);




app.post("/home",function(req,res){

        const item = new Item({
            name:req.body.newitem
        })
        item.save();
        // items.push(req.body.newitem);
        res.redirect("/home");
    
});

app.post("/register",function(req,res){
    const newUser = new User({
        email:req.body.email,
        password:req.body.password
    })
    newUser.save();
    res.redirect("/login");
})

app.post("/login",function(req,res){
    User.findOne({email:req.body.email,password:req.body.password}).then(function(foundUser){
        if(!foundUser){
            res.redirect("/login");
        }else{
            res.redirect("/home");
        }
    })
})
async function Delete(id){
    await Item.findByIdAndDelete(id);
}

app.post("/delete",function(req,res){
    const checkedItemId = req.body.checkbox
    
    Delete(checkedItemId);
    // Item.findByIdAndDelete(checkedItemId);
    // Item.findOneAndDelete(checkedItemId);
    res.redirect("/home");
})

app.post("/logout",function(req,res){
    res.redirect("login");
})

app.listen(process.env.PORT|| 3000, function(){
    console.log("Server is running on port 3000.");
});