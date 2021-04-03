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