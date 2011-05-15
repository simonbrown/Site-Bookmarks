var domainMenus = {};

function registerBookmark(bookmark)
{
	var curdomain = getdomain(bookmark.url);
	
	var domainMenuId = undefined;
	if (domainMenus[curdomain] == undefined)
	{
		var domainMenuId = chrome.contextMenus.create({
			"title": curdomain,
			"documentUrlPatterns": [ "*://"+curdomain+"/*" ]
		}, undefined);
		if (curdomain == undefined) console.log(bookmark);
		
		domainMenus[curdomain] = domainMenuId;
	} else {
		domainMenuId = domainMenus[curdomain];
	}
	
	var itemTitle = bookmark.title;
	if (itemTitle == "" || itemTitle == undefined) itemTitle = "Untitled bookmark";
	
	var bookmarkMenuId = chrome.contextMenus.create({
		"title": itemTitle,
		"parentId": domainMenuId,
		"onclick": opentab.curry(bookmark.url)
	}, undefined);
}

function populatebookmarkmenu()
{
	chrome.contextMenus.removeAll(function() {
		domainMenus = {};
		bookmarkMenuId = {};
		chrome.bookmarks.getTree(function(results) {
			// Add the bookmarks to a linear array.
			var bookmarklist = [];
			var listbookmarks = function(bookmarks) {
				for (var i in bookmarks) {
					if (bookmarks[i].children) listbookmarks(bookmarks[i].children);
					else {
						registerBookmark(bookmarks[i]);
					}
				}
			}
			listbookmarks(results);
		});
	});
}
populatebookmarkmenu();

chrome.bookmarks.onChanged.addListener(function(id, changeInfo) { populatebookmarkmenu(); });
chrome.bookmarks.onImportEnded.addListener(function() { populatebookmarkmenu(); } );
chrome.bookmarks.onCreated.addListener(function(id, bookmark) { populatebookmarkmenu(); });
chrome.bookmarks.onRemoved.addListener(function(id, removeInfo) { populatebookmarkmenu(); });

function toArray(enum) { return Array.prototype.slice.call(enum); }

function opentab(url, info, tab)
{
	if (localStorage["innewtab"] == undefined || localStorage["innewtab"] == "true")
	{
		chrome.tabs.create({ "url": url });
		
	}
	else
	{
		chrome.tabs.update(tab["id"], { "url": url });
	}
}

function getdomain(input)
{
	if (input.indexOf("file:///") == 0) return "files";
	if (input.indexOf("javascript:") == 0) return "bookmarklets";
	
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