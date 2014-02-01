$(function() {
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	$("#canvas").attr("width", 400);
	$("#canvas").attr("height", 400);
	var width = 400;
	var height = 400;
	var draw_interval = 200;
	var interval;
	var food_amount = 2;

	var factor = 15;
	var cw = width/factor; // cell width
	var dir = "right"; // direction
	var snake_array = [];
	var food = [];
	var init_length;
	var word_score = 0;
	var end_of_game;
	var curr_word = "";
	var game_start = true;
	var user_input = "";
	var user_input_array; // Character array of user input

	function create_snake(length) {
		var init_word = "";
		for (var i = length - 1; i >= 0; i--) {
			var random = randomLetter();
			snake_array.push({x:i, y:0, letter: random})
			init_word += random;
		}
		init_length = length;
		curr_word = init_word;
	}

	function init() {
	    ctx.fillStyle = "white";
		ctx.fillRect(0, 0, width, height);
		for (var i = 0; i < food.length; i++) {
			paint_cell(food[i]);
		}
		for (var i = 0; i < snake_array.length; i++) {
			var cell = snake_array[i];
			paint_cell(cell);
		}
	}

	function paint_cell(cell) {
		var x = cell.x;
		var y = cell.y;
		var letter = cell.letter;
		ctx.fillStyle="green";
		ctx.fillRect(cw*x, cw*y, cw, cw);
		ctx.font = "bold 14px Helvetica";
		ctx.fillStyle="black";
		ctx.fillText(letter, cw*x+8, cw*y+18);
		ctx.strokeStyle="white";
		ctx.strokeRect(cw*x, cw*y, cw, cw);
	}

	function randomLetter() {
		if (user_input_array.length) {
			return user_input_array.shift();
		} else {
			var alphabet = [' ', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', ' ', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
				'P', ' ', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', ' ', 'X', 'Y', 'Z'];
			return alphabet[Math.floor(Math.random()*30)];
		}
	}


	$("body").keydown(function (evt) {
		switch (evt.keyCode) {
			case 37: 
				if (!end_of_game && no_collisions("x",-1)) {
					if (dir == "left") {
						move("x", -1);
					}
					dir = "left";
				}
				break;
			case 38:
			    if (!end_of_game && no_collisions("y", -1)) {
					if (dir == "up") {
						move("y", -1);
					}
					dir = "up";
				}
				break;
			case 39:
			    if (!end_of_game && no_collisions("x", 1)) {
					if (dir == "right") {
						move("x", 1);
					}
					dir = "right";
				}
				break;
			case 40:
			    if (!end_of_game && no_collisions("y", 1)) {
					if (dir == "down") {
						move("y", 1);
					}
					dir = "down";
				}
				break;
			case 27:   // Esc key
				clearInterval(interval);
				end_of_game = true;
				game_start = true;
				$("#current-word").text("");
				start();
				break;
			case 13:  // Enter key
				if (game_start) {
					end_of_game = false;
					start_init();
					update_word();
					interval = setInterval(repaint, 200);
					game_start = false;
				}
				break;
		}
	});

	function start_init() {
		user_input = $("#word-input").val().toUpperCase();
		user_input_array = user_input.split("");

		snake_array = [];
		dir = "right";
		create_snake(1);
		init_food(food_amount, -1);

		init();
	}

	function no_collisions(axis, increment) {
		var other_axis = (axis == "x" ? "y" : "x");
		var head_axis_pos = parseInt(snake_array[0][axis]) + increment;
		var head_other_axis_pos = parseInt(snake_array[0][other_axis]);
		

		for (var i = 1; i < snake_array.length; i++) {
			if (head_axis_pos == snake_array[i][axis] && head_other_axis_pos == snake_array[i][other_axis]) {
				// Enforces that the snake cannot make a 180 degree turn
				if (i==1) {
					move(axis, increment*-1);
				} else {
				// Otherwise, head has collided with some part of the body. End game.
					gameOver();
				}
				return false;
			}
		}
		
	    // Check for wall collision
		if ((head_axis_pos*cw >= (width)) || (head_axis_pos*cw < 0) || (head_other_axis_pos*cw >= (height)) 
			|| (head_other_axis_pos*cw < 0)) {
			gameOver();
			return false;
		}
	
		return true;
	}


	function move(axis, increment) {
		var curr = null;
		var prev = {x: snake_array[0].x, y: snake_array[0].y};
		snake_array[0][axis] += increment;
		for (var i = 0; i < food.length; i++) {
			if (snake_array[0].x == food[i].x && snake_array[0].y == food[i].y) {
				snake_array.push({x: null, y: null, letter: food[i].letter});
				update_word();
				init_food(food_amount, i);
			}
		}

		for (var i = 1; i < snake_array.length; i++) {
			var cell = snake_array[i];
			curr = {x: cell.x, y: cell.y};
			cell.x = prev.x;
			cell.y = prev.y;
			prev = {x: curr.x, y: curr.y};
		}
		init();

	}

	function gameOver() {
		end_of_game = true;
		clearInterval(interval);
		ctx.fillStyle = "white";
		ctx.fillRect(0,0,width,height);
		ctx.font = "bold 30px Helvetica";
		ctx.fillStyle="purple";
		ctx.fillText("Game Over", 120, 200);

		var snake_text = "";
		for (var i = 0; i < snake_array.length; i++) {
			snake_text += snake_array[i].letter;
		}
		if (user_input !== "") {
			if (snake_text.toUpperCase().indexOf(user_input.toUpperCase()) < 0) {
				ctx.font = "15px Helvetica";
				ctx.fillText("You didn't add your input letters", 105, 100);
				ctx.fillText("in order. Try again :)", 142, 120);
			} else {
				var extra_score = user_input.length;
				ctx.font = "15px Helvetica";
				ctx.fillText("+" + extra_score + " points for adding your input", 105, 90);
				ctx.fillText("letters in order!", 152, 110);
				word_score += extra_score;
			}
		}
		ctx.font = "20px Helvetica";
		ctx.fillText("Score: " + (snake_array.length-init_length+word_score), 160, 225);
	}

	function init_food(num, to_change) {
		food.length = num;
		for (var count = 0; count < num; count++) {
			if ((to_change > -1 && to_change == count) || (to_change == -1)) {
				var random_coord_1 = Math.floor(Math.random()*factor);
				var random_coord_2 = Math.floor(Math.random()*factor);
				for (var i = 1; i < snake_array.length; i++) {
					if (snake_array[i].x == random_coord_1 && snake_array[i].y == random_coord_2) {
						init_food(num, to_change);
						return;
					}
				}
				food[count] = {x: random_coord_1, y:random_coord_2, letter: randomLetter()};
			}
		}
	}

	function update_word() {
		var word = "";
		for (var i = 0; i < snake_array.length; i++) {
			word += snake_array[i].letter;
		}
		$("#current-word").text(word);
	}

	function repaint() {
	    ctx.fillStyle = "white";
		ctx.fillRect(0, 0, width, height);

		switch (dir) {
			case "left":
				if (no_collisions("x", -1)) {
					move("x", -1);
				} 
				break;
			case "up":
				if (no_collisions("y", -1)) {
					move("y", -1);
				} 
				break;
			case "right":
				if (no_collisions("x", 1)) {
					move("x", 1);
				} 
				break;
			case "down":
				if (no_collisions("y", 1)) {
					move("y", 1);						
				} 
				break;
		}

	}

	function start_screen() {
	    end_of_game = true;
	    ctx.fillStyle = "white";
		ctx.fillRect(0, 0, width, height);
		ctx.font = "bold 40px Helvetica";
		ctx.fillStyle="green";
		ctx.fillText("Welcome.", 105, 140);
		ctx.font = "25px Helvetica";
		ctx.fillText("Press-s-s-s 'Enter'", 95, 250);
		ctx.font = "20px Helvetica";
		ctx.fillText("to s-s-s-start.", 137, 270);
	}

	function start() {
		// user_input = $("#word-input").val().toUpperCase();
		// user_input_array = user_input.split("");
		end_of_game = false;
		if (game_start) {
			start_screen();
		} else {
			init();
			interval = setInterval(repaint, 200);
		}
	}
	start();
});