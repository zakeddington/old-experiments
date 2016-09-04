$(document).ready(function(){
	
	var bodyWidth = $('body').width();	
	console.log(bodyWidth);
	
	$('div#drag-zippo').draggable({
		drag : function (event, ui) {
			var zippoPos = $(this).position();
			$('div#zippo-shadow').css('left', zippoPos.left);
			$('ul.instructions li').addClass('hide');
			
			
			if (zippoPos.left < (bodyWidth / 1.8) ) {
				$(this).addClass('flip');
			}
			else {
				$(this).removeClass('flip');
			}
		}
	});
	
	/*var zippoPos = $('div#drag-zippo').position();
	$('div#zippo-shadow').css('left', zippoPos.left);*/
	
	$('div.spark-center').droppable({
		tolerance: "touch",
	    over : function (event, ui) {
	        var $target = $('div#bomb');		
			$target.addClass('ignite');
			$('ol#timer').addClass('start');
			$('div#drag-zippo').addClass('hide');
			$('div#zippo-shadow').addClass('hide');
			setTimeout(function() {
				$target.addClass('explode');
				$('div#bomb-shadow').addClass('hide');
				$('a#party').addClass('show');
			}, 4800);
	    },
	    drop : function (event, ui) {
		
	    }
	});
		
	$('a#zippo').click(function() {
		$(this).addClass('open');
		$('ul.instructions li:nth-child(1)').addClass('hide');
		$('ul.instructions li:nth-child(2)').addClass('show');
		return false
	});
	


	$('a#party').click(function() {
		$('div#bomb').hide();
		var bombs = [];
		
		for (i = 0; i < 40; i++) {
		    bombs.push('<div class="bomb-small"><div class="shake"><div class="cap"></div><div class="bomb-glow"></div><div class="shard one"></div><div class="shard two"></div><div class="shard three"></div><div class="shard four"></div><div class="wick"><div class="wick-cover"></div><div class="wick-color"></div></div><div class="spark"><div class="spark-colors">.</div><div class="spark-center"></div></div><div class="fire"></div></div></div>');
		}

		$('body').append( bombs.join('') );
		$('div.bomb-small').addClass('ignite');
		setTimeout(function() {
			$('div.bomb-small').addClass('explode');
			setTimeout(function() {
				$('div.bomb-small').remove();
			}, 1000);	
		}, 4800);
		
		return false
	});
});	