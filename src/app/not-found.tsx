import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-dark px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 mb-6 cyber-border rounded-2xl bg-primary/10">
          <Shield className="w-10 h-10 text-primary" />
        </div>
        
        <h1 className="mb-4 text-6xl font-bold text-gradient">404</h1>
        <h2 className="mb-4 text-2xl font-bold text-foreground">Page Not Found</h2>
        <p className="mb-8 text-lg text-muted-foreground">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        
        <Link href="/">
          <Button size="lg" className="gradient-primary font-semibold">
            <Home className="mr-2 h-5 w-5" />
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
