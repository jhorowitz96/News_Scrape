module.exports = function(app) {
    // Load main page
    app.get("/", function(req, res) {
      res.render("index", { layout: "main" });
    });
}

