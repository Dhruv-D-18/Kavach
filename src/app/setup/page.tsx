"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/context/user-context";
import { UserPlus, UserCheck } from "lucide-react";

export default function SetupPage() {
  const router = useRouter();
  const { setIsNewUser } = useUser();

  const handleSelection = (isNew: boolean) => {
    setIsNewUser(isNew);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
      <Card className="max-w-md w-full glass-card border-primary/30 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
              <img src="/kavach_logo.png" alt="Logo" className="w-12 h-12" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gradient">Welcome</CardTitle>
          <CardDescription className="text-lg">
            This is a temporary setup screen to simulate the database logic.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            className="w-full h-16 text-lg gradient-primary gap-3 font-semibold"
            onClick={() => handleSelection(true)}
          >
            <UserPlus className="w-6 h-6" />
            I am a New User
          </Button>
          <Button 
            variant="outline"
            className="w-full h-16 text-lg border-primary/30 hover:border-primary gap-3 hover:bg-primary/10"
            onClick={() => handleSelection(false)}
          >
            <UserCheck className="w-6 h-6" />
            I am an Existing User
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
