import jquery from './vendor/jquery-3.2.1.min.js';
window.$ = window.jQuery = jquery;
import './vendor/popper.js';
require('./vendor/jquery.input-stepper.js');
import './modules';
import './data/prompts.js';

// Make prompts json accessible
// TODO: also have separate files for growth + sales prompts, and a ui selector
var prompts = window.prompts;

// Strings which we'll need for selecting elements and stuff
var categories = [
  'features',
  'useCases',
  'audiences',
  'devices',
  'needs'
];

// Ignore default behavior for all href="#" links
$('a[href="#"]').click(function(e) {
  e.preventDefault();
});

// All interactivity and click events
$(document).ready(function() {




  // initialize the jquery plugin input-stepper
	$('.input-stepper').inputStepper();




  // Toggle the right difficulty selector on page load from local storage
  var difficulty = localStorage.getItem('difficulty');
  if (difficulty) {
    $('.js-difficulty').not('#' + difficulty).removeClass('selected');
  } else {
    $('[data-difficulty="medium"], [data-difficulty="hard"]').removeClass('selected');
  }




  // Change the selected state of the difficulty buttons
  $('.js-difficulty').click(function() {
    $('.js-difficulty').removeClass('selected');
    $(this).addClass('selected');
    localStorage.setItem('difficulty', $(this).data('difficulty'));
  });




  // For any buttons that are toggleable
  $('.selectable').click( function() {
    $(this).toggleClass('selected');
  });




  // Increase / decrease the challenge length
  $('.timer__button').click( function() {
    var stepAmount = 5,
        minMinutes = 5,
        maxMinutes = 60,
        step;
    var direction = $(this).data('stepper-direction');

    if( direction == "decrease") {
      step = -stepAmount;
    } else {
      step = stepAmount;
    }

    // Get the minutes element in the timer markup
    var minutes = $('.timer .minutes');

    // Read the string from that element, and convert it to an int for mathing with.
    var currentMinutes = parseInt( minutes.text(), 10);

    // Do the mathing.
    var newMinutes = currentMinutes + step;

    if( newMinutes <= minMinutes || newMinutes >= maxMinutes ) {
      $(this).attr('disabled', true).addClass('button--disabled');
    } else {
      $('.timer__button').attr('disabled', false).removeClass('button--disabled');
    }

    // If the new number is between the min + max, put it in a variable
    var newMinutesText;
    if( newMinutes >= minMinutes && newMinutes <= maxMinutes ) {
      newMinutesText = newMinutes.toString();
    } else {
      newMinutesText = currentMinutes.toString();
    }

    // Fix, if minutes needs a leading zero, since an int drops leading 0s
    if( newMinutesText < 10 ) {
      newMinutesText = '0' + newMinutesText;
    }

    // Then stuff said variable back into the timer's minutes element
    minutes.text( newMinutesText );
  });




  // When the start button is clicked, start the timer
  $('#start-button').click(function() {
    startChallengeTimer();
    $('.timer__button').attr('disabled', true).addClass('button--disabled');
  });




  // When the reload button is clicked, load a new prompt
  $('#reload-button').click(function() {
    // Which difficulty level is selected?
    var difficulty = localStorage.getItem('difficulty');

    // START THE THING!
    rollNewPrompt(difficulty);
  });




  // Hide inputs when hide is checked
  $('[data-hide-output]').click( function() {
    var target = $('#' + $(this).data('hide-output'));
    var parent = target.closest('.row');

    parent.toggleClass('closed');
  });




  // Close the "Time's up!" overlay
  $('.timesup .close').click(function(e) {
    e.preventDefault();
    $('.timesup').addClass('hide');
  });

});




// A thing for selecting a random prompt from an array
function getRandomPromptByDifficulty(category, difficulty) {
  var prompt = prompts[category][difficulty];
  var randomPrompt = prompt[Math.floor(Math.random() * prompt.length)];
  return randomPrompt;
}




// Inject each prompt component into the DOM
function injectPrompt( index, category, prompt ) {
  var container = $('#'+category+' .output__text');
  container.text( prompt );
}




// Roll a new prompt
function rollNewPrompt(difficulty) {
  // Iterate through the category string array
  for( var i = 0; i < categories.length; i++ ) {
    injectPrompt(i, categories[i], getRandomPromptByDifficulty(categories[i], difficulty));
  }
}




// Start the challenge timer
function startChallengeTimer() {
  // Set the global state to on
  localStorage.setItem('challengeRunning', true);

  // Get the selected time, turn it into a date object
  var challengeLengthMinutes = $('#timer .minutes').text();
  var challengeLengthSeconds = $('#timer .seconds').text();

  // start the timer based on what's already on the clock
  var challengeLength = Date.parse( new Date() )+( 1 * 1 * challengeLengthMinutes * 60 * 1000 )+( 1 * 1 * challengeLengthSeconds * 1000 );
  var deadline = new Date( challengeLength );

  // If the challenge is 60m or greater, subtract a second so that the minutes doesn't show '00' in the first second
  if( challengeLengthMinutes >= 60 ) {
    deadline.setSeconds( deadline.getSeconds() - 1 );
  }

  // Call the start timer function
  initializeClock('timer', deadline);

  // Get the time remaining
  function getTimeRemaining(endtime) {
    var t = Date.parse(endtime) - Date.parse(new Date());
    var seconds = Math.floor((t / 1000) % 60);
    var minutes = Math.floor((t / 1000 / 60) % 60);

    return {'total': t, 'minutes': minutes, 'seconds': seconds};
  }

  // Function to start the timer
  function initializeClock(id, endtime) {
    // TODO: This is janky, but effectively clears all intervals running. Maybe come up with something better?
    for (var i = 1; i < 99999; i++) {
      window.clearInterval(i);
    }

    var clock = document.getElementById(id);
    var minutesSpan = clock.querySelector('.minutes');
    var secondsSpan = clock.querySelector('.seconds');

    function updateClock() {
      var t = getTimeRemaining(endtime);
      minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
      secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

      if (t.total <= 0) {
        clearInterval(timeInterval);
        localStorage.setItem('challengeRunning', false);
        $('.timesup').removeClass('hide');
      }
    }

    updateClock();
    var timeInterval = setInterval(updateClock, 1000);
  }
}
