export const playSound = (sound, muted) => {
  const soundTrack = document.getElementById(sound);
  soundTrack.currentTime=0; // reset the audio
  if (muted) {
    soundTrack.volume=0;
  } else {
    soundTrack.volume=1;
  }
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
