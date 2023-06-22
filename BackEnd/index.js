const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

require('dotenv').config();

const app = express();

app.use(express.json({extended: true}));
app.use(cors());

app.use("/api/auth", require("./routs/routs.auth.js"));
app.use("/api/images", require("./routs/routs.images.js"));
app.use("/api/products", require("./routs/routs.products.js"));

const URI = process.env.DB_URI;

const PORT = 4001;

function Start(){
  try{
    mongoose.set('strictQuery', true);
    mongoose.connect(URI, () => console.log("Connetction to DataBase is OK"));

    app.listen(PORT, () => {
      console.log("Server has been started on Port: " + PORT);
    });
  }catch(e){
    console.log(e.message);
    process.exit(1);
  }
}

Start();