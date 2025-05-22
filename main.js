const express = require('express')
const app = express()

const cors = require('cors');
const bodyParser = require('body-parser');


app.get("/", (req, res) =>{
    res.send("a")
})


app.listen(3000, ()=>{
    console.log("server running")
})