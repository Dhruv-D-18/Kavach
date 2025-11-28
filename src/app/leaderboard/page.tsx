import { Navigation } from "@/components/Navigation";
import { Trophy, Crown, Medal, Zap, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

const leaderboardData = [
  { rank: 1, username: "CyberNinja", level: 28, badges: 24, xp: 15420, avatar: "CN" },
  { rank: 2, username: "HackMaster", level: 26, badges: 22, xp: 14850, avatar: "HM" },
  { rank: 3, username: "SecureShield", level: 25, badges: 21, xp: 13990, avatar: "SS" },
  { rank: 4, username: "ByteDefender", level: 24, badges: 19, xp: 12760, avatar: "BD" },
  { rank: 5, username: "CodeGuardian", level: 23, badges: 18, xp: 11540, avatar: "CG" },
  { rank: 6, username: "NetWarrior", level: 22, badges: 17, xp: 10980, avatar: "NW" },
  { rank: 7, username: "CipherKnight", level: 21, badges: 16, xp: 9870, avatar: "CK" },
  { rank: 8, username: "DataSentinel", level: 20, badges: 15, xp: 9200, avatar: "DS" },
];

export default function Leaderboard() {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-gold" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-silver" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-bronze" />;
    return null;
  };
  
  const getRankStyle = (rank: number) => {
    if (rank === 1) return "cyber-border bg-gradient-to-r from-gold/10 to-transparent";
    if (rank === 2) return "border-silver/30 bg-gradient-to-r from-silver/10 to-transparent";
    if (rank === 3) return "border-bronze/30 bg-gradient-to-r from-bronze/10 to-transparent";
    return "";
  };
  
  return (
    <div className="min-h-screen pb-20">
      <Navigation />
      
      <div className="pt-32 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 cyber-border rounded-2xl bg-primary/10">
              <Trophy className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-5xl font-bold mb-4">
              <span className="text-gradient">Leaderboard</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Compete with the best cyber defenders worldwide
            </p>
          </div>
          
          {/* Time Period Selector */}
          <div className="flex gap-3 mb-8 p-2 glass-card rounded-full max-w-md mx-auto">
            <Button className="flex-1 gradient-primary rounded-full">
              Weekly
            </Button>
            <Button variant="ghost" className="flex-1 rounded-full">
              Monthly
            </Button>
            <Button variant="ghost" className="flex-1 rounded-full">
              All-time
            </Button>
          </div>
          
          {/* Leaderboard List */}
          <div className="space-y-3">
            {leaderboardData.map((player) => (
              <div 
                key={player.rank}
                className={`glass-card rounded-2xl p-5 hover:cyber-glow transition-all ${getRankStyle(player.rank)}`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-secondary font-bold text-lg">
                    {player.rank <= 3 ? getRankIcon(player.rank) : player.rank}
                  </div>
                  
                  {/* Avatar */}
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20 text-primary font-bold border-2 border-primary/30">
                    {player.avatar}
                  </div>
                  
                  {/* User Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{player.username}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Zap className="w-4 h-4 text-primary" />
                        Level {player.level}
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="w-4 h-4 text-primary" />
                        {player.badges} badges
                      </span>
                    </div>
                  </div>
                  
                  {/* XP Score */}
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{player.xp.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">points</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* CTA for non-logged users */}
          <div className="glass-card cyber-border rounded-2xl p-8 mt-12 text-center">
            <h3 className="text-2xl font-bold mb-3">Join the Competition!</h3>
            <p className="text-muted-foreground mb-6">
              Complete challenges, earn XP, and climb the leaderboard
            </p>
            <Button size="lg" className="gradient-primary font-semibold">
              Start Competing
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
