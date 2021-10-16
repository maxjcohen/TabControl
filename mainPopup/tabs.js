async function closeAllTabs() {
    let tabs = await browser.tabs.query({});
    tabs.forEach(async (tab) => {
	browser.tabs.remove(tab.id);
    })
}

closeAllTabs();
