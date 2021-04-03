// Create an observer that filters a post every time it is added to the document.
const observer = new MutationObserver((mutationList, _observer) => {
  mutationList.forEach(mutation => {
    if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
      mutation.addedNodes.forEach((node) => {
        // If the new node is a post then check if it should be filtered.
        if (node.childNodes.length > 0) {
          if (node.id == "" && node.className == "" && Math.random() < 0.5) {
            node.remove()
          }
        }
      })
    }
  })
});

observer.observe(document, { childList: true, subtree: true });