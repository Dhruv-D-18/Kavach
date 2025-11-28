"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  username: string;
  email: string;
  score: number;
  level: number;
  xp: number;
  rank?: number;
  totalUsers?: number;
  completedModules?: number;
  totalModules?: number;
  streak?: number;
}

// In a real application, these would be API calls to your backend
// For this prototype, we're using localStorage

interface ApiUser {
  id: string;
  username: string;
  email: string;
  score: number;
  level: number;
  xp: number;
}

interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  signup: (username: string, email: string, password: string) => boolean;
  logout: () => void;
  updateScore: (points: number) => void;
  updateLevel: (newLevel: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load user data from localStorage on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem("kavachUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("kavachUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("kavachUser");
    }
  }, [user]);

  // In a real application, these would be API calls:
  /*
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUser(data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'signup', username, email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUser(data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const updateScore = async (points: number) => {
    if (user) {
      const newScore = user.score + points;
      const newXp = user.xp + points;
      
      // Level up logic (every 500 XP)
      let newLevel = user.level;
      if (newXp >= user.level * 500) {
        newLevel = user.level + 1;
      }
      
      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            action: 'updateScore', 
            userId: user.id,
            score: newScore,
            xp: newXp,
            level: newLevel
          })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setUser(data.user);
        }
      } catch (error) {
        console.error('Update score error:', error);
        // Fallback to local update
        const updatedUser = {
          ...user,
          score: newScore,
          xp: newXp,
          level: newLevel
        };
        setUser(updatedUser);
      }
    }
  };
  */

  // For prototype, we'll use localStorage:
  const login = (email: string, password: string): boolean => {
    // In a real app, this would be an API call
    // For prototype, we'll check localStorage
    const users = JSON.parse(localStorage.getItem("kavachUsers") || "{}");
    
    if (users[email] && users[email].password === password) {
      const userData = users[email];
      setUser({
        id: userData.id,
        username: userData.username,
        email,
        score: userData.score || 0,
        level: userData.level || 1,
        xp: userData.xp || 0,
        rank: userData.rank || 100,
        totalUsers: userData.totalUsers || 1000,
        completedModules: userData.completedModules || 0,
        totalModules: userData.totalModules || 24,
        streak: userData.streak || 0
      });
      return true;
    }
    return false;
  };

  const signup = (username: string, email: string, password: string): boolean => {
    // In a real app, this would be an API call
    // For prototype, we'll store in localStorage
    const users = JSON.parse(localStorage.getItem("kavachUsers") || "{}");
    
    // Check if user already exists
    if (users[email]) {
      return false;
    }
    
    // Create new user
    const newUser = {
      id: Math.random().toString(36).substring(2, 15),
      username,
      password,
      score: 0,
      level: 1,
      xp: 0,
      rank: 100,
      totalUsers: 1000,
      completedModules: 0,
      totalModules: 24,
      streak: 0
    };
    
    users[email] = newUser;
    localStorage.setItem("kavachUsers", JSON.stringify(users));
    
    setUser({
      id: newUser.id,
      username,
      email,
      score: 0,
      level: 1,
      xp: 0,
      rank: 100,
      totalUsers: 1000,
      completedModules: 0,
      totalModules: 24,
      streak: 0
    });
    
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateScore = (points: number) => {
    if (user) {
      const newScore = user.score + points;
      const newXp = user.xp + points;
      
      // Level up logic (every 500 XP)
      let newLevel = user.level;
      if (newXp >= user.level * 500) {
        newLevel = user.level + 1;
      }
      
      const updatedUser = {
        ...user,
        score: newScore,
        xp: newXp,
        level: newLevel
      };
      
      setUser(updatedUser);
      
      // Update in localStorage
      const users = JSON.parse(localStorage.getItem("kavachUsers") || "{}");
      if (users[user.email]) {
        users[user.email].score = newScore;
        users[user.email].xp = newXp;
        users[user.email].level = newLevel;
        localStorage.setItem("kavachUsers", JSON.stringify(users));
      }
    }
  };

  const updateLevel = (newLevel: number) => {
    if (user) {
      const updatedUser = { ...user, level: newLevel };
      setUser(updatedUser);
      
      // Update in localStorage
      const users = JSON.parse(localStorage.getItem("kavachUsers") || "{}");
      if (users[user.email]) {
        users[user.email].level = newLevel;
        localStorage.setItem("kavachUsers", JSON.stringify(users));
      }
    }
  };
  return (
    <UserContext.Provider value={{ user, login, signup, logout, updateScore, updateLevel }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}