$(function () {
	$('#top-nav a').on('click',function(evt) {
		evt.preventDefault();
		var target = this.hash;
		$('html, body').animate({
			'scrollTop': $(target).offset().top
		}, 1000, 'swing', function() {
			window.location.hash = target;
		});
	});

	$(document).on('scroll', function() {
		var currPos = $(this).scrollTop();
		
		$('.section').each( function(index) {
			var start_pos = $(this).offset().top - 10;
			var end_pos = $(this).height() + start_pos;
			if (currPos < 50 || currPos >= start_pos && currPos < end_pos) {
				$('#top-nav a').eq(index).addClass('active').
				parent().siblings().children('a').removeClass('active');
				return false;
			}
		});
		
		currPos += 50;
		var navBar = $("top-nav");
		var navBarHeight = navBar.outerHeight()+10;
		var anchors = navBar.find("a");
		var navItems = anchors.map(function() {
			var anchor = $(this).attr("href");
			if (item.length) { return item; }
		});
		if ($(this).scrollTop() > navBarHeight) {
			$("#top-nav").stop().animate({}, 600);
		}
		
		if (currPos > 200) {
			$("#top-nav").addClass("dark-bg");
		} else {
			$("#top-nav").removeClass("dark-bg");
		}
		
		
	});
	
	// Highlight anchor when scrolling over section
	$(window).scroll(function() {
		var curr_pos = $(this).scrollTop();
		$('.section').each( function(index) {
			var start_pos = $(this).offset().top - 30;
			var end_pos = $(this).height() + start_pos;
			if (curr_pos >= start_pos && curr_pos < end_pos) {
				$('#nav-bar a').eq(index).addClass('active').
				parent().siblings().children('a').removeClass('active');
			}
		});
	});
});