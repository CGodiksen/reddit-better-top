# Reddit Better Top
Browser extension offering more time options for the "Top" feature on Reddit. 

Currently Reddit only allows you to see the top posts within today, the last week, the last month, the last year and all time. This browser extensions adds more time options, making it possible to also see top posts within the last two weeks, two months, six months and two years. The extension also makes it possible to add your own custom time options.

## Supported Browsers

## Usage

## Design
The extension should have a browser action that has a dropdown with the expanded Top time options. This drop down should also have the existing time options. There should also be custom options that shows a dropdown and number input which allows the user to choose between days, months and years in the dropdown and specify how many days/months/years in the number input. Finally the action should have a "Search" button that is active when the current tab is on reddit.com where the top option is applicable. This button should send a message to the content script which handles removing posts that are not within the time option.

If a custom top limit is used then go to the URL of the actual top limit that is just above that limit. For example if 6 months is used then it should use the url for one year. Use MutationObserver to look for when a new post is added to the page. If the post is older than the custom top limit then block it. Test if the post can be blocked before it is added, otherwise add them to block list and reload the page. When the user leaves the page or changes the top limit then empty the block list.
