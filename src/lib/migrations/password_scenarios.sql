-- 1. Create the Password Scenarios Table
CREATE TABLE IF NOT EXISTS password_scenarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  bio TEXT,
  posts TEXT[],
  correct_password TEXT NOT NULL,
  vulnerabilities TEXT[],
  difficulty TEXT DEFAULT 'Beginner',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Seed with initial training data
INSERT INTO password_scenarios (name, bio, posts, correct_password, vulnerabilities, difficulty) VALUES
(
  'John Doe', 
  'System Admin. Class of 1985. Lifelong Lakers fan. 🏀', 
  ARRAY['"Happy 10th birthday to my dog Buster! 🐶"', '"Can''t wait for the game tonight!"'], 
  'Buster1985', 
  ARRAY['Buster', '1985', 'Lakers'],
  'Beginner'
),
(
  'Sarah Miller', 
  'Marketing Director. Seattle native. 🌧️ Coffee enthusiast.', 
  ARRAY['"Just adopted Luna from the shelter! 🐈"', '"Married my best friend in 2018!"'], 
  'Seattle2018', 
  ARRAY['Seattle', 'Luna', '2018'],
  'Intermediate'
),
(
  'David Chen', 
  'IT Specialist. Retro gaming collector. Born in 1992.', 
  ARRAY['"Finally finished CyberQuest on Hard mode! 🎮"', '"Missing my cat Zelda today. 🐱"'], 
  'Zelda1992', 
  ARRAY['Zelda', '1992', 'CyberQuest'],
  'Advanced'
);

-- 3. Enable RLS
ALTER TABLE password_scenarios ENABLE ROW LEVEL SECURITY;

-- 4. Allow public read access (for Academy students)
CREATE POLICY "Allow public read access to scenarios" 
ON password_scenarios FOR SELECT 
USING (true);
