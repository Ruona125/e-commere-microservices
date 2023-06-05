const express = require("express");
const app = express();
app.use(express.json())
const PORT = 8000;
const mongoose = require("mongoose");
const User = require("./user");
const jwt = require("jsonwebtoken");

require("dotenv").config();

mongoose
  .connect(
    `mongodb+srv://ogheneruonaagadagba4:${process.env.PASSWORD}@cluster0.vpgrie7.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Connected to database!");
    app.listen(PORT, () => {
      console.log("server is running on port 8000");
    });
  })
  .catch((error) => {
    console.log(error);
  });

// dotenv.config()

//register
app.post("/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.json({ message: "user already exist" });
  } else {
    const newUser = new User({
      name,
      email,
      password,
    });
    newUser.save();
    return res.json(newUser);
  }
});

//login
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ message: "user doesn't exist" });
  } else {
    //check i fthe password is correct
    if (password !== user.password) {
      return res.json({ message: "password incorrect" });
    }
    const payload = {
      email,
      name: user.name,
    };
    jwt.sign(payload, "secret", (err, token) => {
      if (err) console.log(err);
      else {
        return res.json({ token: token });
      }
    });
  }
});

