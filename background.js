var background = {
  init: function() {
    chrome.runtime.onMessage.addListener(function(
      request,
      sender,
      sendResponse
    ) {
      var p = JSON.parse(request);
      for (var key in p) {
        console.log(key + " -> " + p[key]);
      }
    });
  }
};
// startup
background.init();
