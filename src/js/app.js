(function($) {
	$(document).ready(function() {

		const MemoryGame = function() {
			const startNewGameBtn = document.querySelector('.main-start-btn');
			const testBtn = document.querySelector('.main-sekunda-btn');
			let timerSpot = document.querySelector('.main-moments');
			let lastTime = document.querySelector('#last-game');
			let startTimestamp = null;
			let currentGuess = null; //onclick var for grabbing data attr
			let cards = []; // holds the array of 0-32;  SAVE
			let guesses = []; // all guesses (data attr)
			let matchCheck = []; // check only for 0 / 1 match
			let currentCardElement = null; // variable for testing if clicking on same element twice
			let bestTimes = []; // array for times
			let matchTracker = 0; // counter for amount of matches
			let startSI = null; // setInterval

			class CreateSingleGame {
				constructor(indexNumber) {
					this.id = indexNumber;
					this.build();
				}
				////////////////////////////////////////////
				// BUILD :: GENERATE TEMPLATE
				build() {
					// grab a string of html
					const source = $('#cards-template').html();
					//turns that string into a handlebars function
					const template = Handlebars.compile(source);
					const context = {
						id: this.id
					};
					const html = template(context);
					$('.cards-container').prepend(html);

				} // end build func
			} // end of CLASS
			//////////// FUNCTION: RANDOM ARRAY ///////////
			function randomArray() {
				cards = [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
				cards.sort(function(a, b) {
					console.log(cards);
					return 0.5 - Math.random();
				});
			}

			//////////// FUNCTION: CLEAR CARDS ///////////
			function clearCards() {
				$('.cards-container').html('');
			}
			//////////// FUNCTION: CHECK WIN ///////////
			function checkForWin() {
				console.log('match class length');
				console.log($('.match').length);
				if ($('.match').length === 32) {
					alert('WIN');
				}
			}
			//////////// FUNCTION: HEALTH TRACKER ///////////
			function healthyTrackMeter() {
				if (matchTracker < 6) {
					$('.main-health').css({
						'height': '100%',
						'backgroundColor': 'red'
					});
				}
				if (matchTracker >= 6) {
					$('.main-health').css({
						'height': '70%',
						'backgroundColor': 'orange'
					});
				}
				if (matchTracker > 9) {
					$('.main-health').css({
						'height': '50%',
						'backgroundColor': 'yellow'
					});
				}
				if (matchTracker > 12) {
					$('.main-health').css({
						'height': '30%',
						'backgroundColor': 'green'
					});
				}
				if (matchTracker > 15) {
					$('.main-health').css({
						'height': '0',
						'backgroundColor': 'green'
					});
				}
			}


			//////////// FUNCTION: CHECK MATCH ///////////
			function checkForMatch() {
				console.log('matchCheck in checkForMatch func ', matchCheck);
				if (matchCheck[0] === matchCheck[1]) {
					let thisDataAttr = matchCheck[0];
					console.log('thisDataAttr ', thisDataAttr);
					$(`.card-singles[data-tracker=${thisDataAttr}]`).addClass('match');
					checkForWin();
					matchCheck = [];
					matchTracker++;
					healthyTrackMeter();
				} else {
					matchCheck = [];
				}
			}

			//////////// FUNCTION: BIND EVENTS ///////////
			function bindEvents() {
				// ON CLICK : START GAME  ///////////////////////
				startNewGameBtn.addEventListener('click', () => {
					event.preventDefault();
					if (bestTimes.pop() !== undefined) {
						const convert = hhmmss(bestTimes.pop());
						$('#last-game').html(`${convert}`);
						bestTimes = [];
					}
					clearInterval(startSI); // clear the setInterval / otherwise it speeds up every new game...
					startTimer(0); // set setInterval timer to 0
					clearCards(); // remove old cards on new game
					// create a new class // api call will go here
					randomArray(); // randomize the cards
					for (let i = 0; i < cards.length; i++) {
						new CreateSingleGame(cards[i]);
					}
				}); // end startNewGameBtn

				///////////// ON CLICK : Check guess /////////////
				$('.cards-container').on('click', '.card-singles', function() {
					if (this === currentCardElement) { //check on double clicks
						alert('You clicked same card twice');
						matchCheck = [];
						return false; // exit out on double clicks
					}
					currentCardElement = this; // reset
					currentGuess = $(this).data("tracker"); // set var to data attr
					// console.log('current ', currentGuess);
					guesses.push(currentGuess);
					// console.log('guesses length ', guesses.length);
					// attempt at allowing only 2 guesses to be visible
					if (guesses.length < 3) {
						$(this).addClass('show-number');
					}
					if (guesses.length === 2) {
						setTimeout(function() { // remove cards visibility after half sec
							$('.card-singles').removeClass('show-number');
							guesses = [];
						}, 500);
					}
					if (guesses.length > 2) { // stop user from viewing 2+ cards
						alert('Slow Down!');
					}

					matchCheck.push(currentGuess); // array only for match checking
					// console.log('guesses ', guesses);
					// console.log('matchCheck in click ', matchCheck);
					if (matchCheck.length === 2) {
						checkForMatch();
					} //else {
					//	console.log('no on matchCheck if');
					//}
				});
			} // END BIND EVENTS


			//////////// FUNCTION: MOMENT TIMER ///////////
			// time is set to 0
			function startTimer(myStartTimestamp) {
				startTimestamp = parseInt(myStartTimestamp);

				startSI = setInterval(function() {
					startTimestamp++;
					bestTimes.push(startTimestamp); // push
					// console.log(bestTimes);
					// console.log(startTimestamp);
					document.getElementById('timer').innerHTML =
						moment.unix(startTimestamp).format('mm:ss');
				}, 1000);
			}
			// for timer
			function pad(num) {
				return ("0" + num).slice(-2);
			}
			// for timer
			function hhmmss(secs) {
				let minutes = Math.floor(secs / 60);
				secs = secs % 60;
				let hours = Math.floor(minutes / 60);
				minutes = minutes % 60;
				// console.log('min conv ', pad(minutes));
				return pad(minutes) + ":" + pad(secs);
			}

			//////////// FUNCTION: INIT ///////////
			function init() {
				bindEvents();
			}

			return {
				init: init
			}; //return
		}; //construct

		const memoryGameApp = MemoryGame();
		memoryGameApp.init();
	});
})(jQuery);
