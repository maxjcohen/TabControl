let maxOpenTabs = 3;
let currentTabs = [];
let displayedMessageTabs = {};
let closeDuplicateTabs = true;

browser.tabs.onCreated.addListener(async (tab) => {
  if (tab.type == "messageDisplay") {
    currentTabs.push(tab.id);

    var displayedMessages = await browser.messageDisplay.getDisplayedMessages(
      tab.id
    );
    for (const displayedMessage of displayedMessages) {
      if (displayedMessageTabs[displayedMessage.id]) {
        let tabToRemove = displayedMessageTabs[displayedMessage.id];
        if (closeDuplicateTabs) {
          browser.tabs.remove(tabToRemove);
        }
      }
      displayedMessageTabs[displayedMessage.id] = tab.id;
    }
    if (currentTabs.length > maxOpenTabs) {
      browser.tabs.remove(currentTabs.shift());
    }
  }
});

browser.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
  currentTabs = currentTabs.filter((item) => item !== tabId);
});

async function loadVariables() {
  function onGetMaxOpenTabs(results) {
    if (results.maxOpenTabs) {
      maxOpenTabs = results.maxOpenTabs;
    }
  }

  function onCloseDuplicateTabs(results) {
    if (results.closeDuplicateTabs != undefined) {
      closeDuplicateTabs = results.closeDuplicateTabs;
      console.log(closeDuplicateTabs);
    }
  }

  function onError(error) {
    console.log(error);
  }

  let currentMaxOpenTabs = browser.storage.sync.get("maxOpenTabs");
  currentMaxOpenTabs.then(onGetMaxOpenTabs, onError);

  let currentCloseDuplicateTabs =
    browser.storage.sync.get("closeDuplicateTabs");
  currentCloseDuplicateTabs.then(onCloseDuplicateTabs, onError);
}

async function loadCloseDuplicateTabs() {
  function onGet(results) {
    if (results.closeDuplicateTabs) {
      closeDuplicateTabs = results.closeDuplicateTabs;
    }
  }
  function onError(error) {
    console.log(error);
  }

  let current = browser.storage.sync.get("closeDuplicateTabs");
  current.then(onGet, onError);
}

document.addEventListener("DOMContentLoaded", loadVariables);
browser.runtime.onMessage.addListener(loadVariables);
