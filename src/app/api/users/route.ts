import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getAdminClient() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
}

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  const computed = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return hash === computed;
}

async function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.slice(7);
  const supabase = getAdminClient();
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

interface StoredUser {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  score: number;
  level: number;
  xp: number;
  createdAt: string;
}

const users: StoredUser[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'signup': {
        const existingUser = users.find(u => u.email === data.email);
        if (existingUser) {
          return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const passwordHash = hashPassword(data.password);
        const newUser: StoredUser = {
          id: crypto.randomUUID(),
          username: data.username,
          email: data.email,
          passwordHash,
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
      }

      case 'login': {
        const user = users.find(u => u.email === data.email);
        if (!user || !verifyPassword(data.password, user.passwordHash)) {
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
      }

      case 'updateScore': {
        const authUser = await verifyAuth(request);
        if (!authUser) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

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
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
