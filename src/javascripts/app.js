import jquery from './vendor/jquery-3.2.1.min.js';
window.$ = window.jQuery = jquery;
import './vendor/popper.js';
import Typed from './vendor/typed.js';
import './modules';
import { prompts } from "./data/prompts";

/* TODO:
 - Need an easier way to deal with selecting / unselecting buttons. Make a function that just handles that based on TIMER_STATES
**/

// Strings which we'll need for selecting elements and stuff
let categories = [
  'features',
  'useCases',
  'audiences',
  'devices',
  'needs'
];

let activeIntervals = [];

const TIMER_STATES  = {
  "ACTIVE": "ACTIVE",
  "PAUSED": "PAUSED",
  "STOPPED": "STOPPED",
  "DEFAULT": "DEFAULT"
};

let timerState = TIMER_STATES.DEFAULT;

function clearAllIntervals() {
  activeIntervals.forEach((intervalId) => {
    window.clearInterval(intervalId);
  });
  activeIntervals = [];
}

function resetTimer() {
  // Get the original time that the start button started with

  // Change the clock to be that time
}


// All interactivity and click events
$(document).ready(function() {

  /**
   * Events
   */

  // Ignore default behavior for all href="#" links
  $('a[href="#"]').click(function(e) {
    e.preventDefault();
  });


  // Toggle the right difficulty selector on page load from local storage;
  // TODO: improve this
  let difficulty = localStorage.getItem('difficulty');
  if (difficulty === "null" || difficulty === "undefined") {
    difficulty = "easy";
  }

  if (difficulty) {
    $('.js-difficulty').not('#' + difficulty).removeClass('selected');
    rollNewPrompt(difficulty);
  } else {
    $('[data-difficulty="medium"], [data-difficulty="hard"]').removeClass('selected');
    rollNewPrompt('easy');
  }


  // Change the selected state of the difficulty buttons
  $('.js-difficulty').click(function() {
    $('.js-difficulty').removeClass('selected');
    $(this).addClass('selected');
    localStorage.setItem('difficulty', $(this).data('difficulty'));
  });


  $('.js-pause-button').click(() => {
    pauseTimer();
    if( timerState == TIMER_STATES.PAUSED ) {
      timerState = TIMER_STATES.ACTIVE;
    } else {
      timerState = TIMER_STATES.PAUSED;
    }
  });


  $('.js-stop-button').click(() => {
    stopTimer();
    timerState = TIMER_STATES.STOPPED;
  });

  // For any buttons that are toggleable
  $('.selectable').click( function() {
    $(this).toggleClass('selected');
  });


  // Increase / decrease the challenge length
  $('.timer__button').click( function() {
    let stepAmount = 5,
        minMinutes = 5,
        maxMinutes = 60,
        step;
    let direction = $(this).data('stepper-direction');

    if( direction == "decrease") {
      step = -stepAmount;
    } else {
      step = stepAmount;
    }

    // Get the minutes element in the timer markup
    const minutes = $('.timer .minutes');

    // Read the string from that element, and convert it to an int for mathing with.
    const currentMinutes = parseInt( minutes.text(), 10);

    // Do the mathing.
    let newMinutes = currentMinutes + step;

    if( newMinutes <= minMinutes || newMinutes >= maxMinutes ) {
      $(this).attr('disabled', true).addClass('button--disabled');
    } else {
      $('.timer__button').attr('disabled', false).removeClass('button--disabled');
    }

    // If the new number is between the min + max, put it in a variable
    let newMinutesText;
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
  $('.js-start-button').click(function() {
    if (timerState === TIMER_STATES.PAUSED) {
      startChallengeTimer();
    } else {
      initCountDown(() => {
        startChallengeTimer();
      });
    }
    disableStartButton();
  });


  // When the reload button is clicked, load a new prompt
  $('#reload-button').click(function() {
    // Which difficulty level is selected?
    let difficulty = localStorage.getItem('difficulty');

    // Give us a new prompt
    rollNewPrompt(difficulty);
  });

});


// A thing for selecting a random prompt from an array
function getRandomPromptByDifficulty(category, difficulty) {
  let prompt = prompts[category][!difficulty ? "easy" : difficulty];
  let randomPrompt = prompt[Math.floor(Math.random() * prompt.length)];
  return randomPrompt;
}


// Inject each prompt component into the DOM
function injectPrompt( index, category, prompt ) {
  let selector = '#'+category+'.output__text';
  let delay = 300 * index;

  // Clear it first
  $(selector).text('');

  let typed = new Typed(selector, {
    strings: [ prompt ],
    typeSpeed: 40,
    startDelay: delay,
    showCursor: false
  });


  /* TODO: Typing noise
   - This thing should play a noise for typeNoiseLimit x typeSpeed, but at fast
   - speeds, it queues the sounds rather than playing new ones on top of each
   - other. Commenting out for now.
  let typeNoise = new Audio('button-down.mp3');
  let typeNoiseLimit = 10;
  let typeSpeed = 200; // ms
  let typeCount = 0;
  function playTypeSound() {
    typeNoise.play();

    if( typeCount >= typeNoiseLimit ) {
      window.clearInterval(timeInterval);
    }
    typeCount++;
  }
  playTypeSound();
  let timeInterval = setInterval(playTypeSound, typeSpeed);
  **/
}

// Roll a new prompt
function rollNewPrompt(difficulty) {
  // Iterate through the category string array
  for( let i = 0; i < categories.length; i++ ) {
    injectPrompt(i, categories[i], getRandomPromptByDifficulty(categories[i], difficulty));
  }

  // Give us some inspiration
  for( let i = 0; i < prompts.inspiration.length; i++ ) {
    // Iterate through the quotes and give us a rando
  }
}

function initCountDown(callback) {
  showCountDown()
  let count = 2;
  const id = window.setInterval(() => {
    $('.challenge-countdown h1').text(count--);
    if (count === 0) {
      $('.challenge-countdown h1').text("fun!");
    }
    if (count === -1) {
      window.clearInterval(id);
      if (callback && typeof callback === 'function') {
        callback();
      }
    }
  }, 1000);
}

function pauseTimer() {
  clearAllIntervals();
  // enableStartButton();
}

function stopTimer() {
  clearAllIntervals();
  resetTimer();
  enableStartButton();
}

function disableStartButton() {
  $('.js-start-button')
      .attr("disable", true)
      .addClass('button--disabled');
}

function enableStartButton() {
  $('.js-start-button')
    .attr("disable", false)
    .removeClass('button--disabled');
}

function showCountDown() {
  hideAll();
  $('.challenge-countdown').show();

}

function showPrompt() {
  hideAll();
  $('.challenge-running').show();

}

function showOutOfTime() {
  hideAll();
  $('.challenge-out-of-time').show();

}

function hideAll() {
  $('.screen__scene').hide();
}



// Start the challenge timer
function startChallengeTimer() {
  // Set the global 'challengeRunning' variable state to on
  showPrompt();
  timerState = TIMER_STATES.ACTIVE;

  // Get the selected time, turn it into a date object
  let challengeLengthMinutes = $('#timer .minutes').text();
  let challengeLengthSeconds = $('#timer .seconds').text();

  // Fast timer for dev purposes
  // let challengeLengthMinutes = 0;
  // let challengeLengthSeconds = 3;

  // start the timer based on what's already on the clock
  let challengeLength = new Date( Date.parse( new Date() ) + ( 1 * 1 * challengeLengthMinutes * 60 * 1000 ) + ( 1 * 1 * challengeLengthSeconds * 1000 ) );

  // If the challenge is 60m or greater, subtract a second so that the minutes doesn't show '00' in the first second
  if( challengeLengthMinutes >= 60 ) {
    challengeLength.setSeconds( challengeLength.getSeconds() - 1 );
  }

  // Call the start timer function
  initializeClock('timer', challengeLength);

  // Get the time remaining
  function getTimeRemaining(endtime) {
    let total = Date.parse(endtime) - Date.parse(new Date());
    let seconds = Math.floor((total / 1000) % 60);
    let minutes = Math.floor((total / 1000 / 60) % 60);
    return {
      total,
      minutes,
      seconds
    };
  }

  // Function to start the clock
  function initializeClock(id, endtime) {
    clearAllIntervals();
    $('.illo--animated').show();
    $('.illo--still').hide();

    let clock = document.getElementById(id);
    let minutesEl = clock.querySelector('.minutes');
    let secondsEl = clock.querySelector('.seconds');

    function updateClock() {
      let t = getTimeRemaining(endtime);
      minutesEl.innerHTML = ('0' + t.minutes).slice(-2);
      secondsEl.innerHTML = ('0' + t.seconds).slice(-2);

      if (t.total <= 0) {
        window.clearInterval(timeInterval);
        // $('.timesup').removeClass('hide');
        // $('.illo--animated').hide();
        // $('.illo--still').show();
        showOutOfTime();
      }
    }
    updateClock();
    let timeInterval = setInterval(updateClock, 1000);
    activeIntervals.push(timeInterval)
  }
}
