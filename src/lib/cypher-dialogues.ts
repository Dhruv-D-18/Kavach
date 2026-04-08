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
    hasLowercase,
    hasUppercase,
    hasNumbers,
    hasSymbols,
    length
  } = analysis;

  // Empty password - initial guidance
  if (!password || length === 0) {
    return {
      text: "Welcome to the Vault! I'm Cypher, your security guide. Let's create a strong password together. Start typing and I'll help you make it unbreakable!",
      type: "info",
      audioFile: "/audio/pw-empty.mp3"
    };
  }

  // Only numbers
  if (/^\d+$/.test(password)) {
    return {
      text: "You're only using numbers. This is just a PIN, not a secure payload. Add letters or symbols to expand the character pool.",
      type: "warning",
      audioFile: "/audio/pw-only-numbers.mp3"
    };
  }

  // Only letters
  if (/^[a-zA-Z]+$/.test(password)) {
    return {
      text: "Letters alone won't cut it. Add digits or symbols to expand the character pool and increase entropy.",
      type: "warning",
      audioFile: "/audio/pw-only-letters.mp3"
    };
  }

  // Repeats
  if (/(.)\1{2,}/.test(password)) {
    return {
      text: "Repeated characters detected. 'A A A' or '1 1 1' doesn't add real entropy. Use a more varied sequence.",
      type: "warning",
      audioFile: "/audio/pw-repeats.mp3"
    };
  }

  // Sequences
  if (/123|abc|qwerty/i.test(password)) {
    return {
      text: "A common sequence? Hackers test '1 2 3' or 'abc' before they even start their coffee. Be more original!",
      type: "warning",
      audioFile: "/audio/pw-sequence.mp3"
    };
  }

  // Dictionary words detected (Priority Warning)
  if (dictionaryWords.length > 0) {
    return {
      text: "I detected common dictionary words! Hackers use wordlists to guess these instantly. Mix in symbols or numbers.",
      type: "warning",
      audioFile: "/audio/pw-common-word.mp3"
    };
  }

  // Too short
  if (length < 8) {
    return {
      text: "Too short! An automated script could brute-force this in milliseconds. Aim for at least twelve characters.",
      type: "warning",
      audioFile: "/audio/pw-too-short.mp3"
    };
  }

  // Moderate
  if (strength >= 20 && strength < 60) {
    return {
      text: "It's getting better, but a dedicated GPU rig could still crack it. Add more randomness and length.",
      type: "info",
      audioFile: "/audio/pw-moderate.mp3"
    };
  }

  // Strong
  if (strength >= 60 && strength < 80) {
    return {
      text: "Strong parameters detected. But as an Admin, we shouldn't settle for 'strong'. Push it even further!",
      type: "success",
      audioFile: "/audio/pw-strong.mp3"
    };
  }

  // Perfect
  if (strength >= 80) {
    return {
      text: "Massive entropy achieved. A network of supercomputers would need centuries to crack this. The vault is secure!",
      type: "success",
      audioFile: "/audio/pw-unbreakable.mp3"
    };
  }

  // Default fallback
  return {
    text: "Keep experimenting! Try different combinations of characters to see how they affect your password's strength.",
    type: "info",
    audioFile: "/audio/pwd-default.mp3"
  };
}

export function getFirstTimeGuidance() {
  return {
    text: "Welcome to Crack the Vault! Your mission: learn how hackers break into systems by creating strong passwords. I'll guide you through every step. Start typing in the password field below!",
    type: "info",
    audioFile: "/audio/pwd-first-time.mp3"
  };
}

export function getSuccessGuidance(xp: number, attempts: number) {
  if (attempts === 1) {
    return {
      text: "Incredible! You cracked the vault on your first try! That's natural talent for cybersecurity. Ready for the next challenge?",
      type: "success",
      audioFile: "/audio/pwd-success-first.mp3"
    };
  }
  
  return {
    text: "Vault unlocked! Great persistence! You've mastered password security. Keep up the excellent work!",
    type: "success",
    audioFile: "/audio/pwd-success-multiple.mp3"
  };
}
