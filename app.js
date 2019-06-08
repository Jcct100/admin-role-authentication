const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const path = require("path");

//bring in the database object
const config = require("./config/database");

//mongodb config
mongoose.set("useCreateIndex", true);

//connect with the database
mongoose
  .connect(config.database, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log("database connected successfuly" + config.database);
  })
  .catch(err => {
    console.log(err);
  });

// initilise the app
const app = express();

// defining the PORT
const PORT = process.env.PORT || 5000;

// Defining the middlewares
app.use(cors());
// set the static folder
app.use(express.static(path.join(__dirname, "public")));

// bodyParser Middleware
app.use(bodyParser.json());
// passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  return res.json({
    message: "This is node.js role based authentication system"
  });
});

//crate a custom middleware function
const checkUserType = function(req, res, next) {
  const userType = req.originalUrl.split("/")[2];
  // Bring in the passport authentication strategy
  require("./config/passport")(userType, passport);
  next();
};

app.use(checkUserType);

// Bring in the user routes
const users = require("./routes/users");
app.use("/api/users", users);

// Bring in the admin routes
const admin = require("./routes/admin");
app.use("/api/admin", admin);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
