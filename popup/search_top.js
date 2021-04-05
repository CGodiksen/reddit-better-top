// Initialize elements from the popup html file.
const timeLimitNumberInput = document.querySelector("div.popup-content input[name='time_limit_number']")
const timeLimitUnitSelect = document.querySelector("div.popup-content select[name='time_limit_unit']")

const searchTopForm = document.querySelector("div.popup-content form[name='search_top_form']")
const searchTopBtn = document.querySelector("div.popup-content button[name='search_top_btn']")

const changeInputMax = () => {
  switch (timeLimitUnitSelect.value) {
    case "hour":
      timeLimitNumberInput.setAttribute("max", "24")
      break;
    case "day":
      timeLimitNumberInput.setAttribute("max", "31")
      break;
    case "month":
      timeLimitNumberInput.setAttribute("max", "12")
      break;
    case "year":
      timeLimitNumberInput.setAttribute("max", "99")
      break;
  }
}

timeLimitUnitSelect.addEventListener("change", changeInputMax)

// Enable the search button if the current active tab is a Reddit page that has the "Top" feature.
const enableIfRedditTop = () => {
  browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
    const tab = tabs[0];
    const splitURL = tab.url.split("/")

    // Only considering pages that have the "Top" feature. 
    // TODO: Handle different viable urls on the reddit frontpage. 
    if (tab.url == "https://www.reddit.com/" || (splitURL[3] == "r" && ["", "hot", "new", "top"].includes(splitURL[5]))) {
      searchTopBtn.removeAttribute("disabled")
    }
  }, console.error)
}

enableIfRedditTop()

// Update the page and send a message to the content script requesting post filtering according to the selected time limit.
const searchTop = () => {
  browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
    const tab = tabs[0];

    browser.tabs.update({ url: getTopURL(tab.url) });

    browser.tabs.onUpdated.addListener(requestFilterStart);
  }, console.error)
}

searchTopForm.addEventListener("submit", searchTop)

const requestFilterStart = (tabId, _changeInfo, tabInfo) => {
  if (tabInfo.status == "complete") {
    browser.tabs.sendMessage(tabId, { startFilter: true, timeLimitNumber: timeLimitNumberInput.value, timeLimitUnit: timeLimitUnitSelect.value })
  }
}

// Return a new url that makes a top search on the current page.
const getTopURL = (originalURL) => {
  const t = getTopQueryValue()

  if (originalURL == "https://www.reddit.com/") {
    return `${originalURL}top/?t=${t}`
  } else {
    const cleanURL = originalURL.split("/").slice(0, 5).join("/")
    return `${cleanURL}/top/?t=${t}`
  }
}

// Return a top query value that encapsulates the custom top search.
const getTopQueryValue = () => {
  const timeLimitNumber = timeLimitNumberInput.value
  const timeLimitUnit = timeLimitUnitSelect.value

  switch (timeLimitUnit) {
    case "year":
      return (timeLimitNumber == 1) ? "year" : "all"
    case "month":
      return (timeLimitNumber == 1) ? "month" : "year"
    case "day":
      if (timeLimitNumber == 1) {
        return "day"
      } else if (timeLimitNumber <= 7) {
        return "week"
      } else {
        return "month"
      }
  }
}
