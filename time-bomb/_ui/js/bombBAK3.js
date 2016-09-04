$(document).ready(function(){
	
	$('a#zippo').click(function() {
		
		$(this).addClass('open');
		$('div#zippo-shadow').addClass('hide');
		
		var $target = $("div#bomb");		
		setTimeout(function() {
			$target.addClass('ignite');
			$('ol#timer').addClass('start');	
			setTimeout(function() {
				$target.addClass('explode');
				$('div#bomb-shadow').addClass('hide');
			}, 4800);
		}, 4800);
		
		return false
	});
	
});	