$(document).ready(function(){
	
	$('li').each(function(index){$(this).append("item " + index);});

	var scrollbar = $('#scrollbar');
	
	var itemNum = $('ul#stage li').length;
	//var itemWidth = $('ul#stage li').outerWidth(true);
	var itemWidth = '120';
	
	
	var timeline = $('div.timeline');
	var featItem = $('div.timeline li').position('0','50%');
	$(featItem).addClass('active');
	console.log(featItem);
	
	$('ul#stage').css('width', (itemWidth * itemNum));
	
	scrollbar.attr('max',(itemNum - 1));
	
	scrollbar.change(function(){
		scrollbar = $(this).val();
		$('ul#stage')
			.css({
				marginLeft: "-" + (scrollbar * itemWidth) + "px"
			});
		$(featItem).css('background','red');		
	});
	
	
	
});	