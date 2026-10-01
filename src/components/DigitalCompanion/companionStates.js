/**
 * Digital Companion - State Machine Definitions
 * 
 * Required Expression States:
 * - idle: Calm, gentle swimming, periodic blinks
 * - curious: Head tilted, eyes widened, inquisitive look
 * - happy: Crescent eyes (^ ^), joyful tail flutter, slight upward hop
 * - surprised: Wide dilated eyes (O O), backward recoil, flared fins
 * - thinking: Squinted analytical eyes, slow float, looking up-left
 * - excited: Fast energetic tail swish, eye glint, brisk fin beats
 * - sleepy: Droopy half-closed eyelids, slow drifting float
 * - nervous: Small pupils, rapid trembling fin flutter
 * - greeting: Cheerful welcoming loop-the-loop, friendly glance
 */

export const COMPANION_STATES = {
  IDLE: 'idle',
  CURIOUS: 'curious',
  HAPPY: 'happy',
  SURPRISED: 'surprised',
  THINKING: 'thinking',
  EXCITED: 'excited',
  SLEEPY: 'sleepy',
  NERVOUS: 'nervous',
  GREETING: 'greeting'
};

export const STATE_CONFIGS = {
  [COMPANION_STATES.IDLE]: {
    name: 'idle',
    tailSpeed: 2.8,
    tailAmplitude: 0.32,
    finSpeed: 3.5,
    floatSpeed: 1.8,
    floatHeight: 0.08,
    eyeShape: 'normal', // 'normal' | 'happy' | 'surprised' | 'thinking' | 'sleepy' | 'nervous'
    eyeScaleX: 1.0,
    eyeScaleY: 1.0,
    pupilScale: 1.0,
    headTilt: 0,
    duration: null // Stays indefinitely until state transition
  },
  [COMPANION_STATES.CURIOUS]: {
    name: 'curious',
    tailSpeed: 3.8,
    tailAmplitude: 0.36,
    finSpeed: 4.8,
    floatSpeed: 2.2,
    floatHeight: 0.12,
    eyeShape: 'thinking',
    eyeScaleX: 1.15,
    eyeScaleY: 1.25,
    pupilScale: 1.2,
    headTilt: 0.22,
    duration: 2600
  },
  [COMPANION_STATES.HAPPY]: {
    name: 'happy',
    tailSpeed: 6.2,
    tailAmplitude: 0.55,
    finSpeed: 7.0,
    floatSpeed: 3.5,
    floatHeight: 0.16,
    eyeShape: 'happy', // Crescent smile arcs
    eyeScaleX: 1.2,
    eyeScaleY: 0.6,
    pupilScale: 1.1,
    headTilt: -0.1,
    duration: 2400
  },
  [COMPANION_STATES.SURPRISED]: {
    name: 'surprised',
    tailSpeed: 7.5,
    tailAmplitude: 0.65,
    finSpeed: 8.5,
    floatSpeed: 4.0,
    floatHeight: 0.2,
    eyeShape: 'surprised', // Big wide circles
    eyeScaleX: 1.45,
    eyeScaleY: 1.45,
    pupilScale: 1.5,
    headTilt: -0.18,
    duration: 2200
  },
  [COMPANION_STATES.THINKING]: {
    name: 'thinking',
    tailSpeed: 2.2,
    tailAmplitude: 0.22,
    finSpeed: 2.6,
    floatSpeed: 1.4,
    floatHeight: 0.06,
    eyeShape: 'thinking',
    eyeScaleX: 1.05,
    eyeScaleY: 0.75,
    pupilScale: 0.85,
    headTilt: 0.15,
    duration: 2800
  },
  [COMPANION_STATES.EXCITED]: {
    name: 'excited',
    tailSpeed: 8.0,
    tailAmplitude: 0.6,
    finSpeed: 9.0,
    floatSpeed: 4.5,
    floatHeight: 0.18,
    eyeShape: 'happy',
    eyeScaleX: 1.3,
    eyeScaleY: 1.1,
    pupilScale: 1.3,
    headTilt: 0.12,
    duration: 2400
  },
  [COMPANION_STATES.SLEEPY]: {
    name: 'sleepy',
    tailSpeed: 1.4,
    tailAmplitude: 0.16,
    finSpeed: 1.6,
    floatSpeed: 1.0,
    floatHeight: 0.04,
    eyeShape: 'sleepy', // Droopy half lids
    eyeScaleX: 1.0,
    eyeScaleY: 0.35,
    pupilScale: 0.7,
    headTilt: 0.05,
    duration: 3200
  },
  [COMPANION_STATES.NERVOUS]: {
    name: 'nervous',
    tailSpeed: 8.5,
    tailAmplitude: 0.25,
    finSpeed: 10.0,
    floatSpeed: 3.0,
    floatHeight: 0.05,
    eyeShape: 'nervous', // Small vibrating pupils
    eyeScaleX: 0.85,
    eyeScaleY: 0.85,
    pupilScale: 0.6,
    headTilt: -0.15,
    duration: 2000
  },
  [COMPANION_STATES.GREETING]: {
    name: 'greeting',
    tailSpeed: 5.5,
    tailAmplitude: 0.45,
    finSpeed: 6.0,
    floatSpeed: 2.8,
    floatHeight: 0.14,
    eyeShape: 'happy',
    eyeScaleX: 1.25,
    eyeScaleY: 0.8,
    pupilScale: 1.15,
    headTilt: -0.12,
    duration: 2600
  }
};
