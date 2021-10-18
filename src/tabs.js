let maxOpenTabs = 3;
let currentTabs = [];

browser.tabs.onCreated.addListener(async (tab) => {
    if (!tab.type || tab.type == "messageDisplay") {
	currentTabs.push(tab.id);
    }
    if (currentTabs.length > maxOpenTabs) {
	browser.tabs.remove(currentTabs.shift())
    }
});

browser.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
    currentTabs = currentTabs.filter(item => item !== tabId);
});

async function loadMaxOpenTabs() {
    function onGet(results) {
	if (results.maxOpenTabs) {
	    maxOpenTabs = results.maxOpenTabs;
	}
    }
    function onError(error) {
	console.log(error);
    }

    let current = browser.storage.sync.get("maxOpenTabs");
    current.then(onGet, onError);
}

async function closeAllTabs() {
    let tabs = await browser.tabs.query({});
    tabs.forEach(async (tab) => {
	browser.tabs.remove(tab.id);
    })
}

document.addEventListener("DOMContentLoaded", loadMaxOpenTabs);
document.addEventListener("DOMContentLoaded", closeAllTabs);
browser.runtime.onMessage.addListener(loadMaxOpenTabs);
