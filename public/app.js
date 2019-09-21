// DOM Manipulation functions go here...
$( document ).ready(function() {
    $("#close-note").on("click", () => closeNotes() ) 
})

// Grab the articles as a json
$.getJSON("/foo", data => {
    // For each one
    data.forEach( element  => {
        $("#article-list").append("<p data-id='" + element._id + "'>" + element.title + "<br />" + element.href + "</p>");
    })
  })

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