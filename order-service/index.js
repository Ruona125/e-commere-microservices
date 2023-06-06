const express = require("express");
const app = express();
const PORT = 8002;
const mongoose = require("mongoose");
const amqp = require("amqplib")
const Order = require("./order")

app.use(express.json())
const jwt = require("jsonwebtoken");
const  isAuthenticated  = require("../authenticator");

require("dotenv").config();

let channel, connection;

async function connect() {
  const amqpServer = "amqp://localhost:5672";
  connection = await amqp.connect(amqpServer)
  channel = await connection.createChannel();
  await channel.assertQueue("PRODUCT")
}
connect()

//create a new product
app.post("/product/create", isAuthenticated, async (req, res) => {
  const {name, description, price} = req.body;
  const newProduct = new Product({
    name,
    description,
    price
  })
  return res.json(newProduct)
})

//creating an order with those products and a total value of sum of product's prices
app.post("/product/buy", isAuthenticated, async (req, res) =>{
  const {ids} = req.body;
  const products = await Product.find({_id: {$in: ids}});
  
})

mongoose
  .connect(
    `mongodb+srv://ogheneruonaagadagba4:${process.env.PASSWORD}@cluster0.03gpafz.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("product-service database!");
    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

// docker run -p 5672:5672 rabbitmq



