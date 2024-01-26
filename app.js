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

const Item = mongoose.model("Item",itemsSchema);
const workItem = mongoose.model("workItem",workSchema);



app.get("/", function(req,res){
    const day = date.getDay();
    

    Item.find().then(function(items){
        res.render("list",{listTitle: day,newListItems: items});
    })
    
});

const item1 = new Item({
    name:"Welcome todo list!"
})

const defaultItems = [item1];

const listSchima = {
    name:String,
    items:itemsSchema
}
const List = mongoose.model("List",listSchima);

// app.get("/:customListName", function(req,res){
//     const customListName = req.params.customListName;

//     List.findOne({name:customListName}).then(function(err,foundList){
//         if(!err){
//             if(!foundList){
//                 console.log("Doesn't exist!");
//                 const list = new List({
//                     name:customListName,
//                     items:defaultItems
//                 })
//                 list.save();
//                 res.redirect("/"+customListName);
//             }else{
//                 console.log("exits!");
//             }
//         }else{
//             console.log(err);
//         }
//     })

    


//     List.find().then(function(items){
//         res.render("list",{listTitle: customListName ,newListItems: items});
//     })
    
// });


app.post("/",function(req,res){

        const item = new Item({
            name:req.body.newitem
        })
        item.save();
        // items.push(req.body.newitem);
        res.redirect("/");
    
});

async function Delete(id){
    await Item.findByIdAndDelete(id);
}

app.post("/delete",function(req,res){
    const checkedItemId = req.body.checkbox
    console.log(checkedItemId);
    Delete(checkedItemId);
    // Item.findByIdAndDelete(checkedItemId);
    // Item.findOneAndDelete(checkedItemId);
    res.redirect("/");
})

app.listen(process.env.PORT|| 3000, function(){
    console.log("Server is running on port 3000.");
});