/* General */
// Listen for the play/pause button click
document
  .getElementById("play-pause-button")
  .addEventListener("click", onPlayPauseButtonClick);

// Listen for the volume slider
document
  .getElementById("volume-slider")
  .addEventListener("input", onVolumeSliderChange);

onload = function () {
  // Set the volume to 0 to have the nice fade in effect
  var audio = document.getElementById("audio");
  audio.volume = 0;

  // Create the HTML elements
  createDroplets();
  createClouds();

  // Play thunder sounds
  playThunderSounds();

  // Play the bell sound every hour
  playBellSoundEveryHour(true);
};

/* Audio */
function onVolumeSliderChange() {
  var audio = document.getElementById("audio");
  audio.volume = this.value / 100;
}

function onPlayPauseButtonClick() {
  var audio = document.getElementById("audio");
  if (audio.paused) {
    startRainSound();

    // Remove class play and add class pause
    this.classList.remove("play");
    this.classList.add("pause");

    // Start the droplets
    startDroplets();
  } else {
    stopRainSound();

    // Remove class pause and add class play
    this.classList.remove("pause");
    this.classList.add("play");

    // Stop the droplets
    stopDroplets();
  }
}

function stopRainSound(duration = 1000) {
  var audio = document.getElementById("audio");
  let interval = 50;
  let currentVolume = audio.volume;
  let decrement = currentVolume / (duration / interval);

  let fadeAudioInterval = setInterval(() => {
    currentVolume -= decrement;
    if (currentVolume > 0) {
      audio.volume = currentVolume;
    } else {
      audio.pause();
      audio.currentTime = 0;
      clearInterval(fadeAudioInterval);
    }
  }, interval);
}

function startRainSound(duration = 1000) {
  var audio = document.getElementById("audio");
  var volumeSlider = document.getElementById("volume-slider");
  let interval = 50;
  let currentVolume = audio.volume;
  let desiredVolume = volumeSlider.value / 100;
  let increment = desiredVolume / (duration / interval);

  audio.play();

  let fadeAudioInterval = setInterval(() => {
    currentVolume += increment;
    if (currentVolume < desiredVolume) {
      audio.volume = currentVolume;
    } else {
      clearInterval(fadeAudioInterval);
    }
  }, interval);
}

/* Rain */
function stopDroplets() {
  let droplets = document.querySelectorAll(".droplet");

  droplets.forEach(function (droplet) {
    // Define the event listener function
    const onIteration = function () {
      droplet.style.animation = "none";

      // Remove the event listener using the same function reference
      droplet.removeEventListener("animationiteration", onIteration);
    };

    // Listen for the end of the iteration
    droplet.addEventListener("animationiteration", onIteration);
  });
}

function startDroplets() {
  let droplets = document.querySelectorAll(".droplet");
  const originalAnimation = "dropletAnimation 0.8s linear infinite";

  droplets.forEach(function (droplet) {
    // Reapply the original animation
    droplet.style.animation = originalAnimation;

    // Reset the animation delay and duration
    droplet.style.animationDelay = Math.random() * 5 + "s";
    droplet.style.animationDuration = 0.4 + Math.random() * 0.3 + "s";
  });
}

function createDroplets() {
  let droplet;
  let counter = 100;
  // Create a document fragment
  let fragment = document.createDocumentFragment();

  // Get the rain-container
  let rainContainer = document.getElementById("rain-container");

  // Create counter divs inside rain-container with class droplet
  for (let i = 0; i < counter; i++) {
    droplet = document.createElement("div");
    droplet.classList.add("droplet");

    // Modify the left position randomly
    droplet.style.left = Math.random() * 110 + "%";

    // Append the droplet to the rain-container
    fragment.appendChild(droplet);
  }

  // Append the fragment to the rain-container
  rainContainer.appendChild(fragment);
}

/* Clouds */
function createClouds() {
  let cloud;
  let counter = 5;

  // Create a document fragment
  let fragment = document.createDocumentFragment();

  // Get the cloud-container
  let cloudContainer = document.getElementById("cloud-container");
  for (let i = 0; i < counter; i++) {
    cloud = document.createElement("div");
    cloud.classList.add("cloud");

    // Modify the left position randomly
    cloud.style.left = -80 + Math.random() * 150 + "%";

    // Adjust the animation delay and duration randomly
    cloud.style.animationDelay = Math.random() * 5 + "s";

    // Append the cloud to the cloud-container
    fragment.appendChild(cloud);
  }

  // Append the fragment to the cloud-container
  cloudContainer.appendChild(fragment);
}

