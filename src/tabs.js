let opened_tabs = [];

browser.tabs.onCreated.addListener(async (tab) => {
    if (tab.type == "messageDisplay") {
	opened_tabs.push(tab.id);
    }
    if (opened_tabs.length > 3) {
	browser.tabs.remove(opened_tabs.shift())
    }
});

browser.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
    opened_tabs = opened_tabs.filter(item => item !== tabId);
});
