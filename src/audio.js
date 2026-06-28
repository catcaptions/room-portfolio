import { Howl } from "howler";

const musicVolume = 0.7;
const pianoNoteVolume = 0.8;

function resumeAudio() {
  if (Howler.ctx && Howler.ctx.state === "suspended") {
    Howler.ctx.resume();
  }
}

const music = new Howl({
  src: ["/audio/music/cosmic_candy.ogg"],
  loop: true,
  volume: musicVolume,
  preload: true,
});

const click = new Howl({
  src: ["/audio/sfx/click/bubble.ogg"],
  volume: 0.5,
  preload: true,
});

// Load 24 piano sounds (lazy — avoid caching empty files on first load)
const pianoSounds = {};
function getPianoSound(num) {
  if (!pianoSounds[num]) {
    pianoSounds[num] = new Howl({
      src: [`/audio/sfx/piano/Key_${num}.ogg`],
      volume: pianoNoteVolume,
    });
  }
  return pianoSounds[num];
}

// Map PIANO KEY mesh names → sound file numbers
// User's piano keys: "C1_Key_Pointer_Raycaster_Third_Baked" etc.
// 3 octaves (C1-B3) but only 24 sounds — octave 3 reuses octave 2 sounds
const pianoKeyMap = {
  "C1_Key": "24", "Chash1_Key": "23", "D1_Key": "22", "Dhash1_Key": "21",
  "E1_Key": "20", "F1_Key": "19", "Fhash1_Key": "18", "G1_Key": "17",
  "Ghash1_Key": "16", "A1_Key": "15", "Ahash1_Key": "14", "B1_Key": "13",
  "C2_Key": "12", "Chash2_Key": "11", "D2_Key": "10", "Dhash2_Key": "9",
  "E2_Key": "8", "F2_Key": "7", "Fhash2_Key": "6", "G2_Key": "5",
  "Ghash2_Key": "4", "A2_Key": "3", "Ahash2_Key": "2", "B2_Key": "1",
  "C3_Key": "12", "Chash3_Key": "11", "D3_Key": "10", "Dhash3_Key": "9",
  "E3_Key": "8", "F3_Key": "7", "Fhash3_Key": "6", "G3_Key": "5",
  "Ghash3_Key": "4", "A3_Key": "3", "Ahash3_Key": "2", "B3_Key": "1",
};

let musicFadeTimeout = null;
let isMuted = false;

function fadeMusicOut(duration = 0.3) {
  if (!music.playing()) return;
  music.fade(music.volume(), 0, duration * 1000);
  clearTimeout(musicFadeTimeout);
}

function fadeMusicIn(duration = 0.5, targetVolume = musicVolume) {
  if (isMuted) return;
  music.fade(0, targetVolume, duration * 1000);
}

export function playPianoNote(meshName) {
  resumeAudio();
  if (isMuted) return;

  const key = Object.keys(pianoKeyMap).find(k => meshName.includes(k));
  if (!key) return;

  const num = pianoKeyMap[key];
  const sound = getPianoSound(num);

  fadeMusicOut();
  sound.play();

  clearTimeout(musicFadeTimeout);
  musicFadeTimeout = setTimeout(() => {
    fadeMusicIn();
  }, 1500);
}

export function playClick() {
  resumeAudio();
  if (!isMuted) click.play();
}

export function toggleMute() {
  resumeAudio();
  isMuted = !isMuted;
  if (isMuted) {
    music.fade(music.volume(), 0, 300);
    clearTimeout(musicFadeTimeout);
  } else {
    fadeMusicIn(0.3);
  }
  return isMuted;
}

export function startMusic() {
  resumeAudio();
  if (!music.playing()) music.play();
}
