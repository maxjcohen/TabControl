function saveSettings(e) {
    e.preventDefault();
    const max = parseInt(document.querySelector("#maxOpenTabs").value, 10) || 3;
    const track = document.querySelector("#trackMessageTabsOnly").checked;
    browser.storage.sync.set({
        maxOpenTabs: max,
        trackMessageTabsOnly: track
    });
    browser.runtime.sendMessage({ settingsUpdated: true });
}

function restoreSettings() {
    function setCurrentValue(result) {
        document.querySelector("#maxOpenTabs").value = result.maxOpenTabs || 3;
        document.querySelector("#trackMessageTabsOnly").checked = (typeof result.trackMessageTabsOnly === 'boolean') ? result.trackMessageTabsOnly : true;
    }
    function onError(error) {
        console.log(error);
    }

    let current = browser.storage.sync.get(["maxOpenTabs", "trackMessageTabsOnly"]);
    current.then(setCurrentValue, onError);
}

document.addEventListener("DOMContentLoaded", restoreSettings);
document.querySelector("form").addEventListener("submit", saveSettings);
