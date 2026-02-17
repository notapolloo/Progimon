function playAudio() {
  //if the audio is already playing, mute it
  var audio = document.getElementById("myAudio");
  if (!audio.paused) {
    audio.pause();
    audio.currentTime = 0;
    return;
  } else audio.play();
}