/* Lighting */
function flashLighting(duration = 0.1, iterations = 5) {
  let lightingSky = document.getElementById("lighting-sky");

  // Set the full animation shorthand property
  lightingSky.style.animation = `lightingAnimation ${duration}s linear ${iterations}`;

  // Reset the animation at the end
  setTimeout(() => {
    lightingSky.style.animation = "none";
  }, duration * iterations * 1000); // Convert seconds to milliseconds
}

// Create a dictionary with the thunder sounds
let thunderSounds = {
  0: { file: "/media/sounds/thunder0.ogg", lighthings: 3, duration: 0.1 },
  1: { file: "/media/sounds/thunder1.ogg", lighthings: 1, duration: 0.2 },
  2: { file: "/media/sounds/thunder2.ogg", lighthings: 2, duration: 0.2 },
  3: { file: "/media/sounds/thunder3.ogg", lighthings: 2, duration: 0.1 },
  4: { file: "/media/sounds/thunder4.ogg", lighthings: 2, duration: 0.1 },
  5: { file: "/media/sounds/thunder5.ogg", lighthings: 1, duration: 0.3 },
  6: { file: "/media/sounds/thunder6.ogg", lighthings: 1, duration: 0.3 },
  7: { file: "/media/sounds/thunder7.ogg", lighthings: 4, duration: 0.1 },
  8: { file: "/media/sounds/thunder8.ogg", lighthings: 2, duration: 0.2 },
  9: { file: "/media/sounds/thunder9.ogg", lighthings: 2, duration: 0.2 },
  10: { file: "/media/sounds/thunder10.ogg", lighthings: 1, duration: 0.1 },
};

function playThunderSound(volume = 1) {
  // Get a random number between 0 and 10
  let randomNumber = Math.floor(Math.random() * 11);

  // Get the thunder sound from the dictionary
  let thunderSound = thunderSounds[randomNumber];

  // Play the sound
  let audio = new Audio(thunderSound.file);
  audio.volume = volume;
  audio.play();

  // Flash the lighting
  flashLighting(thunderSound.duration, thunderSound.lighthings);
}

// Function that plays thunder sounds until the rain stops
function playThunderSounds() {
  // Get the audio element
  let audio = document.getElementById("audio");

  // Play a thunder sound if the audio is playing
  if (!audio.paused) {
    playThunderSound(audio.volume);
  }

  // Play the next thunder sound after a random delay
  let minDelay = 60 * 1000;
  let maxDelay = 180 * 1000;
  let delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

  console.log("Next thunder sound in " + delay / 1000 + " seconds");
  setTimeout(playThunderSounds, delay);
}

/* Church */
// Play the bell sound n times
function playBellSound(iterations = 1) {
  // Get the audio element
  let audio = document.getElementById("audio");

  if (audio.paused) {
    return;
  }

  // Play the sound
  let church_audio = new Audio("/media/sounds/church_bell.mp3");
  church_audio.volume = audio.volume;
  church_audio.play();

  let bellDelay = 3000;

  // Play the sound again after a delay
  setTimeout(() => {
    if (iterations > 1) {
      playBellSound(iterations - 1);
    }
  }, bellDelay);
}

// A function that plays the bell sound every hour o'clock
function playBellSoundEveryHour(isFirstCall = false) {
  let date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();

  // If this is the first call, we need to use the next hour
  // if not when loading the webpage at 15:30, there would be 3 bells
  if (isFirstCall) {
    hours++;
  }

  hours = hours % 12 ? hours % 12 : 12;

  // Calculate the delay until the next hour
  // Note: There is an extra 5 seconds delay, this is to make sure that the
  // next call to this method is past the next hour so that hours are correct
  let delay = (60 - minutes) * 60 * 1000 + (60 - seconds) * 1000 + 5 * 1000;

  // Play the bell sound after the delay
  console.log(
    "Next bell sound in " +
      delay / 60000 +
      " minutes, " +
      hours +
      " bells will sound"
  );
  setTimeout(() => {
    playBellSound(hours);

    // Play the bell sound every hour
    playBellSoundEveryHour();
  }, delay);
}
