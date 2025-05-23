const express = require('express')
const app = express()
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());

app.use(bodyParser.json());

app.use('/images', express.static('images'));


app.get("/", (req, res) =>{
    res.send("a")
})    


app.get("/products", (req,res)=>{
    const count = req.query.count;
    const category = req.query.category;
    const sort = req.query.sort;
    var products;
    fs.readFile(path.resolve('products.json'), 'utf8', (err, data) => {
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


})



app.listen(3000, ()=>{
    console.log("server running")
})