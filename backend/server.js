const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();


const contactRoutes = require("./routes/contactRoutes");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/contacts", contactRoutes);

// DB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas connected"))
  .catch((err) => console.log(err));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
