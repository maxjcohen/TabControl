let maxOpenTabs = 3;
let currentTabs = [];
let trackMessageTabsOnly = true;

// Load settings from storage
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
    // After loading settings, update current tabs
    await getCurrentTabs();
    await updateCurrentTabs();
}
browser.runtime.onMessage.addListener(loadSettings);

async function getCurrentTabs() {
    let tabs = await browser.tabs.query({});
    currentTabs = [];
    tabs.forEach((tab) => {
        if (!trackMessageTabsOnly || tab.type === "messageDisplay") {
            currentTabs.push(tab.id);
        }
    });
}


// Update current tabs and close excess tabs if necessary
async function updateCurrentTabs() {
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
}

// Initialize the extension
async function init() {
    await loadSettings();
    await getCurrentTabs();
    await updateCurrentTabs();
}
document.addEventListener("DOMContentLoaded", init);

// Listen for tab creation and removal events
browser.tabs.onCreated.addListener(async (tab) => {
    if (!trackMessageTabsOnly || tab.type === "messageDisplay") {
        currentTabs.push(tab.id);
    }

    await updateCurrentTabs();
});
browser.tabs.onRemoved.addListener((tabId) => {
    currentTabs = currentTabs.filter(item => item !== tabId);
});