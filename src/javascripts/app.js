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

let difficulty = 'easy';

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

// Set timer to default
function resetTimer() {
  $('#timer .minutes').text('15');
  $('#timer .seconds').text('00')
}


// All interactivity and click events
$(document).ready(function() {

  rollNewPrompt(difficulty);
  $('#easy').addClass('selected');
  /**
   * Events
   */

  // Ignore default behavior for all href="#" links
  $('a[href="#"]').click(function(e) {
    e.preventDefault();
  });

  // Change the selected state of the difficulty buttons
  $('.js-difficulty').click(function() {
    $('.js-difficulty').removeClass('selected');
    $(this).addClass('selected');
    difficulty = $(this).data('difficulty');
    rollNewPrompt(difficulty);
  });


  // Listen for pause timer event.timerState = TIMER_STATES.ACTIVE;
  $('.js-pause-button').click(() => {
    pauseTimer();
    if (timerState === TIMER_STATES.PAUSED) {
      startChallenge();
    } else {
      timerState = TIMER_STATES.PAUSED;
      pauseTimer();
    }
  });

  // Listen for stop timer event.
  $('.js-stop-button').click(() => {
    stopTimer();
    timerState = TIMER_STATES.STOPPED;
  });

  $('.js-info-button').click(() => {
    showInfo();
    if( $('.js-info-button').hasClass('selected') ) {
      showPrompt();
    }
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
    startChallenge();
  });


  // When the reload button is clicked, load a new prompt
  $('#reload-button').click(function() {
    // Which difficulty level is selected?
    let difficulty = localStorage.getItem('difficulty');

    // Give us a new prompt
    rollNewPrompt(difficulty);
  });

});

function startChallenge() {
  if (timerState === TIMER_STATES.PAUSED) {
    startChallengeTimer();
  } else {
    initCountDown(() => {
      startChallengeTimer();
    });
  }
  disableStartButton();
}

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
  playTypesfSound();
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
  let inspiration = prompts.inspiration;
  let randomNum = Math.floor( Math.random() * inspiration.length );
  let randomInspo = inspiration[randomNum];

  $('.quote-box').text(randomInspo);
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
        $('.challenge-countdown h1').text(3);
        callback();
      }
    }
  }, 1000);
}

function pauseTimer() {
  clearAllIntervals();
  enableStartButton();
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

function unSelectAllTimerButtons() {
  $('.timer-controls__panel .button')
    .removeClass('selected');
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

function showInfo() {
  hideAll();
  $('.challenge-info').show();
}

function hideAll() {
  $('.screen__scene').hide();
}



// Start the challenge timer
function startChallengeTimer() {
  // Set the global 'challengeRunning' variable state to on
  showPrompt();
  if (timerState === TIMER_STATES.PAUSED) {
    disableStartButton();
  }

  timerState = TIMER_STATES.ACTIVE;
  unSelectAllTimerButtons();

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
