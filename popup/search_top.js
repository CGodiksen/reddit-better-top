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

// Reload the page and send a message to the content script requesting post filtering according to the selected time limit.
const searchTop = () => {
  browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
    browser.tabs.reload(tabs[0].id);
  }, console.error)
}

searchTopBtn.addEventListener("click", searchTop)

// Enable the search button if the current active tab is a Reddit page that has the "Top" feature.
const enableIfRedditTop = () => {
  browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
      const tab = tabs[0];
      const split_url = tab.url.split("/")

      // Only considering pages that have the "Top" feature.
      if (tab.url === "https://www.reddit.com/" || (split_url[3] === "r" && ["", "hot", "new", "top"].includes(split_url[5]))) {
        searchTopBtn.removeAttribute("disabled")
      }
    }, console.error)
}

enableIfRedditTop()

// TODO: Send a message to the content script when the "search" button is clicked. The message should contain the time limit.
// TODO: When the button is clicked first reload the page with a url that matches the given time limit.
// TODO: Test if content script url match calling can be removed since it is called from here.