// Initialize elements from the popup html file.
const timeLimitNumberInput = document.querySelector("div.popup-content input[name='time_limit_number']")
const timeLimitUnitSelect = document.querySelector("div.popup-content select[name='time_limit_unit']")

const searchTopBtn = document.querySelector("div.popup-content button[name='search_btn']")

const onNumberInputChange = (e) => {
  // Resetting the input if a non-number is input.
  if (isNaN(e.data)) {
    e.target.value = ""
  }

  // Not allowing the input if the new value excedes the max value.
  if (parseInt(e.target.value) > parseInt(timeLimitNumberInput.max)) {
    e.target.value = e.target.value.slice(0, -1)
  }

  // Change the plurality of the select text depending on whether the new value is a 1.
  const options = Array.from(timeLimitUnitSelect.options)

  if (e.target.value == 1) {
    options.map(option => option.innerHTML = option.innerHTML.slice(0, -1))
  } else if (options[0].innerHTML == "Hour") {
    options.map(option => option.innerHTML = option.innerHTML + "s")
  }
}

timeLimitNumberInput.oninput = onNumberInputChange

const onUnitSelectChange = () => {
  // Change number input max.
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

  timeLimitNumberInput.value = 1
}

timeLimitUnitSelect.addEventListener("change", onUnitSelectChange)

// Enable the search button if the current active tab is a Reddit page that has the "Top" feature.
const enableIfRedditTop = () => {
  browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
    const tab = tabs[0];
    const splitURL = tab.url.split("/")

    // Only considering pages that have the "Top" feature. 
    if (tab.url == "https://www.reddit.com/" || (splitURL[3] == "r" && ["", "hot", "new", "top"].includes(splitURL[5])) || ["hot", "new", "top"].includes(splitURL[3])) {
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

searchTopBtn.addEventListener("click", searchTop)

const requestFilterStart = (tabId, _changeInfo, tabInfo) => {
  if (tabInfo.status == "complete") {
    browser.tabs.sendMessage(tabId, { startFilter: true, timeLimitNumber: timeLimitNumberInput.value, timeLimitUnit: timeLimitUnitSelect.value })
  }
}

// Return a new url that makes a top search on the current page.
const getTopURL = (originalURL) => {
  const t = getTopQueryValue()

  if (originalURL.includes("/r/")) {
    const cleanURL = originalURL.split("/").slice(0, 5).join("/")
    return `${cleanURL}/top/?t=${t}`
  } else {
    return `https://www.reddit.com/top/?t=${t}`
  }
}

// Return a top query value that encapsulates the custom top search.
const getTopQueryValue = () => {
  const timeLimitNumber = timeLimitNumberInput.value
  const timeLimitUnit = timeLimitUnitSelect.value

  switch (timeLimitUnit) {
    case "hour":
      return (timeLimitNumber == 1) ? "hour" : "day"
    case "day":
      if (timeLimitNumber == 1) {
        return "day"
      } else if (timeLimitNumber <= 7) {
        return "week"
      } else {
        return "month"
      }
    case "month":
      return (timeLimitNumber == 1) ? "month" : "year"
    case "year":
      return (timeLimitNumber == 1) ? "year" : "all"
  }
}
