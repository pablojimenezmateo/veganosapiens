/* General */
// Listen for the play/pause button click
document
  .getElementById("play-pause-button")
  .addEventListener("click", onPlayPauseButtonClick);

// Listen for the volume slider
document
  .getElementById("volume-slider")
  .addEventListener("input", onVolumeSliderChange);

let audioContext;
let rainSoundBuffer;
let rainSource;
let gainNode;
let thunderBuffers = {};
let bellBuffer;

onload = function () {
  audioContext = new (window.AudioContext || window.webkitAudioContext)({
    latencyHint: "playback",
  });
  gainNode = audioContext.createGain();
  gainNode.connect(audioContext.destination);

  // Set the initial volume to 0 for a fade-in effect
  gainNode.gain.value = 0;

  // Load audio files in memory
  loadAudioFile(
    "/media/sounds/calpo_rain.ogg",
    (buffer) => (rainSoundBuffer = buffer)
  );
  for (let i = 0; i <= 10; i++) {
    loadAudioFile(
      thunderSounds[i].file,
      (buffer) => (thunderBuffers[i] = buffer)
    );
  }
  loadAudioFile(
    "/media/sounds/church_bell.mp3",
    (buffer) => (bellBuffer = buffer)
  );

  // Create the HTML elements
  createDroplets();
  createClouds();

  // Play thunder sounds
  playThunderSounds();

  // Play the bell sound every hour
  playBellSoundEveryHour();
};

/* Audio */
function loadAudioFile(url, callback) {
  fetch(url)
    .then((response) => response.arrayBuffer())
    .then((data) => audioContext.decodeAudioData(data))
    .then((buffer) => callback(buffer))
    .catch((err) => console.error(err));
}

function onVolumeSliderChange(event) {
  const desiredVolume = document.getElementById("volume-slider").value / 100;
  gainNode.gain.setValueAtTime(desiredVolume, audioContext.currentTime);
}

function onPlayPauseButtonClick() {
  if (!rainSource || !rainSource.buffer) {
    startRainSound();
    this.classList.remove("play");
    this.classList.add("pause");
    startDroplets();
  } else {
    if (rainSource.playbackState === rainSource.PLAYING_STATE) {
      stopRainSound();
      this.classList.remove("pause");
      this.classList.add("play");
      stopDroplets();
    }
  }
}

function startRainSound() {
  rainSource = audioContext.createBufferSource();
  rainSource.buffer = rainSoundBuffer;
  rainSource.loop = true;
  rainSource.connect(gainNode);
  rainSource.start(0);

  fadeVolume(
    gainNode.gain,
    gainNode.gain.value,
    document.getElementById("volume-slider").value / 100,
    1000
  );
}

function stopRainSound() {
  fadeVolume(gainNode.gain, gainNode.gain.value, 0, 1000, () => {
    rainSource.stop();
    rainSource = null;
  });
}

function fadeVolume(gainNode, from, to, duration, callback) {
  let startTime = audioContext.currentTime;
  let endTime = startTime + duration / 1000;
  gainNode.setValueAtTime(from, startTime);
  gainNode.linearRampToValueAtTime(to, endTime);

  if (callback) {
    setTimeout(callback, duration);
  }
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
  let fragment = document.createDocumentFragment();
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

  rainContainer.appendChild(fragment);
}

/* Clouds */
function createClouds() {
  let cloud;
  let counter = 5;
  let fragment = document.createDocumentFragment();
  let cloudContainer = document.getElementById("cloud-container");

  for (let i = 0; i < counter; i++) {
    cloud = document.createElement("div");
    cloud.classList.add("cloud");

    // Modify the left position randomly
    cloud.style.left = -80 + Math.random() * 150 + "%";

    // Adjust the animation delay and duration randomly
    cloud.style.animationDelay = Math.random() * 5 + "s";
    fragment.appendChild(cloud);
  }

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

/* Thunder */
function playThunderSound() {
  let randomNumber = Math.floor(Math.random() * 11);
  let thunderSound = thunderSounds[randomNumber];
  let thunderBuffer = thunderBuffers[randomNumber];

  if (thunderBuffer) {
    // Play the thunder
    let thunderSource = audioContext.createBufferSource();
    thunderSource.buffer = thunderBuffer;
    thunderSource.connect(gainNode);
    thunderSource.start(0);
    flashLighting(thunderSound.duration, thunderSound.lighthings);
  }
}

function playThunderSounds() {
  if (rainSource && rainSource.playbackState === rainSource.PLAYING_STATE) {
    playThunderSound(gainNode.gain.value);
  }

  let minDelay = 60 * 1000;
  let maxDelay = 180 * 1000;
  let delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

  console.log("Next thunder sound in " + delay / 1000 + " seconds");
  setTimeout(playThunderSounds, delay);
}

/* Church */
// Play the bell sound iterations times
function playBellSound(iterations = 1) {
  if (!rainSource || rainSource.playbackState !== rainSource.PLAYING_STATE) {
    return;
  }

  if (bellBuffer) {
    let bellSource = audioContext.createBufferSource();
    bellSource.buffer = bellBuffer;
    bellSource.connect(gainNode);
    bellSource.start(0);
  }

  if (iterations > 1) {
    setTimeout(() => playBellSound(iterations - 1), 3000);
  }
}

// A function that checks every minute if it is time to play the bell sound
function playBellSoundEveryHour() {
  let date = new Date();
  let minutes = date.getMinutes();

  // Only play the bell sound if it is o'clock
  if (minutes === 0) {
    let hours = date.getHours();
    hours = hours % 12 ? hours % 12 : 12;
    playBellSound(hours);
  }

  // Check again in 1 minute
  setTimeout(playBellSoundEveryHour, 60 * 1000);
}

// Thunder sounds dictionary
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
