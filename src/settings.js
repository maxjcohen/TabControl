function saveSettings(e) {
    e.preventDefault();
    browser.storage.sync.set({
	maxOpenTabs: document.querySelector("#maxOpenTabs").value
    });
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
