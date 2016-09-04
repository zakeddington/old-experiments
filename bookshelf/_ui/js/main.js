// added open book with multiple pages that turn and stays on that page when returning book
// added multiple rows of books

var Books = new Object();

Books = {

	init: function() {
		self = this;

		this.shelf = $('ul.books');

		for(i=0; i<this.shelf.length; i++){
			var books = $(this.shelf[i]).find('> li');
			//$(this.shelf[i]).parent().css('z-index', this.shelf.length - i);

			for(j=0; j<books.length; j++) {
				// add z-index for last half to keep perspective
				if(j > (books.length/2) - 1) {
					$(books[j]).css('z-index', books.length - j);
				}

				// bind click for each book
				$(books[j]).find('.spine').bind('click', function(e) {
					e.preventDefault();
					var target = $(e.currentTarget).parent();
					self.grabBook(target);
				});

				// bind click for each page
				this.bindPageClicks(books[j]);

			}
		}
		
	},

	grabBook: function(target) {
		var self = this,
			closeBtn = $(target).find('.return-btn'),
			pages = $(target).find('.default-pages ol'),
			targetLeft = $(target).find('.book-cover'),
			targetRight = $(target).find('.book-back');

		$(target).addClass('active grab');


		for(i=pages.length; i>0; i--) {
			$(pages[i]).insertBefore(pages[0]);
		}

		setTimeout(function() {
			$(target).addClass('open');

			$(closeBtn).bind('click', function(e) {
				e.preventDefault();
				closeButton = $(this);
				self.returnBook(target, closeButton);
			});

		}, 1600);
		
	},

	bindPageClicks: function(parent){
		var self = this;

		$(parent).find('.default-pages ol').bind('click', function(e) {
			e.preventDefault();
			self.turnPage(parent, e.currentTarget);
		});
	},

	turnPage: function(target, page) {
		var self = this,
			flippedPages = $(target).find('.flipped-pages'),
			defaultPages = $(target).find('.default-pages');

		if( $(page).hasClass('last') ){
			

		} else if( $(page).hasClass('flip-left') ){
			$(page).addClass('flip-right').removeClass('flip-left');

			$(defaultPages).append(page);
			setTimeout(function() {
				$(page).removeClass('flip-right');
				$(page).find('li:first-child').css('z-index', 1);
				$(page).find('li:last-child').css('z-index', 0);
			}, 450);

		}  else {
			$(page).addClass('flip-left');
			
			setTimeout(function() {
				$(flippedPages).append(page);
				$(page).find('li:first-child').css('z-index', 0);
				$(page).find('li:last-child').css('z-index', 1);
			}, 400);
		}
	},

	returnBook: function(target, closeButton){

		$(closeButton).unbind('click');

		$(target).addClass('return close').removeClass('grab open');

		
		setTimeout(function() {
			var pages = $(target).find('.default-pages ol');
			for(i=pages.length; i>0; i--) {
				$(pages[i]).insertBefore(pages[0]);
			}
		}, 400);

		this.removeClasses(target);
			
	},

	removeClasses: function(book){
		setTimeout(function() {
			$(book).removeClass('active return close');
		}, 900);
	},
	addClasses: function(book){
		setTimeout(function() {
			$(book).addClass('open');
		}, 1600);
	}
}

$(document).ready(function() {
	Books.init();

});