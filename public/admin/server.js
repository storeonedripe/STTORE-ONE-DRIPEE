const express = require("express");
const cors = require("cors");
const fs = require("fs");
const multer = require("multer");


const app = express();


// MIDDLEWARE

app.use(cors());

app.use(express.json());

app.use(express.static("public"));




// DATABASE

if(!fs.existsSync("products.json")){

fs.writeFileSync(
"products.json",
"[]"
);

}


if(!fs.existsSync("orders.json")){

fs.writeFileSync(
"orders.json",
"[]"
);

}






// UPLOAD IMAGE


const storage = multer.diskStorage({

destination:(req,file,cb)=>{

cb(null,"public/uploads");

},


filename:(req,file,cb)=>{

cb(null,Date.now()+"-"+file.originalname);

}

});



const upload = multer({

storage:storage

});







// FUNCTIONS


function readProducts(){

return JSON.parse(
fs.readFileSync("products.json")
);

}



function saveProducts(data){

fs.writeFileSync(
"products.json",
JSON.stringify(data,null,2)
);

}




function readOrders(){

return JSON.parse(
fs.readFileSync("orders.json")
);

}




function saveOrders(data){

fs.writeFileSync(
"orders.json",
JSON.stringify(data,null,2)
);

}









// HOME


app.get("/",(req,res)=>{

res.send("STORE ONE DRIPE SERVER OK");

});









// =====================
// PRODUCTS
// =====================



// GET PRODUCTS

app.get("/products",(req,res)=>{


res.json(
readProducts()
);


});







// ADD PRODUCT


app.post(
"/products",
upload.single("image"),
(req,res)=>{


console.log(req.body);

console.log(req.file);



let products = readProducts();



let product = {


id:Date.now(),


name:req.body.name,


price:req.body.price,


category:req.body.category,


image:req.file

? "/uploads/"+req.file.filename

: ""



};



products.push(product);



saveProducts(products);



res.json(product);



});








// DELETE PRODUCT


app.delete(
"/products/:id",
(req,res)=>{


let products = readProducts();



products =
products.filter(

p=>p.id != req.params.id

);



saveProducts(products);



res.json({

message:"Produit supprimé"

});


});









// =====================
// ORDERS
// =====================



// GET ORDERS


app.get("/orders",(req,res)=>{


res.json(
readOrders()
);


});









// ADD ORDER


app.post("/orders",(req,res)=>{


let orders = readOrders();



let order = {


id:Date.now(),


client:req.body.client,


phone:req.body.phone,


address:req.body.address,


product:req.body.product,


status:"En attente"



};



orders.push(order);



saveOrders(orders);



res.json(order);



});









// START


app.listen(3000,()=>{


console.log(
"STORE ONE DRIPE SERVER RUNNING : 3000"
);


});