var Article = require("../models/Article")
var axios = require("axios")
var cheerio = require("cheerio")

module.exports = function(app) {
    
    app.get("/scrape", function(req, res) {
    //   res.render("scrape", { layout: "main" });
      console.log("Hello");

// Routes

// app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("http://www.deadspin.com/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
  
      // Now, we grab every headline title within an article tag, and do the following:
      $(".post-list--pe").each(function(i, element) {
        // .js_post-list .hfeed
        // Save an empty result object
        console.log("Hi")
        var result = {};
        var title = $(element).children(".post-wrapper").children("article").children("header").children("h1.headline").children("a").text()

        var link = $(element).children(".post-wrapper").children("article").children("header").children("h1.headline").children("a").attr("href")

        var summary = $(element).children(".post-wrapper").children("article").children(".item__content").children(".excerpt").children("p").text()
  
          console.log(result)
        console.log(title)
        console.log(link)
        console.log(summary)
  
        // Create a new Article using the `result` object built from scraping
        // Article.create(result)
        //   .then(function(dbArticle) {
        //     // View the added result in the console
        //    res.render("index");
        //   })
        //   .catch(function(err) {
        //     // If an error occurred, log it
        //     console.log(err);
        //   });
      });
  
      // Send a message to the client
      res.send("Scrape Complete");
    });
//   });

    });


    }