var CreateData = {
	init: function() {
		var self = this;

		this.content = $('body');

		this.data = {};

		this.getCountries();
	},

	getCountries: function(){

		var section = $('div.section');


		this.data.country = [];

		for(i=0; i<section.length; i++) {
			var title = $(section[i]).find('.mw-headline > a');
			var img = $(section[i]).find('img').attr('src');
			this.data.country[i] = {};
			this.data.country[i].title = title[0].innerText;
			this.data.country[i].flag = img;

			var category = $(section[i]).find('h3');
			this.data.country[i].category = [];

			for(j=0; j<category.length; j++){
				this.data.country[i].category[j] = {};
				this.data.country[i].category[j].title = category[j].innerText;
				this.data.country[i].category[j].weapons = [];

				// var weaponName = $(category[j]).find('+ ul li > a');

				// for(k=0; k<weaponName.length; k++) {
				// 	this.data.country[i].category[j].weapons[k] = {};
				// 	this.data.country[i].category[j].weapons[k].title = weaponName[k].innerText;
				// 	this.data.country[i].category[j].weapons[k].url = $(weaponName[k]).attr('href');
				// }
				
				var weaponName = $(category[j]).find('+ ul li');

				for(k=0; k<weaponName.length; k++) {
					this.data.country[i].category[j].weapons[k] = {};

					var anchor = $(weaponName[k]).find('> a');
					if(anchor){
						this.data.country[i].category[j].weapons[k].title = weaponName[k].innerText;
						this.data.country[i].category[j].weapons[k].url = $(anchor).attr('href');
					} else {
						this.data.country[i].category[j].weapons[k].title = weaponName[k].innerText;
						this.data.country[i].category[j].weapons[k].url = '';
					}
					this.data.country[i].category[j].weapons.sort( function(a,b) {
						if (a.title > b.title)
							return 1;
						if (a.title < b.title)
							return -1;
						return 0;
					});
				}

				this.data.country[i].category.sort( function(a,b) {
					if (a.title > b.title)
						return 1;
					if (a.title < b.title)
						return -1;
					return 0;
				});
			}
		}
		console.log(this.data);
		//console.log(JSON.stringify(this.data));
		$('body').prepend(JSON.stringify(this.data));
	}
}



// Document Ready
$(document).ready(function() {
	CreateData.init();
});