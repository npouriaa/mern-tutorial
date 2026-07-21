const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const connectDB = require("./config/db");
dotenv.config();
const port = process.env.PORT || 5000;

const app = express();
app.use(express.json());

connectDB();

app.use("/api/goals", require("./routes/goalRoutes"));

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
