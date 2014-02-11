$(function () {
	$('#top-nav a').on('click',function(evt) {
		evt.preventDefault();
		var target = this.hash;
		$('html').animate({
			'scrollTop': $(target).offset().top
		}, 1000, 'swing', function() {
			window.location.hash = target;
		});
	});

	$(document).on('scroll', function() {
		var currPos = $(this).scrollTop() + 50;
		var navBar = $("top-nav");
		var navBarHeight = navBar.outerHeight()+10;
		var anchors = navBar.find("a");
		var navItems = anchors.map(function() {
			var anchor = $(this).attr("href");
			if (item.length) { return item; }
		});
		if ($(this).scrollTop() > navBarHeight) {
			$("#top-nav").stop().animate({
				
			}, 600);
		}
		
		if (currPos > 200) {
			$("#top-nav").addClass("dark-bg");
		} else {
			$("#top-nav").removeClass("dark-bg");
		}
	});
});