function saveSettings(e) {
    e.preventDefault();
    const max = parseInt(document.querySelector("#maxOpenTabs").value, 10) || 3;
    browser.storage.sync.set({
        maxOpenTabs: max,
    });
    browser.runtime.sendMessage({settingsUpdated: true});
}

function restoreSettings() {
    function setCurrentValue(result) {
        document.querySelector("#maxOpenTabs").value = result.maxOpenTabs || 3;
    }
    function onError(error) {
        console.log(error);
    }

    let current = browser.storage.sync.get("maxOpenTabs");
    current.then(setCurrentValue, onError);
}

document.addEventListener("DOMContentLoaded", restoreSettings);
document.querySelector("form").addEventListener("submit", saveSettings);
