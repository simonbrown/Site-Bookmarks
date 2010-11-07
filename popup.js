$(document).ready(function(){
	chrome.bookmarks.getTree(function(results) {
		chrome.tabs.getSelected(undefined, function(tab) {
			var domain = getdomain(tab.url);
			
			$(".title").html(domain);
			
			listbookmarks(results, domain);
			
			$(".bookmarks li a").bind("click", function(event) {
				chrome.tabs.create({ "url": $(this).attr("href") }, undefined);
			});
		});
	});
});

function listbookmarks(bookmarklist, domain)
{
	for (var i in bookmarklist)
	{
		if (bookmarklist[i].children) listbookmarks(bookmarklist[i].children, domain);
		else
		{
			if(getdomain(bookmarklist[i].url) == domain)
			{
				var itemlink = $("<a></a>");
				itemlink.html(bookmarklist[i].title);
				itemlink.attr("href", bookmarklist[i].url);
				itemlink.attr("title", bookmarklist[i].url);
				
				var listitem = $("<li></li>");
				listitem.append(itemlink);
				
				$(".bookmarks").append(listitem);
			}
		}
	}
}

function getdomain(input)
{
	var urlParts = input.split("/");
	var urlDomain = urlParts[2];
	
	return urlDomain;
}