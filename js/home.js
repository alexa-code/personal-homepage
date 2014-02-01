$(function () {
	$('a').on('click',function(evt) {
		evt.preventDefault();
		var target = this.hash;
		$('body').animate({
			'scrollTop': $(target).offset().top
		}, 1000, 'swing', function() {
			window.location.hash = target;
		});
	});

	// $(document).on('scroll', function() {
	// 	if ($(this).scrollTop() > 80) {
	// 		$("#top-nav").stop().animate({
	// 			margin-top:50px;
	// 		}, 600);
	// 	}
	// });
});