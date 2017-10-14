import './modules'
import './data/prompts.js'

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

  // Toggle the right difficulty selector on page load
  var difficulty = localStorage.getItem('difficulty');
  if (difficulty) {
    $('.js-difficulty').not('#' + difficulty).removeClass('selected');
  }

  // Change the selected state of the difficulty buttons
  $('.js-difficulty').click(function() {
    $('.js-difficulty').removeClass('selected');
    $(this).addClass('selected');
    localStorage.setItem('difficulty', $(this).data('difficulty'));
  });

  // Start button is clicked. Do stuff to start the whole thing.
  $('#start-button').click(function() {
    // Which difficulty level is selected?
    var difficulty = localStorage.getItem('difficulty');

    // START THE THING!
    rollNewPrompt(difficulty);
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
  var container = $('#'+category);
  container.text( prompt );
}

// Roll a new prompt
function rollNewPrompt(difficulty) {
  // Set the global state to on
  localStorage.setItem('challengeRunning', true);

  // Iterate through the category string array
  for( var i = 0; i < categories.length; i++ ) {
    injectPrompt(i, categories[i], getRandomPromptByDifficulty(categories[i], difficulty));
  }

  // Get the selected time from the dropdown, turn it into a date object, start the clock
  var challengeLengthMinutes = $('#timer-selection').val();
  if (challengeLengthMinutes != "dev") {
    var countdown = new Date(Date.parse(new Date()) + 1 * 1 * challengeLengthMinutes * 60 * 1000)
  } else {
    var countdown = new Date(Date.parse(new Date()) + 1 * 1 * 1 * 3 * 1000) // 3 second timer for dev purposes
  }

  initializeClock('timer', countdown);

  function getTimeRemaining(endtime) {
    var t = Date.parse(endtime) - Date.parse(new Date());
    var seconds = Math.floor((t / 1000) % 60);
    var minutes = Math.floor((t / 1000 / 60) % 60);
    var hours = Math.floor((t / (1000 * 60 * 60)) % 24);

    return {'total': t, 'hours': hours, 'minutes': minutes, 'seconds': seconds};
  }

  function initializeClock(id, endtime) {
    // TODO: This is janky, but effectively clears all intervals running.
    for (var i = 1; i < 99999; i++) {
      window.clearInterval(i);
    }

    var clock = document.getElementById(id);
    var hoursSpan = clock.querySelector('.hours');
    var minutesSpan = clock.querySelector('.minutes');
    var secondsSpan = clock.querySelector('.seconds');

    function updateClock() {
      var t = getTimeRemaining(endtime);
      hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
      minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
      secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

      if (t.total <= 0) {
        clearInterval(timeInterval);
        $('.timesup').removeClass('hide');
      }
    }

    updateClock();
    var timeInterval = setInterval(updateClock, 1000);
  }
}
