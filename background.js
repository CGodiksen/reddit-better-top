browser.runtime.onMessage.addListener((request, sender) => {
  // Listen for messages from content script, requesting that the post filter is started after the sender tab is done loading.
  if (request.startFilterOnUpdate) {
    filter = { tabId: sender.tab.id }
    browser.tabs.onUpdated.addListener((tabId, _changeInfo, tabInfo) => requestFilterStart(tabId, tabInfo, request.timeLimitNumber, request.timeLimitUnit), filter);
  }
})

const requestFilterStart = (tabId, tabInfo, timeLimitNumber, timeLimitUnit) => {
  if (tabInfo.status == "complete") {
    browser.tabs.sendMessage(tabId, { startFilter: true, timeLimitNumber: timeLimitNumber, timeLimitUnit: timeLimitUnit })
  }
}