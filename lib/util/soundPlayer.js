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
  const soundTrack = document.getElementById(sound);
  if (soundTrack.volume) {
    soundTrack.volume = 0;
    return true;
  } else {
    soundTrack.volume = 1;
    return false;
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
