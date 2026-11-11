// Procedural Web Audio API sound engine for cozy MMORPG tavern & campfire

let audioCtx: AudioContext | null = null;
let campfireGain: GainNode | null = null;
let isCampfirePlaying = false;
let crackleTimer: number | null = null;

function ensureAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Crisp pleasant forged coin / parchment turn
export const playTavernClick = () => {
  try {
    const ctx = ensureAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(360, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch {
    // ignore
  }
};

// Golden magical rune chime
export const playRuneChime = () => {
  try {
    const ctx = ensureAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.2); // G5

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  } catch {
    // ignore
  }
};

// Procedural single wood crackle pop
function playSingleCrackle(ctx: AudioContext, dest: AudioNode) {
  try {
    const bufferSize = Math.floor(ctx.sampleRate * 0.03); // 30ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1800 + Math.random() * 2400;
    filter.Q.value = 3;

    const popGain = ctx.createGain();
    const vol = 0.08 + Math.random() * 0.14;
    popGain.gain.setValueAtTime(vol, ctx.currentTime);
    popGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

    noise.connect(filter);
    filter.connect(popGain);
    popGain.connect(dest);

    noise.start();
  } catch {
    // ignore
  }
}

// Authentic procedural campfire roar + random crackling embers (original soft version)
export const toggleCozyFire = (enable: boolean): boolean => {
  const ctx = ensureAudioContext();
  if (!ctx) return false;

  if (!enable) {
    if (campfireGain) {
      campfireGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      setTimeout(() => {
        campfireGain?.disconnect();
        campfireGain = null;
        if (crackleTimer) {
          clearInterval(crackleTimer);
          crackleTimer = null;
        }
        isCampfirePlaying = false;
      }, 500);
    }
    return false;
  }

  try {
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Master campfire gain node
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.01, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.8);
    masterGain.connect(ctx.destination);
    campfireGain = masterGain;

    // 1. Warm low rumble/roar of the fire flame (brown/pink filtered noise)
    const bufferSize = ctx.sampleRate * 3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + 0.04 * white) / 1.04;
      data[i] = lastOut * 3.5;
    }

    const rumbleSource = ctx.createBufferSource();
    rumbleSource.buffer = buffer;
    rumbleSource.loop = true;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 380;

    const rumbleGain = ctx.createGain();
    rumbleGain.gain.value = 0.35;

    rumbleSource.connect(lowpass);
    lowpass.connect(rumbleGain);
    rumbleGain.connect(masterGain);

    rumbleSource.start();

    // 2. High frequency hissing air / gentle draft
    const hissBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const hissData = hissBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      hissData[i] = (Math.random() * 2 - 1) * 0.08;
    }
    const hissSource = ctx.createBufferSource();
    hissSource.buffer = hissBuffer;
    hissSource.loop = true;

    const hissFilter = ctx.createBiquadFilter();
    hissFilter.type = 'bandpass';
    hissFilter.frequency.value = 950;
    hissFilter.Q.value = 1.2;

    const hissGain = ctx.createGain();
    hissGain.gain.value = 0.12;

    hissSource.connect(hissFilter);
    hissFilter.connect(hissGain);
    hissGain.connect(masterGain);

    hissSource.start();

    // 3. Periodic natural snapping and popping of wood embers
    const scheduleCrackles = () => {
      if (!campfireGain) return;
      playSingleCrackle(ctx, masterGain);

      const nextDelay = 140 + Math.random() * 450;
      crackleTimer = window.setTimeout(scheduleCrackles, nextDelay);
    };

    scheduleCrackles();
    isCampfirePlaying = true;
    return true;
  } catch (err) {
    console.error('Audio start error:', err);
    return false;
  }
};
