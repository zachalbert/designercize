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

  // When the start button is clicked, start the timer
  $('#start-button').click(function() {
    startChallengeTimer();
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
  // Set the global 'challengeRunning' variable state to on
  localStorage.setItem('challengeRunning', true);

  // Get the selected time from the input
  var challengeLengthMinutes = $('#timer-selection--minutes').val();
  // Turn the time selected into a date object
  var countdown = new Date(Date.parse(new Date()) + 1 * 1 * challengeLengthMinutes * 60 * 1000)
  // Start the clock
  initializeClock('timer', countdown);

  // Function to get remaining time
  function getTimeRemaining(endtime) {
    var t = Date.parse(endtime) - Date.parse(new Date());
    var seconds = Math.floor((t / 1000) % 60);
    var minutes = Math.floor((t / 1000 / 60) % 60);
    var hours = Math.floor((t / (1000 * 60 * 60)) % 24);

    return {
      'total': t,
      'hours': hours,
      'minutes': minutes,
      'seconds': seconds
    };
  }

  // Function to start the clock
  function initializeClock(id, endtime) {
    // TODO: This is janky, but effectively clears all intervals running when the clock is started
    for (var i = 1; i < 99999; i++) {
      window.clearInterval(i);
    }

    var clock = document.getElementById(id);
    var hoursEl = clock.querySelector('.hours');
    var minutesEl = clock.querySelector('.minutes');
    var secondsEl = clock.querySelector('.seconds');

    function updateClock() {
      var t = getTimeRemaining(endtime);
      hoursEl.innerHTML = ('0' + t.hours).slice(-2);
      minutesEl.value = ('0' + t.minutes).slice(-2);
      secondsEl.innerHTML = ('0' + t.seconds).slice(-2);

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
