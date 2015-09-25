function handleClick(event){
	console.log("saving new search engine path as '"+this.value+"'");
	chrome.storage.sync.set({"se": this.value}, function(){
		console.log("settings saved");
	})
}

function init(){
	// add click handlers to all radio buttons
	se_radio = document.querySelectorAll("input[type=radio][name=se]");
	se_radio_checked = document.querySelector("input[type=radio][name=se][checked]")
	for (i=0;i<se_radio.length;++i){
		se_radio[i].addEventListener('click', handleClick);
	}
	// get and set the correct radio button
	chrome.storage.sync.get("se", function (items){
		if (items.se !== se_radio_checked.value) {
			se_radio_checked.removeAttribute("checked");
			se_radio_checked = document.querySelector("input[type=radio][name=se][value='"+items.se+"']")
			se_radio_checked.checked = true;
		}
	})
}

init();

