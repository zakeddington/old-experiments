$(document).ready(function(){
	
	/*
	$('a#match').click(function() {
		
		$('div#step1').addClass('ignite');
		
		$('div#step2').delay(4800).queue(function() {
			$(this).addClass('explode');
			$('div#bomb-shadow').addClass('hide');
		});
		return false
	});
	*/
	
	
	$('a#match').click(function() {
		
		$(this).addClass('strike');
		
		
		$('div#step1').delay(3000).queue(function() {
			$(this).addClass('ignite');
		});
		
		$('div#step2').delay(7800).queue(function() {
			$(this).addClass('explode');
			$('div#bomb-shadow').addClass('hide');
		});
		return false
	});
	
});	