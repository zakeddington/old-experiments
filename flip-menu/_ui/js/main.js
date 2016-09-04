
window.onload = (function(){
	
	var toggle = false,
		title = document.getElementById('menu-title'),
		menu = document.getElementById('menu'),
		menuLI = menu.childNodes,
		liArray = [];

	for (var i in menuLI) {
	    if (menuLI[i].nodeType == 1) {
	        liArray.push(menuLI[i]);
	    }
	}

	title.onclick = function(e){
		e.preventDefault();

		if (!toggle && title.className == "closed"){
			var i = 0;
			var flip = setInterval(function(){
				liArray[i].className = "flip-down";
				i++;
				if(i >= liArray.length) {
					clearInterval(flip);
					title.className = "open";
				}
			}, 500);
			toggle = true;
		} else if (toggle && title.className == "open") {
			var i = liArray.length - 1;
			var flip = setInterval(function(){
				liArray[i].className = "flip-up";
				i--;
				if(i < 0) {
					clearInterval(flip);
					title.className = "closed";
				}
			}, 500);
			toggle = false;
		} else {
			return;
		}
	};

});