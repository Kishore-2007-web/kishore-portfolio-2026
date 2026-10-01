import { COMPANION_STATES } from './companionStates';

/**
 * Project Reaction Map
 * 
 * Maps portfolio projects to companion emotional expressions and short micro-dialogues
 */
export const PROJECT_REACTIONS = {
  // USBShield
  'usbshield': {
    state: COMPANION_STATES.CURIOUS,
    message: 'Scanning USB hardware...'
  },
  'USBShield': {
    state: COMPANION_STATES.CURIOUS,
    message: 'Scanning USB hardware...'
  },

  // RepoShield AI
  'reposhield-ai': {
    state: COMPANION_STATES.THINKING,
    message: 'Analyzing code security...'
  },
  'RepoShield AI': {
    state: COMPANION_STATES.THINKING,
    message: 'Analyzing code security...'
  },

  // Rise of Aran
  'rise-of-aran': {
    state: COMPANION_STATES.EXCITED,
    message: 'Epic mythological quest!'
  },
  'Rise of Aran': {
    state: COMPANION_STATES.EXCITED,
    message: 'Epic mythological quest!'
  },

  // The Room
  'the-room': {
    state: COMPANION_STATES.NERVOUS,
    message: 'It gets creepy in there...'
  },
  'The Room': {
    state: COMPANION_STATES.NERVOUS,
    message: 'It gets creepy in there...'
  },

  // Kisa AI
  'kisa-ai': {
    state: COMPANION_STATES.HAPPY,
    message: "That's my sister intelligence!"
  },
  'Kisa AI': {
    state: COMPANION_STATES.HAPPY,
    message: "That's my sister intelligence!"
  },

  // CalculatorHub
  'calculatorhub': {
    state: COMPANION_STATES.CURIOUS,
    message: '300+ math engines inside.'
  },
  'CalculatorHub': {
    state: COMPANION_STATES.CURIOUS,
    message: '300+ math engines inside.'
  },

  // My Pocket Tracker
  'my-pocket-tracker': {
    state: COMPANION_STATES.THINKING,
    message: 'Balancing the numbers...'
  },
  'My Pocket Tracker': {
    state: COMPANION_STATES.THINKING,
    message: 'Balancing the numbers...'
  },

  // CrimeNET AI
  'crimenet-ai': {
    state: COMPANION_STATES.CURIOUS,
    message: 'Predictive neural pattern.'
  },
  'CrimeNET AI': {
    state: COMPANION_STATES.CURIOUS,
    message: 'Predictive neural pattern.'
  },

  // Auto Git Pusher
  'auto-git-pusher': {
    state: COMPANION_STATES.EXCITED,
    message: 'Continuous sync engine!'
  },
  'Auto Git Pusher': {
    state: COMPANION_STATES.EXCITED,
    message: 'Continuous sync engine!'
  },

  // THACHAN
  'thachan': {
    state: COMPANION_STATES.HAPPY,
    message: 'Master craftsman network.'
  },
  'THACHAN': {
    state: COMPANION_STATES.HAPPY,
    message: 'Master craftsman network.'
  }
};

/**
 * Section Reaction Map
 */
export const SECTION_REACTIONS = {
  hero: {
    state: COMPANION_STATES.IDLE,
    message: 'Welcome.'
  },
  about: {
    state: COMPANION_STATES.CURIOUS,
    message: 'Exploring Kishore’s story.'
  },
  capabilities: {
    state: COMPANION_STATES.THINKING,
    message: 'Software · 3D · AI.'
  },
  skills: {
    state: COMPANION_STATES.CURIOUS,
    message: 'That’s quite a stack!'
  },
  work: {
    state: COMPANION_STATES.EXCITED,
    message: 'One of my favorites.'
  },
  'more-builds': {
    state: COMPANION_STATES.HAPPY,
    message: 'More builds to inspect.'
  },
  lab: {
    state: COMPANION_STATES.EXCITED,
    message: 'Experimental zone!'
  },
  github: {
    state: COMPANION_STATES.THINKING,
    message: 'Live open source.'
  },
  contact: {
    state: COMPANION_STATES.GREETING,
    message: 'Say hello to Kishore!'
  }
};

/**
 * Click reaction pool - touched like a digital pet
 */
export const CLICK_REACTIONS = [
  { state: COMPANION_STATES.HAPPY, message: '^ _ ^' },
  { state: COMPANION_STATES.CURIOUS, message: 'Need something?' },
  { state: COMPANION_STATES.SURPRISED, message: 'O.O!' },
  { state: COMPANION_STATES.EXCITED, message: 'Swimming by!' },
  { state: COMPANION_STATES.THINKING, message: 'Interesting...' }
];

/**
 * Ambient idle thoughts
 */
export const IDLE_THOUGHTS = [
  'Hey.',
  'You’re exploring.',
  'Interesting...',
  'Welcome.',
  'Found something?',
  'Need help?',
  'Good choice.'
];
