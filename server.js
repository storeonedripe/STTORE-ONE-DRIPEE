const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const app = express();

const PORT = process.env.PORT || 3000;


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Public files
app.use(express.static(path.join(__dirname, "public")));


// Images folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Files JSON
const productsFile = path.join(__dirname, "products.json");
const ordersFile = path.join(__dirname, "orders.json");


// Create files if not exist
if (!fs.existsSync(productsFile)) {
    fs.writeFileSync(productsFile, "[]");
}

if (!fs.existsSync(ordersFile)) {
    fs.writeFileSync(ordersFile, "[]");
}


// Upload images
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "uploads/");
    },

    filename: function(req, file, cb){
        cb(null, Date.now() + "-" + file.originalname);
    }
});


const upload = multer({ storage });



// GET PRODUCTS
app.get("/products", (req,res)=>{

    const products = JSON.parse(
        fs.readFileSync(productsFile)
    );

    res.json(products);

});



// ADD PRODUCT FROM ADMIN
app.post("/add-product", upload.single("image"), (req,res)=>{


    const products = JSON.parse(
        fs.readFileSync(productsFile)
    );


    const product = {

        id: Date.now(),

        name: req.body.name,

        price: req.body.price,

        category: req.body.category || "",

        image: req.file 
        ? "/uploads/" + req.file.filename 
        : ""

    };


    products.push(product);


    fs.writeFileSync(
        productsFile,
        JSON.stringify(products,null,2)
    );


    res.json({
        message:"Product added",
        product
    });


});



// DELETE PRODUCT
app.delete("/delete-product/:id",(req,res)=>{


    let products = JSON.parse(
        fs.readFileSync(productsFile)
    );


    products = products.filter(
        p => p.id != req.params.id
    );


    fs.writeFileSync(
        productsFile,
        JSON.stringify(products,null,2)
    );


    res.json({
        message:"Deleted"
    });


});



// ORDERS CLIENTS
app.get("/orders",(req,res)=>{


    const orders = JSON.parse(
        fs.readFileSync(ordersFile)
    );


    res.json(orders);


});



// ADD ORDER
app.post("/order",(req,res)=>{


    const orders = JSON.parse(
        fs.readFileSync(ordersFile)
    );


    const order = {

        id: Date.now(),

        client:req.body.client,

        phone:req.body.phone,

        product:req.body.product,

        status:"En attente"

    };


    orders.push(order);


    fs.writeFileSync(
        ordersFile,
        JSON.stringify(orders,null,2)
    );


    res.json({
        message:"Order saved"
    });


});



// HOME
app.get("*",(req,res)=>{

    res.sendFile(
        path.join(__dirname,"public","index.html")
    );

});



// START SERVER
app.listen(PORT,()=>{

    console.log(
        "SERVER RUNNING ON PORT " + PORT
    );

});