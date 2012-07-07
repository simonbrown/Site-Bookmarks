$(function() {
	$("#newtabcb").change(function() {
		localStorage["innewtab"] = $("#newtabcb").attr("checked") ? "true" : "false";
	});
	
	if (localStorage["innewtab"] == "true" || localStorage["innewtab"] == undefined) $("#newtabcb").attr("checked", true);
	
});