let maxOpenTabs = 3;
let currentTabs = [];
let trackMessageTabsOnly = true;

// Helper function to check if a tab should be tracked
function shouldTrackTab(tab) {
    return !trackMessageTabsOnly || tab.type === "messageDisplay";
}

// Load settings from storage
async function loadSettings() {
    try {
        const { maxOpenTabs: savedMaxTabs, trackMessageTabsOnly: savedTrackMode } = 
            await browser.storage.sync.get(["maxOpenTabs", "trackMessageTabsOnly"]);
        
        if (savedMaxTabs) {
            maxOpenTabs = savedMaxTabs;
        }
        if (typeof savedTrackMode === 'boolean') {
            trackMessageTabsOnly = savedTrackMode;
        }
    } catch (e) {
        console.error("Failed to load settings:", e);
    }
    // After loading settings, update current tabs
    await getCurrentTabs();
    await updateCurrentTabs();
}
browser.runtime.onMessage.addListener(loadSettings);

async function getCurrentTabs() {
    const tabs = await browser.tabs.query({});
    currentTabs = tabs
        .filter(shouldTrackTab)
        .map(tab => tab.id);
}


// Update current tabs and close excess tabs if necessary
async function updateCurrentTabs() {
    while (currentTabs.length > maxOpenTabs) {
        const idToClose = currentTabs.shift();
        try {
            await browser.tabs.remove(idToClose);
        } catch (e) {
            console.error("Failed to remove tab", idToClose, e);
        }
    }
}

// Initialize the extension
async function init() {
    await loadSettings();
}
document.addEventListener("DOMContentLoaded", init);

// Listen for tab creation and removal events
browser.tabs.onCreated.addListener(async (tab) => {
    if (shouldTrackTab(tab)) {
        currentTabs.push(tab.id);
        await updateCurrentTabs();
    }
});
browser.tabs.onRemoved.addListener((tabId) => {
    currentTabs = currentTabs.filter(item => item !== tabId);
});