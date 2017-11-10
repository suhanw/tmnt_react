export const playSound = (sound) => {
  const soundtrack = document.getElementById(sound);
  soundtrack.currentTime=0; // reset the audio
  soundtrack.play();
};

export const toggleMute = (sound) => {
  const soundtrack = document.getElementById(sound);
  if (soundtrack.paused) {
    soundtrack.play();
    return false;
  } else {
    soundtrack.pause();
    return true;
  }
};
