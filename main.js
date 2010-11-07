function tabchanged(tab)
{
	chrome.pageAction.show(tab.id);
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) { tabchanged(tab); });
chrome.tabs.onCreated.addListener(function(tab) { tabchanged(tab) });