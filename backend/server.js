const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const cors = require("cors");

dotenv.config();

connectDB();
const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("api is running successfully");
});

app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
