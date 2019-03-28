// Dependencies
var Article = require("./models/Article");
var SavedArticle = require("./models/SavedArticle");
var Note = require("./models/Note");
var express = require("express");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");
// var bodyParser = require("body-parser");


// Initialize Express
var app = express();

app.use(express.static("public"));

var PORT = process.env.PORT || 8000;

mongoose.connect("mongodb://localhost/article", { useNewUrlParser: true });

// heroku_5fsz0t7d"

// Use body parser with the app
app.use(express.urlencoded({
  extended: false
}));

// require("./routes/apiRoutes")(app);
// require("./routes/htmlRoutes")(app);


// Initialize Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/article";

mongoose.connect(MONGODB_URI).catch(err=>{
console.log(JSON.stringify(err))
});

// Routes

app.get("/", function(req, res){
  console.log("Hello")
  Article.find({})
  .then(function (Article){
    // console.log(Article);

    var articleObject = {
      article: Article
    }
  
    res.render("index", articleObject);

  })
  .catch(function (err){
    res.json(err);
  });
});


app.get("/scrape", function (req, res) {
  console.log("Hi")
  // First, we grab the body of the html with axios
  axios.get("http://www.libertyballers.com/").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    $('a').each((i,e)=>{
      // console.log(e.attribs)
    })
    // Now, we grab every headline title within an article tag, and do the following:
    // $(".post-list--pe").each(function (i, element) {
    // //   // .post-list--pe

    //   var result = {};
    //   var title = $(element).children(".post-wrapper").children("article").children("header").children("h1.headline").children("a").text()

    //   var link = $(element).children(".post-wrapper").children("article").children("header").children("h1.headline").children("a").attr("href")

    //   var summary = $(element).children(".post-wrapper").children("article").children(".item__content").children(".excerpt").children("p").text()

  //  console.log($(".c-entry-box--compact__title").children('a').text())
  //  console.log('----------------')
    $(".c-compact-river").each(function (i, element) {

      var result = {};
      
      var title = $(element).children(".c-compact-river__entry").children(".c-entry-box--compact").children(".c-entry-box--compact__body").children("h2.c-entry-box--compact__title").children("a").text()
      console.log(title);
      var link = $(element).children(".c-compact-river__entry").children(".c-entry-box--compact").children("a").attr("href")

      var summary = $(element).children(".c-compact-river__entry").children(".c-entry-box--compact").children(".c-entry-box--compact__body").children("p.p-dek").text()

      result.title = title
      result.link = link
      result.summary = summary
  
    
      // console.log(result)
      // console.log(title)
      // console.log(link)
      // console.log(summary)
      let newArticle = new Article(result)


      newArticle.save().then(() =>{
        console.log("saved!")
      })
      .catch(err=>{
        console.log(err)
      })

      // Send a message to the client
      res.send("Scrape Complete");
    });
  });
})

app.get("/articles", function(req, res){

  Article.find({})
  .then(function (Article){
    console.log(Article);

    var articleObject = {
      article: Article
    }
  
    res.render("index", articleObject);

  })
  .catch(function (err){
    res.json(err);
  });
}); 

app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(Article) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(Article);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.post("/save", function(req, res){
console.log(req.body.thisId)
Article.findById(req.body.thisId)
.then(function(result){
  console.log(result)
  var title = result.title
  var link = result.link
  var summary = result.summary
var savedArticle = {title, link, summary}
SavedArticle.create(savedArticle).then(function(result){
  res.json(result)
})
})
})

app.get("/savedArticles", function(req, res){
  SavedArticle.find({}).then(function(result){
    res.json(result)
  })
})




// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  Note.create(req.body)
    .then(function(Note) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return Article.findOneAndUpdate({ _id: req.params.id }, { note: Note._id }, { new: true });
    })
    .then(function(Article) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(Article);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});




app.listen(PORT, function () {
  console.log("App running on port!");
});

