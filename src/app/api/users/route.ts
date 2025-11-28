import { NextRequest, NextResponse } from 'next/server';

// This is a mock API for demonstration purposes
// In a real application, this would connect to a database

interface User {
  id: string;
  username: string;
  email: string;
  password: string; // In a real app, this would be hashed
  score: number;
  level: number;
  xp: number;
  createdAt: string;
}

// Mock database
let users: User[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'signup':
        // Check if user already exists
        const existingUser = users.find(u => u.email === data.email);
        if (existingUser) {
          return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        // Create new user
        const newUser: User = {
          id: Math.random().toString(36).substring(2, 15),
          username: data.username,
          email: data.email,
          password: data.password, // In a real app, hash this!
          score: 0,
          level: 1,
          xp: 0,
          createdAt: new Date().toISOString()
        };

        users.push(newUser);
        return NextResponse.json({ 
          user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            score: newUser.score,
            level: newUser.level,
            xp: newUser.xp
          }
        });

      case 'login':
        const user = users.find(u => u.email === data.email && u.password === data.password);
        if (!user) {
          return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        return NextResponse.json({ 
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            score: user.score,
            level: user.level,
            xp: user.xp
          }
        });

      case 'updateScore':
        const userToUpdate = users.find(u => u.id === data.userId);
        if (!userToUpdate) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        userToUpdate.score = data.score;
        userToUpdate.xp = data.xp;
        userToUpdate.level = data.level;

        return NextResponse.json({ 
          user: {
            id: userToUpdate.id,
            username: userToUpdate.username,
            email: userToUpdate.email,
            score: userToUpdate.score,
            level: userToUpdate.level,
            xp: userToUpdate.xp
          }
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // Return all users (for demonstration only)
  return NextResponse.json({ users: users.map(u => ({
    id: u.id,
    username: u.username,
    email: u.email,
    score: u.score,
    level: u.level,
    xp: u.xp
  })) });
}