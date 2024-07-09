const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/userRoute");
const app = express();

app.use(express.json());
app.use(cors());

app.use("/users", userRouter);

module.exports = app;