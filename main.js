const express = require('express')
const app = express()
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
app.use(cors());

app.use(bodyParser.json());


app.get("/", (req, res) =>{
    res.sendFile(path.resolve('./index.html'))
})    


app.get("/products", (req,res)=>{
    const count = req.query.count;
    const category = req.query.category != "ALL" ? req.query.category : null;
    const sort = req.query.sort;
    var products;
    fs.readFile(path.resolve('./products.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('error');
            return;
        }
        let products = JSON.parse(data);
        
        if(category){
            products = products.filter(product => product.category === req.query.category);
        }
        if(sort){
            products = products.sort((a, b) => {
                if (sort === 'asc') {
                    return a["eur"] - b["eur"];
                } else if (sort === 'desc') {
                    return b["eur"] - a["eur"];
                }
            });
        }
        if(count){
            products = products.slice(0, count);
        }

        res.json(products);

    });
app.get("/categories", (req, res)=>{
    res.send([
        "ALL",
        "SHOES",
        "JACKETS",
        "HOODIES",
        "SHORTS",
        "SHIRTS",
        "PANTS",
        "JERSEYS",
        "OTHERS",
      ]);
})

})

// ADMIN
app.get("/admin/", (req, res) => {
    const payload = req.body;
    console.log(req.header("authorization"))
    console.log(process.env.AUTH + " <- auth")
    if(req.header("Authorization") !== process.env.AUTH ){
        return res.status(401).send("Unauthorized");
    }
    res.sendFile(path.resolve('./admin.html'))
    
})


app.get("/admin/auth", (req, res) => {
    console.log(req.header("Authorization"))
    if(req.header("Authorization") != process.env.PASS){
        return res.status(401).send("Unauthorized");
    }
    res.status(200).send("Authorized")
})

app.post("/admin/product", (req, res) => {
    console.log(req.header("Authorization"))
    if(req.header("Authorization") !== process.env.AUTH ){
        return res.status(401).send("Unauthorized");
    }
    if(req.body == undefined){
        return res.status(400).send("Bad Request");
    }
    
    const newProduct = req.body;
    const reqs = ["item_name", "image_path", "yuan", "eur", "usd", "link", "category"]
    for (const req of reqs) {
        if (!newProduct.hasOwnProperty(req)) {
            return res.status(400).send(`Missing required field: ${req}`);
        }
    }
    fs.readFile(path.resolve('./products.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading products file');
        }
        let products = JSON.parse(data);
        products.push(newProduct);
        fs.writeFile(path.resolve('./products.json'), JSON.stringify(products, null, 2), 'utf8', (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error writing to products file');
            }
            res.status(201).send('Product added successfully');
        });
    });
    
})


app.listen(3000, ()=>{
    console.log("server running")
})