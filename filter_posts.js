// Return a mutation observer that calls the given callback for each node that is added to the DOM.
const createMutationObserver = (callback) => {
  return new MutationObserver((mutationList, _observer) => {
    mutationList.forEach(mutation => {
      if (mutation.type == "childList" && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          callback(node)
        })
      }
    })
  })
}

// Filter the initial posts and start the mutation observer that filters subsequent posts.
const startFilter = (timeLimitNumber, timeLimitUnit) => {
  for (const post of getInitialPosts()) {
    filterPost(post, timeLimitNumber, timeLimitUnit)
  }

  // Create an observer that filters a post every time it is added to the document.
  const postObserver = createMutationObserver((node) => {
    if (node.tagName == "DIV" && node.id == "" && node.className == "" && node.firstChild.firstChild) {
      filterPost(node.firstChild.firstChild, timeLimitNumber, timeLimitUnit)
    }
  })

  postObserver.observe(document, { childList: true, subtree: true });
}

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
const filterPost = (post, timeLimitNumber, timeLimitUnit) => {
  const postInfo = post.getElementsByTagName("a")
  const postedTime = Array.from(postInfo).filter(post => post.getAttribute("data-click-id") == "timestamp")[0].innerHTML.split(" ")

  const postedTimeNumber = parseInt(postedTime[0])
  const postedTimeUnit = postedTime[1]

  if (outsideTimeLimit(timeLimitNumber, timeLimitUnit, postedTimeNumber, postedTimeUnit)) {
    post.remove()
  }
}

// Return true if the posted time is outside the given time limit.
const outsideTimeLimit = (timeLimitNumber, timeLimitUnit, postedTimeNumber, postedTimeUnit) => {
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
    startFilter(request.timeLimitNumber, request.timeLimitUnit)
  }
})

// Add commonly used options to the "Top" dropdown menu on the page itself.
const addTopOptions = (topDropdown) => {
  createTopOption("Three Days", "week", 3, "day", topDropdown, 2)
  createTopOption("Two Weeks", "month", 14, "day", topDropdown, 4)
  createTopOption("Six Months", "year", 6, "month", topDropdown, 6)
}

// Create an observer that adds the custom top options when the "Top" dropdown is opened. 
const topObserver = createMutationObserver((node) => {
  if (node.tagName == "DIV" && node.id == "" && node.className == "_2uYY-KeuYHKiwl-9aF0UiL Sgi9lgQUrox4tW9Q75iif isNotInIcons2020") {
    addTopOptions(node)
  }
})

topObserver.observe(document, { childList: true, subtree: true });

// Create a new top option that has a click event listener which starts the specified filter when the tab is reloaded.
const createTopOption = (optionName, t, timeLimitNumber, timeLimitUnit, topDropdown, insertAt) => {
  const existingOption = document.getElementsByClassName("_39Glgtoolpdt4PIzcnjPSW _3LwUIE7yX7CZQKmD2L87vf _3LjUrsRA9MkUFLGB6ZCWaX _1oYEKCssGFjqxQ9jJMNj5G")[insertAt + 5]
  const newOption = existingOption.cloneNode(true)

  newOption.setAttribute("href", `${newOption.href.split("=")[0]}=${t}`)
  newOption.firstChild.innerHTML = optionName

  newOption.addEventListener("click", () => {
    // Send a message to the background script which can start the filter when the tab is updated.
    browser.runtime.sendMessage({ startFilterOnUpdate: true, timeLimitNumber: timeLimitNumber, timeLimitUnit: timeLimitUnit })
  })

  topDropdown.insertBefore(newOption, existingOption)
}