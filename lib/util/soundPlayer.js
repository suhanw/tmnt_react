export const playSound = (sound) => {
  const soundTrack = document.getElementById(sound);
  soundTrack.currentTime=0; // reset the audio
  soundTrack.play();
  return soundTrack;
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
