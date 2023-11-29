// Listen for the play/pause button click
document
  .getElementById("play-pause-button")
  .addEventListener("click", onPlayPauseButtonClick);

// Listen for the volume slider
document
  .getElementById("volume-slider")
  .addEventListener("input", onVolumeSliderChange);

function onVolumeSliderChange() {
  var audio = document.getElementById("audio");
  audio.volume = this.value / 100;
}

function onPlayPauseButtonClick() {
  var audio = document.getElementById("audio");
  if (audio.paused) {
    startAudio();

    // Remove class play and add class pause
    this.classList.remove("play");
    this.classList.add("pause");

    // Start the droplets
    startDroplets();
  } else {
    stopAudio();

    // Remove class pause and add class play
    this.classList.remove("pause");
    this.classList.add("play");

    // Stop the droplets
    stopDroplets();
  }
}

function stopAudio(duration = 1000) {
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

function startAudio(duration = 1000) {
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

onload = function () {
  // Set the volume to 0 to have the nice fade in effect
  var audio = document.getElementById("audio");
  audio.volume = 0;

  // Create the HTML elements
  createDroplets();
  createClouds();
};
