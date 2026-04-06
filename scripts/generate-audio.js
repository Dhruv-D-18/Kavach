const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// We check both because sometimes users name it with NEXT_PUBLIC_
const API_KEY = process.env.ELEVENLABS_API_KEY || process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
const VOICE_ID = 'DQuoFsZ3oda1diTerwpq'; // The Voice ID provided by you

if (!API_KEY) {
  console.error("❌ ERROR: ELEVENLABS_API_KEY not found in .env.local");
  console.log("Please add your key to `.env.local` like this:\nELEVENLABS_API_KEY=your_key_here\n");
  process.exit(1);
}

const tourSteps = [
  "Hello there! I'm Aegis, your personal cybersecurity mentor. Welcome to Kavach Academy. Let me show you around our interactive training ground.",
  "Up here is your Progress Dashboard. This is where you can track your XP, check your level, and see your completed modules. Complete missions to earn points and rank up!",
  "We divide our training into two phases. First, the Theory section, where you learn the core concepts. Then, the Practice section, where you dive into the game and put your skills to the test.",
  "In the 'Crack the Vault' module, you'll use our Password Strength Meter. As you type, I'll be right there with you, analyzing your password in real-time and warning you about common vulnerabilities.",
  "You will also see a Crack Time Estimator. This shows exactly how long a cyber-criminal would need to break your password. Our mission objective? To push that time from mere seconds into centuries.",
  "Once you engineer a sufficiently strong password, the vault unlocks! You'll be rewarded with XP based on your performance. A flawless password earns bonus points. Are you ready to begin your first mission?"
];

async function generateAudio() {
  const outputDir = path.join(process.cwd(), 'public', 'audio');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`Created directory: ${outputDir}`);
  }

  console.log(`\n🎙️  Starting batch audio generation for ${tourSteps.length} clips...`);

  for (let i = 0; i < tourSteps.length; i++) {
    const text = tourSteps[i];
    const outputPath = path.join(outputDir, `tour-step-${i}.mp3`);
    
    // Safety check so we don't accidentally burn credits if it already generated successfully
    if (fs.existsSync(outputPath)) {
      console.log(`⏩ Step ${i} already exists at ${outputPath}, skipping...`);
      continue;
    }

    console.log(`⏳ Generating Step ${i}...`);
    
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1', // standard model
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}: ${await response.text()}`);
      }

      const buffer = await response.arrayBuffer();
      fs.writeFileSync(outputPath, Buffer.from(buffer));
      console.log(`✅ Saved tour-step-${i}.mp3`);
      
    } catch (error) {
      console.error(`❌ Failed to generate Step ${i}:`, error.message);
    }
  }
  console.log("\n🎉 Audio generation complete! You can now test the app.");
}

// Check for fetch API available in Node 18+
if (typeof fetch === 'undefined') {
  console.error("This script requires Node.js v18 or higher (because it uses native fetch). Please update Node.js!");
  process.exit(1);
}

generateAudio();
