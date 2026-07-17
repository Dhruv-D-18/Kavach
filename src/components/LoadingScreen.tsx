export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 border-t-2 border-cyan-500 rounded-full animate-spin" />
          <div className="absolute inset-2 border-t-2 border-purple-500 rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.8s" }} />
        </div>
        <p className="text-cyan-400 font-mono text-sm animate-pulse">Initializing secure connection...</p>
      </div>
    </div>
  );
}
