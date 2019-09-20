// Grab the articles as a json
$.getJSON("/foo", data => {
    // For each one
    data.forEach( element  => {
        $("#article-list").append("<p data-id='" + element._id + "'>" + element.title + "<br />" + element.href + "</p>");
    })
  })

$(document).on("click", "p", function() {
    var thisId = $(this).attr("data-id");
    console.log(thisId)
})