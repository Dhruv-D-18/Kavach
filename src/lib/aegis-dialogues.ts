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

export function getAegisDialogue(analysis: PasswordAnalysis) {
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
      text: "Welcome to the Vault! I'm Aegis, your security guide. Let's create a strong password together. Start typing and I'll help you make it unbreakable!",
      type: "info",
      audioFile: "/audio/pwd-empty.mp3"
    };
  }

  // Dictionary words detected (Priority Warning)
  if (dictionaryWords.length > 0) {
    return {
      text: "I detected common dictionary words! Hackers use dictionaries to guess passwords! Try replacing letters with numbers or symbols, like 'p@ssw0rd' instead of 'password'.",
      type: "warning",
      audioFile: "/audio/pwd-dictionary.mp3"
    };
  }

  // Very short password
  if (length < 6) {
    return {
      text: "Your password is far too short! Modern computers can crack that instantly. Aim for at least 12 characters to make it secure.",
      type: "warning",
      audioFile: "/audio/pwd-too-short.mp3"
    };
  }

  // Short password
  if (length < 8) {
    return {
      text: "That length is a bit better, but still not enough. Each character you add makes it exponentially harder to crack. Try adding more!",
      type: "warning",
      audioFile: "/audio/pwd-short.mp3"
    };
  }

  // Only lowercase
  if (hasLowercase && !hasUppercase && !hasNumbers && !hasSymbols) {
    return {
      text: "You're using only lowercase letters. Good start, but let's make it stronger! Add UPPERCASE letters, numbers, and symbols like @, #, or $.",
      type: "tip",
      audioFile: "/audio/pwd-only-lower.mp3"
    };
  }

  // Only uppercase
  if (!hasLowercase && hasUppercase && !hasNumbers && !hasSymbols) {
    return {
      text: "All uppercase is okay, but predictable. Mix in some lowercase letters, numbers, and symbols for better security!",
      type: "tip",
      audioFile: "/audio/pwd-only-upper.mp3"
    };
  }

  // Lowercase + uppercase only
  if (hasLowercase && hasUppercase && !hasNumbers && !hasSymbols) {
    return {
      text: "Great! You've mixed uppercase and lowercase. Now add numbers and symbols to make it even stronger!",
      type: "tip",
      audioFile: "/audio/pwd-mixed-letters.mp3"
    };
  }

  // Has letters and numbers but no symbols
  if ((hasLowercase || hasUppercase) && hasNumbers && !hasSymbols) {
    return {
      text: "Nice work mixing letters and numbers! To reach maximum security, add special characters. This makes your password nearly impossible to crack!",
      type: "tip",
      audioFile: "/audio/pwd-needs-symbols.mp3"
    };
  }

  // Medium strength (40-60)
  if (strength >= 40 && strength < 60) {
    return {
      text: "You're getting there! Your password has decent complexity. Try making it longer or adding more variety to boost its strength even further.",
      type: "info",
      audioFile: "/audio/pwd-medium.mp3"
    };
  }

  // Strong password (60-80)
  if (strength >= 60 && strength < 80) {
    return {
      text: "Excellent progress! This password would take years to crack. You've got a good mix of character types. Just a bit more and it'll be virtually unbreakable!",
      type: "success",
      audioFile: "/audio/pwd-strong.mp3"
    };
  }

  // Perfect password (100)
  if (strength >= 100) {
    return {
      text: "Perfect! This is a master-level password! Maximum entropy, no predictable patterns, and would take millennia to crack. You're now a password security expert!",
      type: "success",
      audioFile: "/audio/pwd-perfect.mp3"
    };
  }
  
  // Very strong password (80-99)
  if (strength >= 80) {
    return {
      text: "Outstanding! You've created a password that would take centuries to crack! This is exactly the kind of password that keeps sensitive data safe. Well done!",
      type: "success",
      audioFile: "/audio/pwd-very-strong.mp3"
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
