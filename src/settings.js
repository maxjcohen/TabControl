function saveSettings(e) {
  e.preventDefault();
  browser.storage.sync.set({
    maxOpenTabs: document.querySelector("#maxOpenTabs").value,
    closeDuplicateTabs: document.querySelector("#closeDuplicateTabs").checked
  });
  browser.runtime.sendMessage({});
}

function restoreSettings() {
  function setMaxOpenTabs(result) {
    document.querySelector("#maxOpenTabs").value = result.maxOpenTabs || 3;
  }
  function setCloseDuplicateTabs(result) {
    document.querySelector("#closeDuplicateTabs").checked =
      result.closeDuplicateTabs | false;
  }
  function onError(error) {
    console.log(error);
  }

  let currentMaxOpenTabs = browser.storage.sync.get("maxOpenTabs");
  let currentCloseDuplicateTabs =
    browser.storage.sync.get("closeDuplicateTabs");

  currentMaxOpenTabs.then(setMaxOpenTabs, onError);
  currentCloseDuplicateTabs.then(setCloseDuplicateTabs, onError);
}

document.addEventListener("DOMContentLoaded", restoreSettings);
document.querySelector("form").addEventListener("submit", saveSettings);
