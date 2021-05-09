require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const { on } = require("npm");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth");

//DB connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log(`The DB is connected`);
  });

//Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//Routes
app.use("/api", authRoutes);

//PORT
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`App is running at ${port}`);
});
