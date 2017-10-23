import jquery from './vendor/jquery-3.2.1.min.js';
window.$ = window.jQuery = jquery;
import './vendor/popper.js';
import Typed from './vendor/typed.js';
import './modules';

// Strings which we'll need for selecting elements and stuff
let categories = [
  'features',
  'useCases',
  'audiences',
  'devices',
  'needs'
];


// All interactivity and click events
$(document).ready(function() {

  localStorage.setItem('paused', false);

  $('.screen__scene-change').click( function() {
    $('.screen__scene').each( function() {
      $(this).css('display','none');
    });

    let id = $(this).attr('id'); //#how-to-play-button
    $('[data-scene-trigger="'+id+'"]').show();
  });


  // Ignore default behavior for all href="#" links
  $('a[href="#"]').click(function(e) {
    e.preventDefault();
  });


  // Toggle the right difficulty selector on page load from local storage;
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
  $('#start-button').click(function() {
    $($(this)[0])
      .attr("disable", true)
      .addClass('button--disabled');

    initCountDown(() => {
      $('.challenge-countdown').hide();
      $('.challenge-running').show();
      startChallengeTimer();
    });
  });

  $('#how-to-play-button').click( function() {
    if($(this).hasClass('selected')) {
      console.log('selected');
    }
  });

  $('#pause-button').click(function() {

    // if( localStorage.getItem('paused') != true ) {
    //   localStorage.setItem('paused', true );
    //   console.log('yay')
    // } else {
    //   localStorage.setItem('paused', false );
    // }
    // console.log(localStorage.getItem('paused'))
  });




  // When the reload button is clicked, load a new prompt
  $('#reload-button').click(function() {
    // Which difficulty level is selected?
    let difficulty = localStorage.getItem('difficulty');

    // START THE THING!
    rollNewPrompt(difficulty);
  });

  // Hide inputs when hide is checked
  $('[data-hide-output]').click( function() {
    let target = $('#' + $(this).data('hide-output'));
    let parent = target.closest('.row');

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
  let prompt = prompts()[category][!difficulty ? "easy" : difficulty];
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
}

// Roll a new prompt
function rollNewPrompt(difficulty) {
  // Iterate through the category string array
  for( let i = 0; i < categories.length; i++ ) {
    injectPrompt(i, categories[i], getRandomPromptByDifficulty(categories[i], difficulty));
  }
}

function initCountDown(callback) {
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

// Start the challenge timer
function startChallengeTimer() {
  // Set the global 'challengeRunning' variable state to on
  localStorage.setItem('challengeRunning', true);

  // Get the selected time, turn it into a date object
  let challengeLengthMinutes = $('#timer .minutes').text();
  let challengeLengthSeconds = $('#timer .seconds').text();

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
    // TODO: This is janky, but effectively clears all intervals running when the clock is started
    for (let i = 1; i < 99999; i++) {
      window.clearInterval(i);
    }

    $('.illo--animated').show();
    $('.illo--still').hide();

    let clock = document.getElementById(id);
    let minutesEl = clock.querySelector('.minutes');
    let secondsEl = clock.querySelector('.seconds');

    function updateClock() {
      if( localStorage.getItem('paused') != true ) {
        let t = getTimeRemaining(endtime);
        minutesEl.innerHTML = ('0' + t.minutes).slice(-2);
        secondsEl.innerHTML = ('0' + t.seconds).slice(-2);

        if (t.total <= 0) {
          clearInterval(timeInterval);
          localStorage.setItem('challengeRunning', false);
          $('.timesup').removeClass('hide');
          $('.illo--animated').hide();
          $('.illo--still').show();
        }
      }
    }

    updateClock();
    let timeInterval = setInterval(updateClock, 1000);
  }
}

function prompts() {
  return {
    "features": {
      "easy": [
        "a user profile view",
        "a modal confirmation dialog",
        "a login and create account view",
        "settings page"
      ],
      "medium": [
        "a dashboard",
        "a discovery feed",
        "a full login process"
      ],
      "hard": [
        "a multi-user dashboard",
        "a scheduling feature",
        "an onboarding process",
        "the homepage of a marketing site",
        "interactive map with geofencing capabilities"
      ]
    },
    "useCases": {
      "easy": [
        "a todo app",
        "a professional networking site",
        "a book discovery app",
        "a live show recommendations app",
        "a dating app",
        "a price comparison site",
      	"a habit-tracking app",
      	"a mindfulness app",
      	"a ticket purchasing site",
      	"an insult-generator",
      	"a calendar app"
      ],
      "medium": [
        "a smart home watering system",
        "a wine tracking app",
        "a pet care app",
        "a caltrain dating app",
        "a novel weather app",
      	"a geocaching app",
      	"a news aggregating site",
      	"an outfit-assessment app"
      ],
      "hard": [
        "a flight management app",
        "a small business management platform",
        "a learning management system",
        "a content management system",
        "a dating app that matches based on compatible allergies",
        "a recipe app that bases options off of what you ate that day",
      	"a blood sugar management app",
      	"a ride-sharing app for 2-seater bicycles",
      	"an app that likes your friends’ social media posts for you",
      	"a music platform that generates new singles by splicing together top 40 hits"
      ]
    },
    "audiences": {
      "easy": [
        "kids",
        "families",
        "early adopters",
        "college students",
        "moms",
        "homeowners",
        "teachers",
        "athletes"
      ],
      "medium": [
        "working professionals",
        "professional bloggers",
        "landscape architects",
        "professional clowns",
        "concert goers",
        "social media managers",
        "entrepreneurs",
      	"plumbers",
      	"small business owners",
      	"musicophiles",
      	"film snobs",
      	"designers",
      	"dog walkers",
      	"baristas",
      	"janitors",
      	"chefs",
      	"restaurant patrons",
      	"swimmers",
      	"foodies"
      ],
      "hard": [
        "astronauts on the ISS",
        "accountants during tax season",
        "political campaign managers",
        "geologists in the field",
        "families on vacation",
        "fortune 100 CEOs",
        "sports enthusiasts after 6 drinks",
      	"families of ICU patients",
      	"war reporters",
      	"disaster relief coordinators",
      	"teachers in inner-city schools",
      	"Zac & Jake",
      	"the supreme court",
      	"famous 1980s rock bands",
      	"podcast creators",
      	"concrete driveway specialists"
      ]
    },
    "devices": {
      "easy": [
        "desktops",
        "tablets",
        "mobile phones"
      ],
      "medium": [
        "the latest iPhones",
        "the latest Android phones",
        "mobile, tablet, and desktop"
      ],
      "hard": [
        "smart watches",
        "smart TVs",
        "virtual reality headsets",
        "augmented reality glasses",
        "autonomous car dashboard interfaces",
        "iPhone-integrated haptic feedback vests",
      	"smart kitchen appliances",
      	"touch-screen yard tools",
      	"interactive touch-screen security doors"
      ]
    },
    "needs": {
      "easy": [
        "to save time",
        "to save money",
        "to be efficient",
        "to be less stressed",
      	"to connect with people",
      	"to experience new things",
      	"to be healthier"
      ],
      "medium": [
        "to be more green",
        "to get promoted",
        "to impress their friends",
        "to increase IQ",
      	"to get in shape",
      	"to be famous",
      	"to travel more",
      	"to reduce time spent on devices",
      	"to increase productivity"
      ],
      "hard": [
        "to appear busy at work while actually checking facebook",
        "to go on a vacation",
        "to find inner peace",
        "to make amends for past wrongdoings",
      	"to find themselves",
      	"to generate fake news without violating the law",
      	"to win a nobel prize",
      	"to smash the patriarchy ",
      	"to close the wage gap",
      	"to overcome a fear of touchscreen devices",
      	"to commit crimes without being caught"
      ]
    }
  };

}
