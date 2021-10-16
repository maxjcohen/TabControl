async function closeAllTabs() {
    let tabs = await browser.tabs.query({
	type: "messageDisplay"
    });
    tabs.forEach(async (tab) => {
	browser.tabs.remove(tab.id);
    })
}

function waitclose() {
    setTimeout(closeAllTabs, 500);
}

document.addEventListener("DOMContentLoaded", waitclose);
