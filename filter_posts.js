// TODO: Add Hours option to custom time limit.
// TODO: Add more options to the "Top" menu on the page itself.
// TODO: Apply validation to input when button is clicked.

// Global state keeping track of current custom time limit, if any.
let timeLimitNumber = 0
let timeLimitUnit = ""

// Filter the initial posts and start the mutation observer that filters subsequent posts.
const startFilter = () => {
  for (const post of getInitialPosts()) {
    filterPost(post)
  }

  observer.observe(document, { childList: true, subtree: true });
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

// TODO: Handle edge case with days and "1 month" (also handle "1 day" when hours is added). Maybe just change "1 month" to "31 days" and "1 day" to "24 hours" in function. (1 year)
// Remove the given post if it was posted after the given time limit.
const filterPost = (post) => {
  const postedTime = post.getElementsByTagName("a")[1].innerHTML.split(" ")
  
  const postedTimeNumber = parseInt(postedTime[0])
  const postedTimeUnit = postedTime[1]

  if (postedTimeUnit.includes(timeLimitUnit) && postedTimeNumber > timeLimitNumber) {
    post.remove()
  }
}

// Create an observer that filters a post every time it is added to the document.
const observer = new MutationObserver((mutationList, _observer) => {
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
});

browser.runtime.onMessage.addListener(request => {
  // Message received from the browser action, sent when "search" button is clicked.
  if (request.startFilter) {
    // Set global state with new custom time limit.
    timeLimitNumber = request.timeLimitNumber
    timeLimitUnit = request.timeLimitUnit

    startFilter()
  }
});