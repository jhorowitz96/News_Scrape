$("#scrape").on("click", function() {
  console.log("Hellooo")
    $.ajax({
      method: "GET",
      url: "/scrape",
    })
    .then (function(data) {
      alert("Successfully scraped new articles!")
      window.location="/";
    })
  });


// When you click the save article button
$(document).on("click", "#savebutton", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
    console.log(thisId)
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/save" ,
      data: {
        // Value taken from title input
        thisId:thisId
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
      });

  });
  
  $(document).on("click", "#saved", function(){
    $.ajax({
      method: "GET",
      url: "/savedArticles"
    })
    .then(data=>{
      console.log(data)
      data.forEach(element => {
        var link = $("<a>")
        var title = $("<h2>")
        var summary = $("<p>")
        title.text(element.title)
        // title.attr()
        link.attr("href", element.link)
        link.append(title)
        summary.text(element.summary)
        $(".modal-body").append(link).append(summary)
      });
      var modalData =`
      `
    })
  })

  $(document).on("click", "#notebutton", function () {
    var thisId = $(this).attr("data-id");
    $.ajax({
      method: "GET",
      url: "/articles/:id",
      data: {
        // Value taken from title input
        thisId:thisId
      }
    })
      .then(function(data) {
        // Log the response
        console.log(data);
      })
      $("#commentModal").show();
 console.log("Comment Clicked");
    })





    $(document).on("click", "#saveChanges", function () {
      var thisId = $(this).attr("data-id");
      console.log(thisId)
      // var message = $("#comment").val()
      $.ajax({
        method: "POST",
        url: "/articles/:id" + thisId,
        data: {
          // Value taken from title input
          message: $("#comment" + thisId).val()
        }
      })
        .then(function() {
          // Log the response
          $("commentModal" + thisId).modal("hide");
        })
      })
    
