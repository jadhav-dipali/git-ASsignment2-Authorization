const express = require("express")
const app = express();
require("./db/connection")
require("dotenv").config();
const port = process.env.PORT;

const router = require("./routers/register")

app.use(express.json())

app.use(router)



app.listen(port,()=>{
    console.log(`Listenig Port ${port}`)
})

