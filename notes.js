// listen to form submit
document.getElementById("noteForm").addEventListener("submit", saveNote);
//document.getElementById("body").addEventListener("load", fetchNotes);
// app start
document.addEventListener("DOMContentLoaded", function() {
  fetchNotes();
});
function Note(title, detail, url, task, status, pageNum) {
  this.title = title;
  this.detail = detail;
  this.url = url;
  this.task = task;
  this.status = status;
  this.pageNum = pageNum;
}
// save note
function saveNote(e) {
  e.preventDefault();
  vNote = new Note(
    document.getElementById("title").value,
    document.getElementById("detail").value,
    document.getElementById("url").value,
    false,
    "n/a",
    "1"
  );
  // test to see if notes are in local storage
  if (localStorage.getItem("bfb_notes") === null) {
    // initialize empty notes array
    var bfb_notes = [];
    // add the new note to the array
    bfb_notes.push(vNote);
  } else {
    //get bookmarks from storage
    var bfb_notes = JSON.parse(localStorage.getItem("bfb_notes"));
    // set number of notes for this page (url)
    var vPageNum = 0;
    for (var i = 0; i < bfb_notes.length; i++) {
      if (bfb_notes[i].url === vNote.url) {
        vPageNum++;
      }
    }
    vNote.pageNum = vPageNum + 1;
    // add new note to array
    bfb_notes.push(vNote);
  }
  // save back to local storage
  localStorage.setItem("bfb_notes", JSON.stringify(bfb_notes));
  fetchNotes();
}
// fetch bfb_notes
function fetchNotes() {
  var Notes = JSON.parse(localStorage.getItem("bfb_notes"));
  //console.log(JSON.stringify(Notes));
  var outputNotes = document.getElementById("outputNotes");
  //clear outputNotes
  outputNotes.innerHTML = "";
  //Build output
  for (var i = 0; i < Notes.length; i++) {
    var title = Notes[i].title;
    var url = Notes[i].url;
    var pageNum = Notes[i].pageNum;
    outputNotes.innerHTML +=
      "<div class='note'><div>" +
      title +
      "</div><div>" +
      url +
      '</div><div><button class="delete" onclick="deleteNote(\'' +
      url +
      "'," +
      pageNum +
      ')">x</button></div></div>';
  }
}
// remove note
function deleteNote(url, pageNum) {
  // get all notes
  var bfb_notes = JSON.parse(localStorage.getItem("bfb_notes"));
  // check notes to see if this is the one we want to delete.
  for (var note = 0; note < bfb_notes.length; note++) {
    // remove from the array if the url is the same.
    if (bfb_notes[note].url === url && bfb_notes[note].pageNum === pageNum) {
      bfb_notes.splice(note, 1);
    }
  }
  // reset page numbers for the notes for this url
  count = 0;
  for (var note = 0; note < bfb_notes.length; note++) {
    // update number for this note
    if (bfb_notes[note].url === url) {
      count++;
      bfb_notes[note].pageNum = count;
    }
  }
  localStorage.setItem("bfb_notes", JSON.stringify(bfb_notes));
  fetchNotes();
}
