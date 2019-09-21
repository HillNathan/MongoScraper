// DOM Manipulation functions go here...
$( document ).ready(function() {
    $("#close-note").on("click", () => closeNotes() ) 

    $("#all-articles").on("click", function() {
        $("#page-title").text("All Scraped Articles")
        $("#article-list").empty()
        displayArticles(false)
    })

    $("#saved-articles").on("click", function() {
        $("#page-title").text("Saved Articles Only")
        $("#article-list").empty()
        displayArticles(true)
    })



})

// Grab the articles as a json
displayArticles(false);

$(document).on("click", "p", function() {
    openNotes($(this).attr("data-id"))
})

$(document).on("click", ".remove-note", function() {
    let theNote = {}
    theNote.id = $(this).attr("note-id");
    console.log(theNote)
    $.ajax({
        type: "POST",
        url: "/delete-note",
        data: theNote
    })
    .then(response => {
        console.log(response) 
        $("#notes-list").empty()
        openNotes($("#data-id").val())
    })
})

$(document).on("click", ".save-action", function() {
    let currentState = $(this).attr("isSaved")
    let theArticle = {}
    let newState = false
    if (currentState === "false") newState = true
    theArticle.saved = newState
    theArticle.id = $(this).attr("data-id")
    console.log(theArticle)
})

$(document).on("click", ".add-note", function() {
    event.preventDefault()
    let theNote = {}
    theNote.note = $("#note-body").val().trim()
    theNote._id = $("#data-id").val()
    $.ajax({
        type: "POST",
        url: "/addnote",
        data: theNote
    })
    .then(response => {
        console.log(response) 
        $("#notes-list").empty()
        openNotes($("#data-id").val())
    })
})

const closeNotes = () => {
    $("#notes-list").html("")
    $("#data-id").val("")
    $("#article-title").val("")
    $("#notes-window").hide()
}

function openNotes(forID) {
    $.ajax({
        type: "GET",
        url: "/article/" + forID
    }).then(response => {
        console.log(response)
        $("#data-id").val(forID)
        $("#title").text(response.title);
        $("#notes-window").show();
        if(response.notes) {
            response.notes.forEach(element => {
                console.log(element)
                let newNote = $("<ul>")
                newNote.text(element.note)
                let closeButton = $("<button>")
                closeButton.attr("note-id", element._id)
                    .attr("class", "remove-note")
                    .text("Remove")
                newNote.append(closeButton)
                $("#notes-list").append(newNote)
            })
        }
    })
}

function displayArticles(savedOnly) {
    let theUrl = ""
    if (savedOnly) theUrl = "/saved"
    else theUrl = "/foo"

    $.getJSON(theUrl, data => {
        // For each one
        data.forEach( element  => {
            let savedButton = $("<button>")
            savedButton.attr("data-id", element._id)
            
            if (element.saved) {
                savedButton.attr("class", "save-action btn btn-sm btn-success float-left")
                savedButton.text("Saved!") 
                savedButton.attr("isSaved", "true")
            } else {
                savedButton.attr("class", "save-action btn btn-sm btn-danger float-left")
                savedButton.text("Save Me!")
                savedButton.attr("isSaved", "false")
            } 
            $("#article-list").append(savedButton)
            $("#article-list").append("<p class='article-body' data-id='" + element._id + "'>" + element.title + "<br />" + element.href + "</p><hr>");
        })
      })
}