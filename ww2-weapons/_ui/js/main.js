// changed all categories to it's own data set
// need to clean up code
 
/**
 *	Practice sorting data from json
 *
 *	@description
 *		- sample.html has html content from a wikipedia page
 *		- create-data.js takes that html and creates the json data for this page
 *		- this app creates select menus for sorting/displaying the data into specific lists or a chart
 *
 *	@author ZE
 *	@version 1.0
 *	@requires
 *		- jQuery 1.8.3 min
 *		- jQuery Easing
 */

var Playground = {
	init: function() {
		var self = this;

		// global vars
		this.data = null;
		this.dataAllCategories = null;
		this.$content = $('#content'),
		this.$nav = $('select'),
		this.$navCountry = $('#select-country'),
		this.$navCategory = $('#select-category'),
		this.$navChart = $('#chart-category'),
		this.$chart = $('#chart');
		this.elOptionDefault = '<option value="">Please Select One</option>';
		this.elOptionAll = '<option value="ViewAll">View All</option>';
		this.elTooltip = '<div class="tooltip" />';

		this.getData();

	},
	/**
	 * pull in json data
	 * @return {function} [on success, init page layout, bind events and create alternate data for all categories]
	 */
	getData: function() {
		var self = this,
			url = window.location.href.substr(0, location.href.lastIndexOf("/") + 1);

		$.ajax({
			type:'GET',
			url: url + "_ui/js/data.json",
			success: function(data) {
				self.data = data;
				self.success();
			},
			error: function (request, status, error) {
				self.$content.html('<h1>' + request.status + ': Data ' + error + '</h1>');
			},
			dataType:'json'
		});
	},
	/**
	 * init application
	 */
	success: function() {

		console.log(this.data);

		// global cache of data length
		this.countryLength = this.data.country.length;

		this.createCatData();

		this.setCountryNav();
		this.setCategoryNav();
		this.setChartNav();

		this.bindEvents();
	},
	/**
	 * create a specific data object for displaying all categories
	 * @return {object} [new json data object sorted by categories]
	 */
	createCatData: function() {

		// temporary arrays for filtering out duplicate data
		var tempCategories = [],
			tempWeapons = [],
			x = 0;

		// new global data set for all categories
		this.dataAllCategories = {};
		this.dataAllCategories.category = [];

		// loop through all countries in original data set
		for(var i=0, ilen=this.countryLength; i<ilen; i++) {

			// loop through those categories
			for(var j=0, jlen=this.data.country[i].category.length; j<jlen; j++){
				
				// push category into new data set if it doesn't exist already
				if($.inArray(this.data.country[i].category[j].title, tempCategories) === -1) {
					tempCategories.push(this.data.country[i].category[j].title);
					this.dataAllCategories.category[x] = {};
					this.dataAllCategories.category[x].title = this.data.country[i].category[j].title;
					this.dataAllCategories.category[x].weapons = [];
					x++;
				}

				// loop through all weapons in original data
				for(var k=0, klen=this.data.country[i].category[j].weapons.length; k<klen; k++) {

					// push weapons into new data set if it doesn't exist already
					if($.inArray(this.data.country[i].category[j].weapons[k].title, tempWeapons) === -1) {
						tempWeapons.push(this.data.country[i].category[j].weapons[k].title);
						
						// push it into proper category in new data
						for(var l=0, llen=this.dataAllCategories.category.length; l<llen; l++) {
							if(this.data.country[i].category[j].title == this.dataAllCategories.category[l].title) {
								this.dataAllCategories.category[l].weapons.push({
									title: this.data.country[i].category[j].weapons[k].title,
									url: this.data.country[i].category[j].weapons[k].url
								
								});
							}
							// sort weapons alphabetically
							this.dataAllCategories.category[l].weapons.sort( function(a,b) {
								if(a.title > b.title) {
									return 1;
								}
								if(a.title < b.title) {
									return -1;
								}
								return 0;
							});
						}

					}
				}
			}
		}
		// sort categories alphabetically
		this.dataAllCategories.category.sort( function(a,b) {
			if(a.title > b.title) {
				return 1;
			}
			if(a.title < b.title) {
				return -1;
			}
			return 0;
		});
		console.log(this.dataAllCategories);

	},
	/**
	 * create the country select options
	 */
	setCountryNav: function() {

		$(this.$navCountry).append(this.elOptionDefault);
		$(this.$navCountry).append(this.elOptionAll);

		for(var i=0, ilen=this.countryLength; i<ilen; i++) {
			var country = this.data.country[i].title,
				option = $('<option value="' + country + '">' + country + '</option>');

			$(this.$navCountry).append(option);
		}
	},
	/**
	 * create the category select options
	 */
	setCategoryNav: function() {

		var categories = [];

		$(this.$navCategory).append(this.elOptionDefault);
		$(this.$navCategory).append(this.elOptionAll);

		// loop through data go get categories
		for(var i=0, ilen=this.countryLength; i<ilen; i++) {

			for(var j=0, jlen=this.data.country[i].category.length; j<jlen; j++) {

				var category = this.data.country[i].category[j].title;
				
				// push it into local array if it doesn't exist already
				if($.inArray(category, categories) === -1) {
					categories.push(category);
				}
				
			}
		}
		// sort categories alphabetically
		categories.sort(function(a, b){
			return a.localeCompare(b);
		});

		// display options
		for(var i=0, ilen=categories.length; i<ilen; i++) {
			var option = $('<option value="' + categories[i] + '">' + categories[i] + '</option>');

			$(this.$navCategory).append(option);
		}

	},
	/**
	 * create the chart select options
	 */
	setChartNav: function() {

		$(this.$navChart).append(this.elOptionDefault);
		$(this.$navChart).append(this.elOptionAll);

		for(var i=0, ilen=this.countryLength; i<ilen; i++) {
			var country = this.data.country[i].title,
				option = $('<option value="' + country + '">' + country + '</option>');

			$(this.$navChart).append(option);
		}
	},
	/**
	 * display country results
	 * @param  {string} country [country value from select menu]
	 * @return {function} printWeapons [display list of weapons for country selected]
	 */
	showCountry: function(country) {
		$(this.$content).html('');

		for(var i=0, ilen=this.countryLength; i<ilen; i++) {

			// only display results for country selected unless user selected view all
			if(this.data.country[i].title == country || country == 'ViewAll') {

				// create results heading
				$(this.$content).append('<h1><img src="' + this.data.country[i].flag + '"> ' + this.data.country[i].title + '</h1>');
				// create section heading for each category and list of weapons
				for(var j=0, jlen=this.data.country[i].category.length; j<jlen; j++) {

					$(this.$content).append('<h2>' + this.data.country[i].category[j].title + '</h2>');

					this.printWeapons(i, j, this.$content);

				}
			}
		}

	},
	/**
	 * display category results
	 * @param  {string} category [category value from select menu]
	 * @return {function} printWeapons [display list of weapons for country selected]
	 */
	showCategory: function(category) {
		$(this.$content).html('');

		// if showing all categories, use alternate data set that is structured by category instead of country
		if (category == 'ViewAll') {

			// display results heading
			$(this.$content).append('<h1>All Categories</h1>');

			// create section heading for each category and list of weapons
			for(var i=0, ilen=this.dataAllCategories.category.length; i<ilen; i++) {
				
				$(this.$content).append('<h2>' + this.dataAllCategories.category[i].title + '</h2>');
				var ul = $('<ul />');
				$(this.$content).append(ul);

				for(var j=0, jlen=this.dataAllCategories.category[i].weapons.length; j<jlen; j++) {
					if(this.dataAllCategories.category[i].weapons[j].url) {
						$(ul).append($('<li><a href="' + this.dataAllCategories.category[i].weapons[j].url + '" target="_blank" >' + this.dataAllCategories.category[i].weapons[j].title + '</a></li>'));
					} else {
						$(ul).append('<li>' + this.dataAllCategories.category[i].weapons[j].title + '</li>');
					}
				}
			}
		// use default data set if showing only one category
		} else {
			$(this.$content).append('<h1>' + category + '</h1>');

			for(var i=0, ilen=this.countryLength; i<ilen; i++) {
				for(var j=0, jlen=this.data.country[i].category.length; j<jlen; j++) {

					// only show results from category selected
					if(this.data.country[i].category[j].title == category) {
						
						$(this.$content).append('<h2><img src="' + this.data.country[i].flag + '"> ' + this.data.country[i].title + '</h2>');
						
						this.printWeapons(i, j, this.$content);

					}
				}
			}
		}
	},

	/**
	 * display chart results
	 * @param  {string} country [country value from select menu]
	 */
	showChart: function(country) {
		$(this.$content).html('');

		// local chart vars for layout/grid
		var chartMax,
			chartHeight = 300,
			chartWrap = $('<div class="chart-wrap" />'),
			lines = $('<ul class="lines" />'),
			chart = $('<ul class="chart" />');

		$(chartWrap).css('height', chartHeight);

		$(this.$content).append(chartWrap);
		$(chartWrap).append(lines);

		for(var i=0, ilen=this.countryLength; i<ilen; i++) {

			// create chart for single country
			if(this.data.country[i].title == country) {
				chartMax = 15;

				$(chartWrap).append('<h1><img src="' + this.data.country[i].flag + '"> ' + this.data.country[i].title + ' - Weapons per Category</h1>');
				
				$(chartWrap).append(chart);
				$(chart).css('height', chartHeight);

				for(var j=0, jlen=this.data.country[i].category.length; j<jlen; j++) {

					var numCategories = this.data.country[i].category.length,
						liWidth = (100 / numCategories) - 2 + '%',
						numWeapons = this.data.country[i].category[j].weapons.length,
						barHeight = (numWeapons / chartMax * 100) + '%';

					// create bar for each category
					$(chart).append('<li style="width: ' + liWidth + '"><div class="bar bar-' + j + '"></div><p>' + this.data.country[i].category[j].title + '<span>(' + numWeapons + ')</span></p></li>');
					
					// animate the bars into view
					$('.bar-' + j).animate({
						height: barHeight
					}, 200, 'easeInOutExpo');

					// create tooltip for specific weapons in each bar category
					var tooltip = $(this.elTooltip);
					$('.bar-' + j).append(tooltip);
					$(tooltip).append('<h2>' + this.data.country[i].category[j].title + '</h2>');

					this.printWeapons(i, j, tooltip);

				}

			// create chart for all countries
			} else if (country == 'ViewAll') {
				chartMax = 80;

				// only create page heading on first loop
				if(i == 0) {
					$(chartWrap).append('<h1>Total Weapons per Country</h1>');
					$(chartWrap).append(chart);
					$(chart).css('height', chartHeight);
				}

				// count number of weapons in each country
				var numWeapons = 0;
				for(var j=0, jlen=this.data.country[i].category.length; j<jlen; j++) {
					numWeapons += this.data.country[i].category[j].weapons.length;
				}

				var numCategories = this.countryLength,
					liWidth = (100 / numCategories) - 2 + '%',
					barHeight = (numWeapons / chartMax * 100) + '%';
				
				// create bar for each country
				$(chart).append('<li style="width: ' + liWidth + '"><div class="bar bar-' + i + '"></div><p><img src="' + this.data.country[i].flag + '" alt=" ' + this.data.country[i].title + '"><span>(' + numWeapons + ')</span></p></li>');
				
				// animate the bars into view
				$('.bar-' + i).animate({
					height: barHeight
				}, 200, 'easeInOutExpo');

				// create tooltip for specific categories in each bar country
				var ul = $('<ul />');
				var tooltip = $(this.elTooltip);
				$('.bar-' + i).append(tooltip);

				$(tooltip).append('<h2>' + this.data.country[i].title + '</h2>');
				$(tooltip).append(ul);
				for(var j=0, jlen=this.data.country[i].category.length; j<jlen; j++) {
					$(ul).append('<li>' + this.data.country[i].category[j].title + ' (' + this.data.country[i].category[j].weapons.length + ')</li>');
				}

			}
		}

		// create chart labels and grid lines
		$(chartWrap).append('<div class="chart-label min">0</div>');
		$(chartWrap).append('<div class="chart-label max">' + chartMax + '</div>');
		
		if (country == 'ViewAll') {
			chartMax /= 4;
		}
		
		for(var i=0, ilen=chartMax; i<ilen; i++){
			$(lines).append('<li style="height: ' + chartHeight / chartMax + 'px" />');
		}
	},
	/**
	 * reusable function for creating list of weapons 
	 * fired from within showCountry/showCategory/showChart loops
	 * @param  {int} i [country loop position]
	 * @param  {int} j [category loop position]
	 * @param  {obj} targetParent [jQuery element to append the list]
	 */
	printWeapons: function(i, j, targetParent) {

		var ul = $('<ul />');
		$(targetParent).append(ul);

		for(var k=0, klen=this.data.country[i].category[j].weapons.length; k<klen; k++) {
			if(this.data.country[i].category[j].weapons[k].url) {
				$(ul).append($('<li><a href="' + this.data.country[i].category[j].weapons[k].url + '" target="_blank" >' + this.data.country[i].category[j].weapons[k].title + '</a></li>'));
			} else {
				$(ul).append('<li>' + this.data.country[i].category[j].weapons[k].title + '</li>');
			}
		}

	},
	/**
	 * reset select menus when one is updated
	 * @param  {obj} e [dom event]
	 */
	resetNav: function(e) {
		for(var i=0, ilen=this.$nav.length; i<ilen; i++) {
			if(e.currentTarget != this.$nav[i]) {
				this.$nav[i].selectedIndex = 0;
			}
		}
	},
	/**
	 * bind change events on select menus
	 */
	bindEvents: function() {
		var self = this;

		$(this.$navCountry).change(function(e){
			var country = $(this).find('option:selected').val();
			self.showCountry(country);
			self.resetNav(e);
		});

		$(this.$navCategory).change(function(e){
			var category = $(this).find('option:selected').val();
			self.showCategory(category);
			self.resetNav(e);
		});

		$(this.$navChart).change(function(e){
			var country = $(this).find('option:selected').val();
			self.showChart(country);
			self.resetNav(e);
		});

	}
}


// Document Ready
$(document).ready(function() {
	Playground.init();
});