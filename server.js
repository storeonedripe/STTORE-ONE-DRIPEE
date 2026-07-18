const express = require("express");
const cors = require("cors");
const fs = require("fs");
const multer = require("multer");


const app = express();


// MIDDLEWARE

app.use(cors());

app.use(express.json());

app.use(express.static("public"));





// DATABASE FILES


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


    destination:function(req,file,cb){

        cb(null,"public/uploads");

    },


    filename:function(req,file,cb){

        cb(
            null,
            Date.now()+"-"+file.originalname
        );

    }


});



const upload = multer({
    storage:storage
});








// FUNCTIONS


function getProducts(){

    return JSON.parse(
        fs.readFileSync("products.json")
    );

}



function saveProducts(products){

    fs.writeFileSync(
        "products.json",
        JSON.stringify(products,null,2)
    );

}





function getOrders(){

    return JSON.parse(
        fs.readFileSync("orders.json")
    );

}




function saveOrders(orders){

    fs.writeFileSync(
        "orders.json",
        JSON.stringify(orders,null,2)
    );

}








// TEST SERVER


app.get("/",(req,res)=>{


res.send("DRIPE.MA SERVER OK");


});









// =====================
// PRODUCTS
// =====================



// GET PRODUCTS


app.get("/products",(req,res)=>{


res.json(
    getProducts()
);


});







// ADD PRODUCT WITH IMAGE



app.post(
"/products",
upload.single("image"),
(req,res)=>{


let products=getProducts();



let product={


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



res.json({

message:"Article ajouté",

product

});


});









// DELETE PRODUCT



app.delete(
"/products/:id",
(req,res)=>{


let products=getProducts();



products =
products.filter(

p=>p.id != req.params.id

);



saveProducts(products);



res.json({

message:"Article supprimé"

});


});









// =====================
// ORDERS CLIENTS
// =====================



// GET ORDERS


app.get("/orders",(req,res)=>{


res.json(
getOrders()
);


});







// ADD ORDER



app.post("/orders",(req,res)=>{


let orders=getOrders();



let order={


id:Date.now(),


client:req.body.client,


phone:req.body.phone,


address:req.body.address,


product:req.body.product,


status:"En attente"



};



orders.push(order);



saveOrders(orders);



res.json({

message:"Commande enregistrée",

order

});


});









// DELETE ORDER (OPTION)



app.delete("/orders/:id",(req,res)=>{


let orders=getOrders();



orders =
orders.filter(

o=>o.id != req.params.id

);



saveOrders(orders);



res.json({

message:"Commande supprimée"

});


});









// START SERVER


app.listen(3000,()=>{


console.log(
"SERVER RUNNING PORT 3000"
);


});