export const playSound = (sound) => {
  const soundtrack = document.getElementById(sound);
  soundtrack.currentTime=0; // reset the audio
  soundtrack.play();
};
