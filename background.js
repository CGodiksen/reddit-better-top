browser.runtime.onMessage.addListener((request, sender) => {
  // Listen for messages from content script, requesting that the post filter is started after the sender tab is loaded.
  if (request.startFilterOnUpdate) {
    filter = { tabId: sender.tab.id }
    browser.tabs.onUpdated.addListener((_tabId, _changeInfo, tabInfo) => requestFilterStart(tabInfo, "hello"), filter);
  }
})

const requestFilterStart = (tabInfo, test) => {
  console.log(tabInfo, test);
}