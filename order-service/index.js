const express = require("express");
const app = express();
const PORT = 8002;
const mongoose = require("mongoose");
const amqp = require("amqplib");
const Order = require("./order");

app.use(express.json());
const jwt = require("jsonwebtoken");
const isAuthenticated = require("../authenticator");

require("dotenv").config();

let channel, connection;

async function connect() {
  const amqpServer = "amqp://localhost:5672";
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("ORDER");
}

function createOrder(products, userEmail) {
  let total = 0;
  for (let t = 0; t < products.length; t++) {
    total += products[t].price;
  }
  const newOrder = new Order({
    products,
    user: userEmail,
    total_price: total,
  });
  newOrder.save();
  return newOrder;
}

connect().then(() => {
  channel.consume("ORDER", (data) => {
    const { products, userEmail } = JSON.parse(data.content);
    const newOrder = createOrder(products, userEmail);
    channel.ack(data);
    channel.sendToQueue("PRODUCT", Buffer.from(JSON.stringify({ newOrder })));
    console.log("Consuming order queue");
    console.log(products);
  });
});

mongoose
  .connect(
    `mongodb+srv://ogheneruonaagadagba4:${process.env.PASSWORD}@cluster0.03gpafz.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("order-service database!");
    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

// docker run -p 5672:5672 rabbitmq
