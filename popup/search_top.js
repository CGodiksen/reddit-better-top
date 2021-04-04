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

// TODO: Turn off search button if the current page is not a subreddit or the reddit frontpage.
// TODO: Send a message to the content script when the "search" button is clicked. The message should contain the time limit.
// TODO: When the button is clicked first reload the page with a url that matches the given time limit.
// TODO: Test if content script url match calling can be removed since it is called from here.