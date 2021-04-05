// TODO: Apply validation to input when button is clicked.

// Global state keeping track of current custom time limit, if any.
let timeLimitNumber = 0
let timeLimitUnit = ""

// Filter the initial posts and start the mutation observer that filters subsequent posts.
const startFilter = () => {
  for (const post of getInitialPosts()) {
    filterPost(post)
  }

  postObserver.observe(document, { childList: true, subtree: true });
}

// Create an observer that filters a post every time it is added to the document.
const postObserver = new MutationObserver((mutationList, _observer) => {
  mutationList.forEach(mutation => {
    if (mutation.type == "childList" && mutation.addedNodes.length > 0) {
      mutation.addedNodes.forEach((node) => {
        // If the new node is a post then check if it should be filtered.
        if (node.tagName == "DIV" && node.id == "" && node.className == "" && node.firstChild.firstChild) {
          filterPost(node.firstChild.firstChild)
        }
      })
    }
  })
})

// Return list containing the post that are loaded initially on the page and therefore not caught by the mutation observer.
const getInitialPosts = () => {
  const initialPosts = []
  divs = document.getElementsByTagName("div")

  for (const div of divs) {
    if (div.firstChild && div.firstChild.textContent.includes("Posted by") && div.firstChild.className.includes("Post")) {
      initialPosts.push(div.firstChild)
    }
  }

  return initialPosts
}

// Remove the given post if it was posted after the given time limit.
const filterPost = (post) => {
  const postedTime = post.getElementsByTagName("a")[1].innerHTML.split(" ")

  const postedTimeNumber = parseInt(postedTime[0])
  const postedTimeUnit = postedTime[1]

  if (outsideTimeLimit(postedTimeNumber, postedTimeUnit)) {
    post.remove()
  }
}

const outsideTimeLimit = (postedTimeNumber, postedTimeUnit) => {
  // Handle edge cases.
  if (postedTimeNumber == 1) {
    switch (postedTimeUnit) {
      case "day":
        postedTimeNumber = 24
        postedTimeUnit = "hour"
        break;
      case "month":
        postedTimeNumber = 31
        postedTimeUnit = "day"
        break;
      case "year":
        postedTimeNumber = 12
        postedTimeUnit = "month"
        break;
    }
  }

  return postedTimeUnit.includes(timeLimitUnit) && postedTimeNumber > timeLimitNumber
}

browser.runtime.onMessage.addListener(request => {
  // Message received from the browser action, sent when "search" button is clicked.
  if (request.startFilter) {
    // Set global state with new custom time limit.
    timeLimitNumber = request.timeLimitNumber
    timeLimitUnit = request.timeLimitUnit

    startFilter()
  }
})

// Add commonly used options to the "Top" dropdown menu on the page itself.
const addTopOptions = () => {
  const topDropdown = document.getElementsByClassName("_2uYY-KeuYHKiwl-9aF0UiL Sgi9lgQUrox4tW9Q75iif isNotInIcons2020")[0]

  const twoWeeksOption = createTopOption("Last Two Weeks", "month", 14, "day")
  topDropdown.appendChild(twoWeeksOption)
}

// Create an observer that adds an event listener which adds the custom top options when the "Top" dropdown menu is clicked. 
const topObserver = new MutationObserver((mutationList, _observer) => {
  mutationList.forEach(mutation => {
    if (mutation.type == "childList" && mutation.addedNodes.length > 0) {
      mutation.addedNodes.forEach((node) => {
        // If the new node is the "Top" dropdown menu then add event listener.
        if (node.tagName == "DIV" && node.id == "" && node.className == "_29FQ-HlVE3aNu0iB8mO-ey GzkzdrqG-NjAYH7eKJan4" && node.firstChild.firstChild) {
          node.firstChild.firstChild.addEventListener("click", () => {
            console.log("hello");
          })
        }
      })
    }
  })
})

topObserver.observe(document, { childList: true, subtree: true });

// Return a new "a" tag that has a click event listener which starts the specified filter when the tab is reloaded.
const createTopOption = (optionName, t, timeLimitNumber, timeLimitUnit) => {
  const newOption = document.getElementsByClassName("_39Glgtoolpdt4PIzcnjPSW _3LwUIE7yX7CZQKmD2L87vf _3LjUrsRA9MkUFLGB6ZCWaX _1oYEKCssGFjqxQ9jJMNj5G")[5].cloneNode(true)

  newOption.setAttribute("href", `${newOption.href.slice(0, -4)}${t}`)
  newOption.firstChild.innerHTML = optionName

  newOption.addEventListener("click", () => {
    // Send a message to the background script which can start the filter when the tab is updated.
    browser.runtime.sendMessage({ startFilterOnUpdate: true, timeLimitNumber: timeLimitNumber, timeLimitUnit: timeLimitUnit })
  })

  return newOption
}