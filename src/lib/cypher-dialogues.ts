// src/lib/aegis-dialogues.ts

interface PasswordAnalysis {
  password: string;
  strength: number;
  dictionaryWords: string[];
  feedback: string[];
  hasLowercase: boolean;
  hasUppercase: boolean;
  hasNumbers: boolean;
  hasSymbols: boolean;
  length: number;
}

export function getCypherDialogue(analysis: PasswordAnalysis) {
  const {
    password,
    strength,
    dictionaryWords,
    length
  } = analysis;

  // Empty password - initial guidance
  if (!password || length === 0) {
    return {
      text: "Initiating sequence. Enter the new administrative payload.",
      type: "info",
      audioFile: "/audio/pw_init.mp3"
    };
  }

  // Only numbers
  if (/^\d+$/.test(password)) {
    return {
      text: "You're only using numbers. This is just a PIN, not a secure payload.",
      type: "warning",
      audioFile: "/audio/pw_numbers.mp3"
    };
  }

  // Only letters
  if (/^[a-zA-Z]+$/.test(password)) {
    return {
      text: "Letters alone won't cut it. Add digits or symbols to expand the character pool.",
      type: "warning",
      audioFile: "/audio/pw_letters.mp3"
    };
  }

  // Repeats
  if (/(.)\1{2,}/.test(password)) {
    return {
      text: "Repeated characters detected. 'A A A' doesn't add real entropy.",
      type: "warning",
      audioFile: "/audio/pw_repeat.mp3"
    };
  }

  // Sequences
  if (/123|abc|qwerty/i.test(password)) {
    return {
      text: "A numerical sequence? Hackers test '1 2 3' before they even start their coffee.",
      type: "warning",
      audioFile: "/audio/pw_sequence.mp3"
    };
  }

  // Dictionary words detected (Priority Warning)
  if (dictionaryWords.length > 0) {
    return {
      text: "Dictionary word detected! Scripts use massive lists of common words. Mix it up.",
      type: "warning",
      audioFile: "/audio/pw_dict.mp3"
    };
  }

  // Too short
  if (length < 8) {
    return {
      text: "Too short. An automated script could brute-force this in milliseconds. Keep typing.",
      type: "warning",
      audioFile: "/audio/pw_short.mp3"
    };
  }

  // Moderate
  if (strength >= 20 && strength < 60) {
    return {
      text: "It's getting better, but a dedicated GPU rig could still crack it. Add more randomness.",
      type: "info",
      audioFile: "/audio/pw_moderate.mp3"
    };
  }

  // Strong
  if (strength >= 60 && strength < 80) {
    return {
      text: "Strong parameters detected. But as an Admin, we shouldn't settle for 'strong'. Push it further.",
      type: "success",
      audioFile: "/audio/pw_strong.mp3"
    };
  }

  // Perfect
  if (strength >= 80) {
    return {
      text: "Massive entropy achieved. A network of supercomputers would need centuries to crack this. The vault is secure.",
      type: "success",
      audioFile: "/audio/pw_unbreakable.mp3"
    };
  }

  // Default fallback
  return {
    text: "Analyzing payload... Keep adding complex characters and length to maximize security.",
    type: "info",
    audioFile: "/audio/pwd-default.mp3"
  };
}

export function getFirstTimeGuidance() {
  return {
    text: "Target reached. Enter the new administrative payload into the terminal to secure the vault.",
    type: "info",
    audioFile: "/audio/pw_init.mp3"
  };
}

export function getSuccessGuidance(xp: number, attempts: number) {
  return {
    text: "Massive entropy achieved. A network of supercomputers would need centuries to crack this. The vault is secure.",
    type: "success",
    audioFile: "/audio/pw_unbreakable.mp3"
  };
}
