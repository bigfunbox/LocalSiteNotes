var console = chrome.extension.getBackgroundPage().console;
console.log("hello");
var app = {
  init: function() {
    // fetch bfb_notes
    this.fetchNotes();
    // create event listeners for form
    document
      .getElementById("noteForm")
      .addEventListener("submit", this.saveNote);

    // use current tab as url
    btn_use.addEventListener("click", function(e) {
      e.preventDefault();
      chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
        var activeTab = tabs[0];
        var url = activeTab.url;
        if (confirm("Use Site Title?")) {
          document.getElementById("title").value = activeTab.title;
        }
        document.getElementById("url").value = url;
        //chrome.runtime.sendMessage(JSON.stringify(msg));
      });
    });
  },

  // fetch bfb_notes
  fetchNotes: function() {
    var Notes = JSON.parse(localStorage.getItem("bfb_notes"));
    var outputNotes = document.getElementById("result-container");
    if (Notes == null) {
      outputNotes.innerHTML = "<div class='alert'>No Notes</div>";
    } else {
      //clear outputNotes
      outputNotes.innerHTML = "";
      //Build output
      for (var i = 0; i < Notes.length; i++) {
        var title = Notes[i].title;
        var url = Notes[i].url;
        var pageNum = Notes[i].pageNum;
        var detail = Notes[i].detail;
        var rowClass = "odd";
        if (i % 2 === 0) {
          rowClass = "even";
        } else {
          rowClass = "odd";
        }
        outputNotes.innerHTML +=
          '<article class="item ' +
          rowClass +
          '">' +
          "<h3>" +
          title +
          "</h3>" +
          '<div class="icon-container"><ul class="icons">' +
          '<li class="icon"><i class="far fa-trash-alt delete"data-url="' +
          url +
          '" data-pageNum="' +
          pageNum +
          '"></i></li>' +
          '<li class="icon open-detail"><i class="far fa-sticky-note"></i></li>' +
          '<li class="icon open-detail"><a href="' +
          url +
          '" target="_blank"><i class="fas fa-external-link-alt"></i></a></li>' +
          '</ul></div><div class="detail-container">' +
          detail +
          "</div></article>";
      }
      // add listeners for delete icons
      var deletes = document.getElementsByClassName("delete");
      for (var i = 0; i < deletes.length; i++) {
        deletes[i].addEventListener("click", function(e) {
          if (confirm("Delet Note? This can not be undone!")) {
            app.deleteNote(
              e.target.getAttribute("data-url"),
              e.target.getAttribute("data-pageNum")
            );
          }
        });
      }
      // add listener for open detail icons
      var detailOpens = document.getElementsByClassName("open-detail");
      for (var i = 0; i < detailOpens.length; i++) {
        detailOpens[i].addEventListener("click", openDetail);
      }
    }
  },
  // save note
  saveNote: function(e) {
    e.preventDefault();
    vNote = {
      title: document.getElementById("title").value,
      detail: document.getElementById("detail").value,
      url: document.getElementById("url").value,
      task: false,
      status: "n/a",
      pageNum: "1"
    };
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
    app.fetchNotes();
  },

  // remove note
  deleteNote: function(url, pageNum) {
    console.log(url + " - " + pageNum);
    // get all notes
    var bfb_notes = JSON.parse(localStorage.getItem("bfb_notes"));
    // check notes to see if this is the one we want to delete.
    for (var note = 0; note < bfb_notes.length; note++) {
      //console.log(bfb_notes[note].url + " - " + bfb_notes[note].pageNum);
      // remove from the array if the url is the same.
      if (bfb_notes[note].url == url && bfb_notes[note].pageNum == pageNum) {
        console.log("found match");
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
    this.fetchNotes();
  }
};

// app start
document.addEventListener("DOMContentLoaded", function() {
  app.init();
});

var openDetail = function(closeOthers) {
  var detailContainers = document.getElementsByClassName("detail-container");

  descriptionElem = this.parentElement.parentElement.parentElement.children[2];
  // check the open state of the clicked items detail
  var openState = descriptionElem.style.display;
  //close any open notes
  if (closeOthers) {
    for (var i = 0; i < detailContainers.length; i++) {
      detailContainers[i].style.display = "none";
    }
  }
  // toggle element visibility based on selection and current open state
  if (descriptionElem.style.display != "block" && openState != "block") {
    descriptionElem.style.display = "block";
  } else {
    descriptionElem.style.display = "none";
  }
};
