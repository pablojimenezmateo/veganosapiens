document
  .getElementById("play-pause-button")
  .addEventListener("click", function () {
    var audio = document.getElementById("audio");
    var rain = document.getElementById("rain");
    if (audio.paused) {
      audio.play();

      // Remove class play and add class pause
      this.classList.remove("play");
      this.classList.add("pause");

      // Add class rain-container to rain
      rain.classList.add("rain-container");
    } else {
      audio.pause();

      // Remove class pause and add class play
      this.classList.remove("pause");
      this.classList.add("play");

      // Remove class rain-container from rain
      rain.classList.remove("rain-container");
    }
  });
