"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CypherGuide } from "@/components/CypherGuide";
import { useUser } from "@/context/user-context";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Shield, Activity, Zap, Timer, ServerCrash, CheckCircle2 } from "lucide-react";

type Phase = "guide" | "playing" | "won" | "failed";
type ThreatType = "unauthorized-port" | "buffer-overflow" | "ddos-surge";

type Packet = {
  id: number;
  src: string;
  port: number;
  sizeKb: number;
  isThreat: boolean;
  threatType?: ThreatType;
  x: number;
  y: number;
  speed: number;
};

const PLAYFIELD_W = 980;
const PLAYFIELD_H = 420;
const GUARDIAN_X = 200;
const GUARDIAN_W = 44;
const GUARDIAN_H = 44;
const SERVER_X = 900;
const TICK_MS = 80;
const MISSION_SECONDS = 95;

function randomIp(prefix?: string) {
  const base = prefix ?? `${10 + Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 255)}`;
  return `${base}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

function makePacket(id: number, elapsed: number, botnetSource: string | null): Packet {
  const inSurge = elapsed > 30;
  const inCrisis = elapsed > 62;
  const threatChance = inCrisis ? 0.42 : inSurge ? 0.28 : 0.16;
  const isThreat = Math.random() < threatChance;

  let threatType: ThreatType | undefined;
  let port = 80;
  let sizeKb = Number((0.8 + Math.random() * 1.2).toFixed(1));
  let src = randomIp();

  if (isThreat) {
    const types: ThreatType[] = ["unauthorized-port", "buffer-overflow", "ddos-surge"];
    threatType = types[Math.floor(Math.random() * types.length)];

    if (threatType === "unauthorized-port") {
      port = Math.random() > 0.5 ? 21 : 23;
      sizeKb = Number((0.9 + Math.random() * 2.0).toFixed(1));
    } else if (threatType === "buffer-overflow") {
      port = 80;
      sizeKb = Number((32 + Math.random() * 48).toFixed(1));
    } else {
      port = 80;
      sizeKb = Number((1 + Math.random() * 2.2).toFixed(1));
      src = botnetSource ?? "112.5.19.77";
    }
  }

  return {
    id,
    src,
    port,
    sizeKb,
    isThreat,
    threatType,
    x: 10,
    y: 26 + Math.random() * (PLAYFIELD_H - 56),
    speed: 3.4 + Math.random() * 1.2 + (inSurge ? 0.8 : 0) + (inCrisis ? 0.7 : 0),
  };
}

export default function OperationIronWall() {
  const router = useRouter();
  const { user, isLoading, updateScore } = useUser();

  const [phase, setPhase] = useState<Phase>("guide");
  const [packets, setPackets] = useState<Packet[]>([]);
  const [guardianY, setGuardianY] = useState(PLAYFIELD_H / 2 - GUARDIAN_H / 2);
  const [elapsed, setElapsed] = useState(0);
  const [integrity, setIntegrity] = useState(100);
  const [cpuLoad, setCpuLoad] = useState(22);
  const [uptime, setUptime] = useState(100);
  const [neutralized, setNeutralized] = useState(0);
  const [blockedIp, setBlockedIp] = useState<string | null>(null);
  const [ipBlockCooldown, setIpBlockCooldown] = useState(0);
  const [flash, setFlash] = useState(false);
  const [scanPacket, setScanPacket] = useState<Packet | null>(null);
  const [guideMessage, setGuideMessage] = useState<{ text: string; type: "info" | "warning" | "success" | "tip" } | null>(null);
  const [firstBlocks, setFirstBlocks] = useState(0);

  const idRef = useRef(1);
  const botnetRef = useRef<string | null>("112.5.19.77");
  const keysRef = useRef({ up: false, down: false });
  const lastSpawnAtRef = useRef(0);
  const lastSpawnYRef = useRef<number | null>(null);
  const scanPacketRef = useRef<Packet | null>(null);
  const cooldownRef = useRef(0);

  const missionLeft = Math.max(0, MISSION_SECONDS - elapsed);
  const missionProgress = (elapsed / MISSION_SECONDS) * 100;
  const shouldWin = elapsed >= MISSION_SECONDS && integrity >= 90;
  const inSurge = elapsed > 30;
  const inCrisis = elapsed > 62;

  useEffect(() => {
    scanPacketRef.current = scanPacket;
  }, [scanPacket]);

  useEffect(() => {
    cooldownRef.current = ipBlockCooldown;
  }, [ipBlockCooldown]);

  useEffect(() => {
    if (!isLoading && !user) router.push("/auth");
  }, [isLoading, user, router]);

  useEffect(() => {
    if (phase !== "guide") return;
    setGuideMessage({
      type: "info",
      text: "Operator, rule set is simple: this web segment expects Port 80 and 443 only. Watch payload sizes and repeated source signatures. Do not rely on color, rely on metadata."
    });
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const intro = new SpeechSynthesisUtterance(
        "Operator, this is Aegis. This web segment expects port eighty and four four three only. Watch payload sizes. Repeated source I.P. patterns indicate coordinated hostile traffic."
      );
      intro.rate = 1.02;
      intro.pitch = 1.0;
      intro.volume = 0.9;
      window.speechSynthesis.speak(intro);
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== "playing") return;

    const handleDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        keysRef.current.up = true;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        keysRef.current.down = true;
      }
      if (e.key === " ") {
        e.preventDefault();
        const packet = scanPacketRef.current;
        if (packet?.isThreat) {
          setPackets((prev) => prev.filter((p) => p.id !== packet.id));
          setScanPacket(null);
          setNeutralized((n) => n + 1);
          setCpuLoad((c) => Math.max(8, c - 3));
          setFirstBlocks((b) => {
            const next = b + 1;
            if (next <= 3) {
              setGuideMessage({
                type: "success",
                text: `Great intercept, Guardian. Threat neutralized (${next}/3). Keep filtering hostile traffic.`
              });
            }
            return next;
          });
        } else if (packet) {
          setIntegrity((curr) => Math.max(0, curr - 1.5));
          setCpuLoad((c) => Math.min(100, c + 6));
          setGuideMessage({
            type: "warning",
            text: "False positive. Legitimate traffic was dropped and service stability degraded."
          });
        }
      }
      if (e.key.toLowerCase() === "b") {
        e.preventDefault();
        const packet = scanPacketRef.current;
        if (cooldownRef.current <= 0 && packet) {
          setBlockedIp(packet.src);
          setPackets((prev) => prev.filter((p) => p.src !== packet.src));
          setScanPacket(null);
          setIpBlockCooldown(15);
          setGuideMessage({
            type: "tip",
            text: `IP Block deployed on ${packet.src}. Cooldown engaged for 15 seconds.`
          });
        }
      }
    };

    const handleUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        keysRef.current.up = false;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        keysRef.current.down = false;
      }
    };

    window.addEventListener("keydown", handleDown);
    window.addEventListener("keyup", handleUp);
    return () => {
      window.removeEventListener("keydown", handleDown);
      window.removeEventListener("keyup", handleUp);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "playing") return;
    const timer = window.setInterval(() => {
      setElapsed((e) => e + 1);
      setIpBlockCooldown((c) => Math.max(0, c - 1));
      setCpuLoad((c) => Math.max(8, c - 0.8));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "playing") return;

    const loop = window.setInterval(() => {
      setGuardianY((y) => {
        let next = y;
        if (keysRef.current.up) next -= 9;
        if (keysRef.current.down) next += 9;
        return Math.max(10, Math.min(PLAYFIELD_H - GUARDIAN_H - 10, next));
      });

      if (Math.random() < (inCrisis ? 0.48 : inSurge ? 0.35 : 0.24)) {
        const now = Date.now();
        const minSpawnGapMs = inCrisis ? 170 : inSurge ? 220 : 280;
        if (now - lastSpawnAtRef.current > minSpawnGapMs) {
          let packet = makePacket(idRef.current++, elapsed, botnetRef.current);
          // Safe distance: avoid visual overlap by forcing lane separation.
          if (lastSpawnYRef.current !== null && Math.abs(packet.y - lastSpawnYRef.current) < 34) {
            packet = { ...packet, y: Math.max(20, Math.min(PLAYFIELD_H - 34, packet.y + 52)) };
          }
          lastSpawnAtRef.current = now;
          lastSpawnYRef.current = packet.y;
          setPackets((prev) => [...prev.slice(-70), packet]);
        }
      }

      setPackets((prev) => {
        const moved = prev
          .map((p) => ({ ...p, x: p.x + p.speed }))
          .filter((p) => (blockedIp ? p.src !== blockedIp : true));

        // Collision with guardian -> open scan HUD.
        const colliding = moved.find(
          (p) =>
            p.x < GUARDIAN_X + GUARDIAN_W &&
            p.x + 20 > GUARDIAN_X &&
            p.y < guardianY + GUARDIAN_H &&
            p.y + 20 > guardianY
        );
        if (colliding) setScanPacket(colliding);

        // Threats hitting server damage integrity.
        const hitsServer = moved.filter((p) => p.x >= SERVER_X);
        const threatHits = hitsServer.filter((p) => p.isThreat).length;
        const legitHits = hitsServer.filter((p) => !p.isThreat).length;
        if (threatHits > 0) {
          setIntegrity((curr) => Math.max(0, curr - threatHits * 3.5));
          setCpuLoad((c) => Math.min(100, c + threatHits * 6));
          setFlash(true);
          window.setTimeout(() => setFlash(false), 120);
        }
        if (legitHits > 0) {
          // Legitimate traffic slightly lowers load by proving healthy flow.
          setCpuLoad((c) => Math.max(8, c - legitHits * 1.2));
        }

        // Remove packets that reached server.
        return moved.filter((p) => p.x < PLAYFIELD_W + 40);
      });
    }, TICK_MS);

    return () => window.clearInterval(loop);
  }, [phase, elapsed, blockedIp, inCrisis, inSurge, guardianY]);

  useEffect(() => {
    setUptime(Math.max(0, Number(integrity.toFixed(1))));
    if (phase !== "playing") return;

    if (cpuLoad > 90) {
      setIntegrity((curr) => Math.max(0, curr - 0.35));
    }

    if (integrity < 90) {
      setPhase("failed");
      setGuideMessage({
        type: "warning",
        text: "System uptime dropped below safe threshold. Re-run simulation and tighten packet triage."
      });
    } else if (shouldWin) {
      setPhase("won");
      setGuideMessage({
        type: "success",
        text: "Mission success. Iron Wall held. Uploading threat neutralization report."
      });
      if (user) {
        const earned = Math.max(150, Math.floor(uptime * 2 + neutralized * 6));
        updateScore(earned, { moduleId: 3, moduleName: "Operation Iron Wall", accuracy: Math.round(uptime) }).catch(() => {});
        // Best-effort module completion write for map unlock logic.
        (supabase as any)
          .from("levels_progress")
          .upsert(
            {
              user_id: user.id,
              module_id: 3,
              completed: true,
              best_uptime: uptime,
              threats_neutralized: neutralized,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id,module_id" }
          )
          .catch(() => {});
      }
    }
  }, [integrity, cpuLoad, shouldWin, phase, uptime, neutralized, user, updateScore]);

  const currentSourceBurstCount = useMemo(() => {
    if (!scanPacket) return 0;
    return packets.filter((p) => p.src === scanPacket.src).length;
  }, [packets, scanPacket]);

  const startMission = () => {
    keysRef.current = { up: false, down: false };
    setPhase("playing");
    setPackets([]);
    setElapsed(0);
    setIntegrity(100);
    setCpuLoad(22);
    setUptime(100);
    setNeutralized(0);
    setBlockedIp(null);
    setIpBlockCooldown(0);
    setScanPacket(null);
    setFirstBlocks(0);
    setGuideMessage({
      type: "tip",
      text: "Mission live. DPI discipline: scan packet metadata first. Space drops scanned packet. B blocks scanned source IP. False positives damage service."
    });
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navigation />
      <CypherGuide message={guideMessage} isVisible={true} />

      {isLoading && (
        <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-center justify-center">
          <div className="text-cyan-400 font-mono tracking-[0.2em] animate-pulse">SYNCING OPERATOR SESSION...</div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8 mt-16">
        <Button variant="ghost" className="mb-4" onClick={() => router.push("/modules")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Modules
        </Button>

        <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div>
            <h1 className="text-4xl font-bold text-gradient">Operation Iron Wall</h1>
            <p className="text-muted-foreground">SOC Defense Simulation • Network Guardian Mode</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-cyan-500/40 text-cyan-300 bg-cyan-500/10">
              Uptime {uptime.toFixed(1)}%
            </Badge>
            <Badge variant="outline" className="border-rose-500/40 text-rose-300 bg-rose-500/10">
              CPU Load {Math.round(cpuLoad)}%
            </Badge>
            <Badge variant="outline" className="border-purple-500/40 text-purple-300 bg-purple-500/10">
              Threats Neutralized: {neutralized}
            </Badge>
            <Badge variant="outline" className="border-amber-500/40 text-amber-300 bg-amber-500/10">
              T-{missionLeft}s
            </Badge>
          </div>
        </div>

        <Card className="glass-card border-cyan-500/20 mb-4">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">System Integrity</div>
                <Progress value={integrity} className={`h-2 ${integrity < 92 ? "[&>div]:bg-rose-500" : "[&>div]:bg-cyan-500"}`} />
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">CPU Load</div>
                <Progress value={cpuLoad} className={`h-2 ${cpuLoad > 85 ? "[&>div]:bg-rose-500" : "[&>div]:bg-indigo-500"}`} />
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Mission Timeline</div>
                <Progress value={missionProgress} className="h-2 [&>div]:bg-purple-500" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">IP Block Cooldown</div>
                <Progress value={Math.max(0, 100 - (ipBlockCooldown / 15) * 100)} className="h-2 [&>div]:bg-amber-500" />
              </div>
            </div>
            <div className="text-xs text-muted-foreground flex flex-wrap gap-4">
              <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> Expected safe traffic: Port 80, ~1.5kb payload</span>
              <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Surge: {inSurge ? "ACTIVE" : "Standby"}</span>
              <span className="flex items-center gap-1"><ServerCrash className="w-3 h-3" /> Botnet Crisis: {inCrisis ? "ACTIVE" : "Standby"}</span>
            </div>
          </CardContent>
        </Card>

        {phase === "guide" && (
          <Card className="glass-card border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Radio Briefing
              </CardTitle>
              <CardDescription>
                Analyze packet headers, defend availability, and keep uptime above 90%.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-3 text-sm">
                  <div className="rounded-lg border border-border/40 bg-background/40 p-3">Unauthorized Port: <span className="text-cyan-300">Not 80/443</span></div>
                  <div className="rounded-lg border border-border/40 bg-background/40 p-3">Payload Anomaly: <span className="text-cyan-300">&gt; 2kb suspicious</span></div>
                  <div className="rounded-lg border border-border/40 bg-background/40 p-3">Botnet Pattern: <span className="text-cyan-300">same IP burst</span></div>
              </div>
              <Button className="w-full gradient-primary h-12 text-lg font-semibold" onClick={startMission}>
                Start Mission
              </Button>
            </CardContent>
          </Card>
        )}

        {phase === "playing" && (
          <div className={`relative overflow-hidden rounded-xl border-2 ${flash ? "border-rose-500 bg-rose-500/10" : "border-cyan-500/30"} bg-slate-950`} style={{ height: PLAYFIELD_H }}>
            <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent 0px, transparent 8px, rgba(34,211,238,0.2) 9px)" }} />

            {/* Server target */}
            <div className="absolute top-0 bottom-0 w-[64px] border-l border-cyan-500/40 bg-cyan-500/5" style={{ left: SERVER_X }}>
              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] tracking-widest text-cyan-300">CORE</div>
            </div>

            {/* Guardian */}
            <div
              className="absolute w-11 h-11 rounded-lg border border-cyan-300/70 bg-cyan-500/20 shadow-[0_0_14px_rgba(34,211,238,.5)] flex items-center justify-center text-[10px] font-bold text-cyan-200"
              style={{ left: GUARDIAN_X, top: guardianY }}
            >
              NG
            </div>

            {/* Packets */}
            {packets.map((p) => (
              <div
                key={p.id}
                className="absolute w-5 h-5 rotate-45 border border-cyan-300/70 bg-cyan-400/20"
                style={{ left: p.x, top: p.y }}
                title={`${p.src}:${p.port} • ${p.sizeKb}kb`}
                onMouseEnter={() => setScanPacket(p)}
              />
            ))}

            {/* Scan HUD */}
            {scanPacket && (
              <div className="absolute right-4 top-4 w-72 rounded-xl border border-green-500/40 bg-black/85 p-3 shadow-[0_0_20px_rgba(34,197,94,.15)]">
                <div className="text-[10px] tracking-[0.2em] text-green-400 mb-2">SCAN HUD</div>
                <div className="text-sm mb-2 text-slate-200">DPI ANALYSIS ACTIVE</div>
                <div className="text-xs text-slate-300 space-y-1 font-mono">
                  <div>SRC: {scanPacket.src}</div>
                  <div>PORT: {scanPacket.port}</div>
                  <div>SIZE: {scanPacket.sizeKb}kb</div>
                  <div>TYPE: {scanPacket.threatType ?? "normal"}</div>
                  <div>FREQ: {currentSourceBurstCount} packets in stream</div>
                </div>
                <div className="mt-2 text-[11px] text-cyan-300">
                  Rule Hint: Only 80/443 expected. Payload above 2kb is suspicious in this segment.
                </div>
                <div className="mt-3 text-[11px] text-slate-400">
                  <kbd className="px-1 py-0.5 bg-slate-800 rounded">SPACE</kbd> Drop Packet •{" "}
                  <kbd className="px-1 py-0.5 bg-slate-800 rounded">B</kbd> Block Source IP
                </div>
              </div>
            )}
          </div>
        )}

        {(phase === "won" || phase === "failed") && (
          <Card className="glass-card border-primary/20 mt-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {phase === "won" ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    Operation Successful
                  </>
                ) : (
                  <>
                    <ServerCrash className="w-5 h-5 text-rose-400" />
                    Mission Failed
                  </>
                )}
              </CardTitle>
              <CardDescription>
                Final Uptime: {uptime.toFixed(1)}% • Threats Neutralized: {neutralized}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button className="gradient-primary" onClick={startMission}>
                Replay Mission
              </Button>
              <Button variant="outline" onClick={() => router.push("/modules")}>
                Back to Modules
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

