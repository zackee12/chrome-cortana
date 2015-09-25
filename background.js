function getUrlParameter(url, name){
	var re = new RegExp("[\?&]"+name+"=([^&#]*)");
	match = re.exec(url);
	if (match === null) {
		return null;
	}
	return match[1];
}

function restoreIcon(){
	chrome.browserAction.setIcon({"path": "icon.png"})
}

function initSearchEngine() {
	// get the current value 
	chrome.storage.sync.get("se", function (items){
		// if the value hasn't been set yet then default to google
		if (typeof items.se == 'undefined'){
			chrome.storage.sync.set({"se": search_engine})
		} else {
			search_engine = items.se;
		}
	})
	// add change listener to update search engine
	chrome.storage.onChanged.addListener(function(changes, namespace){
		if (typeof changes.se != 'undefined') {
			console.log("detected change in search engine from '"+changes.se.oldValue+"' to '"+changes.se.newValue+"'");
			search_engine = changes.se.newValue;
		}
	})
}

function initBeforeRequestListener(){
	// redirect cortana requests to chosen search engine
	chrome.webRequest.onBeforeRequest.addListener(
		// callback
		function (details) {
			query = getUrlParameter(details.url, "q");
			// do nothing if the query isn't found
			if (query === null) {
				console.log("failed to find query in '"+details.url+"'");
				return {"cancel": false};
			} else {
				url = search_engine.replace("%s", query);
				console.log("redirecting '"+details.url+"' to '"+url+"'");
				
				// set and reset the action icon after 2 seconds
				chrome.browserAction.setIcon({"path": "icon-action.png"})
				setTimeout(restoreIcon, 2000);
				return {"redirectUrl": url};
			}
		},
		// filters
		{
			urls: [
				"*://*.bing.com/search*form=WNSGPH*", // typed search
				"*://*.bing.com/search*form=WNSBOX*", // voice search
				"*://*.bing.com/search*form=WNSFC2*"  // more results on bing search
			],
			types: ["main_frame"]
		},
		// extraInfoSpec
		["blocking"]
	);
}

function init() {
	initSearchEngine();
	initBeforeRequestListener();
}

search_engine = "https://www.google.com/search?q=%s";
init();
