// Dependencies
var express = require("express");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");
var bodyParser = require("body-parser");



// Initialize Express
var app = express();

app.use(express.static("public"));

var PORT = process.env.PORT || 8000;

mongoose.connect("mongodb://localhost/heroku_5fsz0t7d", { useNewUrlParser: true });

// Use body parser with the app
app.use(bodyParser.urlencoded({
  extended: false
}));

require("./routes/htmlRoutes")(app);

// Initialize Handlebars
app.engine("handlebars", exphbs({ layout: "main" }));
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/article";

mongoose.connect(MONGODB_URI);



require("./routes/apiRoutes")(app)

// Listen on port 8000
app.listen(8000, function() {
  console.log("App running on port 8000!");
});
