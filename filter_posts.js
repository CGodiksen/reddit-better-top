// Filter the initial posts and start the mutation observer that filters subsequent posts.
const startFilter = (time_limit) => {
  // TODO: Start the mutation observer.
  // TODO: Filter the initial posts.
}

// Remove the given post if it was posted after the given time limit.
const filterPost = (post, time_limit) => {
  // TODO: Find the time the post was posted.
  // TODO: Remove it, if it was posted after the given time limit.
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

// Create an observer that filters a post every time it is added to the document.
const observer = new MutationObserver((mutationList, _observer) => {
  mutationList.forEach(mutation => {
    if (mutation.type == "childList" && mutation.addedNodes.length > 0) {
      mutation.addedNodes.forEach((node) => {
        // If the new node is a post then check if it should be filtered.
        if (node.tagName == "DIV" && node.id == "" && node.className == "" && Math.random() < 0.5) {
          node.remove()
        }
      })
    }
  })
});

observer.observe(document, { childList: true, subtree: true });

browser.runtime.onMessage.addListener(request => {
  // Message received from the browser action, sent when "search" button is clicked.
  if (request.startFilter) {
    console.log(request.test);
    // startFilter(request.time_limit)
  }
});