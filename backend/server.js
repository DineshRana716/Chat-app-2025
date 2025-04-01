require("dotenv").config();
const express = require("express");

const app = express();
const chats = require("./data");

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("api is running");
});

app.get("/api/chat", (req, res) => {
  res.send(chats);
});

app.get("/api/chat/:id", (req, res) => {
  const singleChat = chats.find((chat) => chat._id === req.params.id);
  res.send(singleChat);
});

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
