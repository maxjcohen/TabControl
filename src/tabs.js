let maxOpenTabs = 3;
let currentTabs = [];
let trackMessageTabsOnly = true;

async function loadSettings() {
    try {
        const results = await browser.storage.sync.get(["maxOpenTabs", "trackMessageTabsOnly"]);
        if (results && results.maxOpenTabs) {
            maxOpenTabs = results.maxOpenTabs;
        }
        if (typeof results.trackMessageTabsOnly === 'boolean') {
            trackMessageTabsOnly = results.trackMessageTabsOnly;
        }
    } catch (e) {
        console.error(e);
    }
}

async function init() {
    await loadSettings();
    let tabs = await browser.tabs.query({});
    tabs.forEach(async (tab) => {
        browser.tabs.remove(tab.id);
    })
    let currentTabs = [];
}

browser.tabs.onCreated.addListener(async (tab) => {
    if (!trackMessageTabsOnly || tab.type === "messageDisplay") {
        currentTabs.push(tab.id);
    }

    while (currentTabs.length > maxOpenTabs) {
        const idToClose = currentTabs.shift();
        if (idToClose !== undefined) {
            try {
                await browser.tabs.remove(idToClose);
            } catch (e) {
                console.error("Failed to remove tab", idToClose, e);
            }
        }
    }
});

browser.tabs.onRemoved.addListener((tabId) => {
    currentTabs = currentTabs.filter(item => item !== tabId);
});

document.addEventListener("DOMContentLoaded", init);
browser.runtime.onMessage.addListener(loadSettings);
