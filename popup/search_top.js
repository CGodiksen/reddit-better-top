// Initialize elements from the popup html file.
const timeLimitNumberInput = document.querySelector("div.popup-content input[name='time_limit_number']")
const timeLimitUnitSelect = document.querySelector("div.popup-content select[name='time_limit_unit']")

const searchTopBtn = document.querySelector("div.popup-content button[name='search_top']")

const changeInputMax = () => {
  switch (timeLimitUnitSelect.value) {
    case "Days":
      timeLimitNumberInput.setAttribute("max", "31")
      break;
    case "Months":
      timeLimitNumberInput.setAttribute("max", "12")
      break;
    case "Years":
      timeLimitNumberInput.setAttribute("max", "99")
  }
}

timeLimitUnitSelect.addEventListener("change", changeInputMax)

// Enable the search button if the current active tab is a Reddit page that has the "Top" feature.
const enableIfRedditTop = () => {
  browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
    const tab = tabs[0];
    const split_url = tab.url.split("/")

    // Only considering pages that have the "Top" feature. 
    // TODO: Handle different viable urls on the reddit frontpage. 
    if (tab.url == "https://www.reddit.com/" || (split_url[3] == "r" && ["", "hot", "new", "top"].includes(split_url[5]))) {
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

const requestFilterStart = (tabId, _changeInfo, tabInfo) => {
  if (tabInfo.status == "complete") {
    browser.tabs.sendMessage(tabId, { startFilter: true, time_limit_number: timeLimitNumberInput.value, time_limit_unit: timeLimitUnitSelect.value })
  }
}

// Return a new url that makes a top search on the current page.
const getTopURL = (original_url) => {
  const t = getTopQueryValue()

  if (original_url == "https://www.reddit.com/") {
    return `${original_url}top/?t=${t}`
  } else {
    const cleanURL = original_url.split("/").slice(0, 5).join("/")
    return `${cleanURL}/top/?t=${t}`
  }
}

// Return a top query value that encapsulates the custom top search.
const getTopQueryValue = () => {
  const time_limit_number = timeLimitNumberInput.value
  const time_limit_unit = timeLimitUnitSelect.value

  switch (time_limit_unit) {
    case "Years":
      return (time_limit_number == 1) ? "year" : "all"
    case "Months":
      return (time_limit_number == 1) ? "month" : "year"
    case "Days":
      if (time_limit_number == 1) {
        return "day"
      } else if (time_limit_number <= 7) {
        return "week"
      } else {
        return "month"
      }
  }
}

searchTopBtn.addEventListener("click", searchTop)