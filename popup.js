var console = chrome.extension.getBackgroundPage().console;
console.log("hello");
var app = {
  init: function() {
    // cache some element references
    var todo_title = document.getElementById("todo_title");
    var todo_detail = document.getElementById("todo_detail");
    var todo_url = document.getElementById("todo_url");
    var todo_save = document.getElementById("todo_save");

    todo_save.addEventListener("click", function(e) {
      e.preventDefault();
      var message = {
        todo_title: todo_title.value,
        todo_detail: todo_detail.value
      };
      chrome.runtime.sendMessage(JSON.stringify(message));
    });
  }
};

// app start
document.addEventListener("DOMContentLoaded", function() {
  app.init();
});
