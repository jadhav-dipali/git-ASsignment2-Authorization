const mongoose = require("mongoose")
require("dotenv").config();
const url = process.env.BASE_URL;

mongoose.connect(url)
.then(res=>console.log("connection is successfull"))
.catch(err=>console.log("connection fail"))