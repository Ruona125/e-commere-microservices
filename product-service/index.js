const express = require("express");
const app = express();
const PORT = 8001;
const mongoose = require("mongoose");
const amqp = require("amqplib")

app.use(express.json())
const jwt = require("jsonwebtoken");

require("dotenv").config();

let channel, connection;

async function connect() {
  const amqpServer = "amqp://localhost:5672";
  connection = await amqp.connect(amqpServer)
  channel = await connection.createChannel();
  await channel.assertQueue("PRODUCT")
}
connect()

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



