require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const authRoute = require("./routes/authRoute.js");
const userRoute = require("./routes/userRoute")
const jobsRoute = require("./routes/jobsRoute")



const port = process.env.PORT || 3000;
const Url = process.env.dbUrl;

const app = express();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
      "Access-Control-Allow-Method",
      "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
  );
  next();
});



mongoose
  .connect(Url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    writeConcern: {
      w: "majority",
    },
  })
  .then((res) => {
    console.log("database connected");
  })
  .catch((error) => {
    console.log(error);
  });


//routes
app.use("/api/v1/auth", authRoute)
app.use("/api/v1/user", userRoute)
app.use("/api/v1/jobs", jobsRoute)



app.listen(port, () => {
  console.log(`server is working now! on ${port}`);
});
