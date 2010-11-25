function populatebookmarkmenu()
{
	chrome.contextMenus.removeAll(function() {
		chrome.bookmarks.getTree(function(results) {
			// Add the bookmarks a linear array.
			var bookmarklist = []
			var listbookmarks = function(bookmarks) {
				for (var i in bookmarks) {
					if (bookmarks[i].children) listbookmarks(bookmarks[i].children);
					else {
						bookmarklist.push(bookmarks[i]);
					}
				}
			}
			listbookmarks(results);
			
			if (bookmarklist.length > 0)
			{
				var domainMenus = {}
				
				for (var i in bookmarklist) {
					var curdomain = getdomain(bookmarklist[i].url);
					
					var menuId = undefined;
					if (domainMenus[curdomain] == undefined)
					{
						menuId = chrome.contextMenus.create({
							"title": curdomain,
							"documentUrlPatterns": [ "*://"+curdomain+"/*" ]
						}, undefined);
						
						domainMenus[curdomain] = menuId;
					} else {
						menuId = domainMenus[curdomain];
					}
					
					chrome.contextMenus.create({
						"title": bookmarklist[i].title,
						"parentId": menuId,
						"onclick": opentab.curry(bookmarklist[i].url)
					}, undefined);
				}
			}
		});
	});
}
populatebookmarkmenu();

chrome.bookmarks.onChanged.addListener(function(id, changeInfo) { populatebookmarkmenu(); });
chrome.bookmarks.onCreated.addListener(function(id, bookmark) { populatebookmarkmenu(); });
chrome.bookmarks.onRemoved.addListener(function(id, removeInfo) { populatebookmarkmenu(); });
chrome.bookmarks.onImportEnded.addListener(function() { populatebookmarkmenu(); } );

function opentab(url) { chrome.tabs.create({ "url": url }); }
function toArray(enum) { return Array.prototype.slice.call(enum); }

function getdomain(input)
{
	var urlParts = input.split("/");
	var urlDomain = urlParts[2];
	
	return urlDomain;
}

Function.prototype.curry = function()
{
	// Nothing to curry.
	if (arguments.length == 0) return this;
	
	var __method = this;
	var args = toArray(arguments);
	
	return function() { return __method.apply(this, args.concat(toArray(arguments))); };
}