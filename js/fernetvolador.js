
var konamiFernetJS = (function($){
	var running = false,
		timerMove,
		timerCapa,
		bottleWrap,
		bottle,
		legend,
		vel = 10,
		cls = 0,
		$window = $(window),
		keys = [],
		key = {
			up: 38,
			down: 40,
			left: 37,
			right: 39
		};
	
	var moveBottle = function(){
		var top = bottleWrap.position().top,
			left = bottleWrap.position().left,
			half = $window.height()/2,
			hScroll = $window.scrollTop() + $window.height()/2;
		
		if(keys.has(key.up)){
			cls = 0;
			if(top > 0) top-=vel; 
		}
		if(keys.has(key.right)){
			cls = 90;
			if((left + bottleWrap.width()) < $window.width()) left+=vel;
		}
		if(keys.has(key.down)){
			cls = 180;
			if((top + bottleWrap.height() * 2) < $window.height() + $window.scrollTop()) top+=vel;
		}
		if(keys.has(key.left)){
			cls = 270;
			if(left > 0) left-=vel;
		}

		if(keys.length > 1){
			cls = 45;
			
			if (keys.has(key.up, key.right)) cls *= 1;
			else if (keys.has(key.right, key.down)) cls *= 3;
			else if (keys.has(key.down, key.left)) cls *= 5;
			else if (keys.has(key.left, key.up)) cls *= 7;
		}

		var style = "transform:rotate([d]deg);"
								+ "-ms-transform:rotate([d]deg);"
								+ "-moz-transform:rotate([d]deg);"
								+ "-webkit-transform:rotate([d]deg);"
								+ "-o-transform:rotate([d]deg);";
								
		style = style.replace(/\[d\]/g, cls);
		
		if(top > hScroll || top < hScroll){
			$window.scrollTop(top - half);
		}

		bottleWrap.css('top', top + 'px').css('left', left + 'px');
		bottle.attr('style', style);
	};
	
	var konamiKeyDown = function(e){
		if (keys.indexOf(e.which) === -1) {
			if (keys.length > 1) keys.shift();	
			keys.push(e.which);
		}
			
		if (legend){
			legend.animate({opacity: 0}, 1000, function(){
				legend.remove();
				legend = null;
			});
		}
	};
	
	var konamiKeyUp = function(e){
		var idx = keys.indexOf(e.which);
		if (idx !== -1)
			keys.splice(idx, 1);
	};
	
	var runKonami = function(){
		bottle = $("<div>").addClass('fernet-capita');
		legend = $("<div>").addClass('legend').text("<- Fernet volador");
		
		bottleWrap = $("<div>").addClass("bottle-wrap")
			.append(bottle)
			.append(legend)
			.css('left', ($window.width()/3) + 'px')
			.css('top', (($window.height()/2) + $window.scrollTop()) + 'px')
			.appendTo('body');
		
		$('body, html').css('overflow', 'hidden');

		keys.has = function(){
			for(var i=0;i<arguments.length;i++){
				if(keys.indexOf(arguments[i]) === -1) return false;
			}
			return true;
		};
	
		$(document).bind('keydown', konamiKeyDown);
		$(document).bind('keyup', konamiKeyUp);
		
		clearInterval(timerMove);
		clearInterval(timerCapa);
		
		timerMove = setInterval(moveBottle, 50);
		
		var toggle = false;
		timerCapa = setInterval(function(){
			toggle = !toggle;
			if (toggle) bottle.addClass('x');
			else bottle.removeClass('x');
		}, 200);
		
	};
	
	var reset = function(){
		$(document).unbind('keydown', konamiKeyDown);
		$(document).unbind('keyup', konamiKeyUp);
		$('body, html').css('overflow', 'auto');
		
		clearInterval(timerMove);
		clearInterval(timerCapa);
		bottleWrap.empty().remove();
		keys = [];
		running = false;
	};
	
	return {
		run: function(){
			if (!running){
				running = true;
				runKonami();
			}
		},
		stop: reset
	};
	
})(jQuery);





