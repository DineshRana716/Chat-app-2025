const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

connectDB();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("api is running successfully");
});

app.use("/api/user", userRoutes);

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
