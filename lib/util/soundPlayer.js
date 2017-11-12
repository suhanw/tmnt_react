export const playSound = (sound) => {
  const soundtrack = document.getElementById(sound);
  console.log(soundtrack);
  soundtrack.currentTime=0; // reset the audio
  soundtrack.play();
  return soundtrack;
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

export const stopAll = () => {
  const sounds = document.querySelectorAll('audio');
  sounds.forEach((sound)=>{
    sound.pause();
    sound.currentTime = 0;
  });
  return;
};
