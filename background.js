browser.runtime.onMessage.addListener((request, sender) => {
  // Listen for messages from content script, requesting that the post filter is started after the sender tab is loaded.
  if (request.startFilterOnUpdate) {
    console.log(request, sender.tab.id);
  }
})