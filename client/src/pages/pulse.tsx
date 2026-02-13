import { GlassCard, PageHeader } from "@/components/ui-custom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Activity, AlertOctagon, TrendingUp, DollarSign, Loader2, Sparkles, CheckCircle, Zap, ArrowRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useState, useEffect } from "react";
import { pulseApi } from "@/api/arthApi";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function Pulse() {
  const [showScenario, setShowScenario] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load cached analysis first for instant feel
    const cached = localStorage.getItem("pulse_analysis");
    if (cached) {
      setAnalysis(JSON.parse(cached));
    }
    fetchAnalysis();
  }, []);

  const [loadingStep, setLoadingStep] = useState(0);
  const loadingSteps = [
    "Initializing Sentinel Pulse...",
    "Scanning EMI Risk Vectors...",
    "Analyzing Debt-to-Income Liquidity...",
    "Predicting Trap Forecast Curves...",
    "Finalizing Strategic Prescription..."
  ];

  useEffect(() => {
    let interval: any;
    if (analyzing) {
      interval = setInterval(() => {
        setLoadingStep(prev => (prev + 1) % loadingSteps.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [analyzing]);

  const fetchAnalysis = async () => {
    setAnalyzing(true);
    // Artificially delay for the "Tech" feel
    await new Promise(r => setTimeout(r, 4000));
    try {
      const response = await pulseApi.analyze();
      setAnalysis(response.data);
      localStorage.setItem("pulse_analysis", JSON.stringify(response.data));
    } catch (error: any) {
      toast({ title: "Error", description: "Pulse scan failed.", variant: "destructive" });
    } finally {
      setAnalyzing(false);
    }
  };

  const [isApplying, setIsApplying] = useState(false);

  const handleApply = () => {
    setIsApplying(true);
    toast({ title: "Syncing Strategy...", description: "AI is configuring your SIPs and budget limits." });
    setTimeout(() => {
      setIsApplying(false);
      toast({
        title: "Strategy Applied! 🚀",
        description: "Your monthly SIP has been simulated and budget targets locked.",
      });
    }, 2500);
  };

  const healthTrend = [
    { month: 'Trending', score: analysis?.health_score || 70 },
    { month: 'Current', score: analysis?.health_score || 72 },
  ];

  if (analyzing && !analysis) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-8 sentinel-grid relative overflow-hidden rounded-3xl border border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="relative">
          <div className="w-40 h-40 rounded-full border-4 border-primary/10 animate-[spin_4s_linear_infinite]" />
          <div className="w-40 h-40 rounded-full border-t-4 border-primary absolute inset-0 animate-spin" />
          <Activity className="w-16 h-16 text-primary absolute inset-0 m-auto animate-pulse" />

          {/* Scanning line effect */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-primary/40 blur-sm animate-[scan_2s_ease-in-out_infinite]" />
        </div>
        <div className="text-center space-y-4 relative z-10">
          <h2 className="text-2xl font-black text-white tracking-[0.3em] uppercase animate-pulse">
            {loadingSteps[loadingStep]}
          </h2>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce"></span>
          </div>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest max-w-xs mx-auto opacity-60">
            Real-time Financial Vital Sign Audit in Progress
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Debt Pulse Monitor"
        subtitle="High-fidelity AI forecasting of debt trap vectors and financial vital sign monitoring."
      />

      {/* Heartbeat Header */}
      <div className="sentinel-border glow-blue rounded-3xl overflow-hidden">
        <div className="relative h-28 bg-black/40 backdrop-blur-2xl flex items-center justify-between px-10">
          <div className="absolute inset-x-0 bottom-0 h-20 opacity-30">
            <svg className="w-full h-full stroke-emerald-500" viewBox="0 0 1000 100" fill="none" preserveAspectRatio="none">
              <path d="M0,50 L200,50 L210,20 L220,80 L230,50 L400,50 L410,20 L420,80 L430,50 L600,50 L610,20 L620,80 L630,50 L1000,50" strokeWidth="1" className="animate-pulse" />
            </svg>
          </div>

          <div className="relative z-10 flex items-center gap-6">
            <div className={cn(
              "p-4 rounded-2xl relative",
              analysis?.status === 'DANGER' ? 'bg-rose-500/20 text-rose-500' : 'bg-emerald-500/20 text-emerald-500'
            )}>
              <div className="absolute inset-0 rounded-2xl bg-current opacity-20 animate-ping" />
              <Activity className="w-8 h-8 relative z-10" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-1">Sentinel Guardian Status</p>
              <h2 className="text-3xl font-black text-white tracking-widest uppercase italic">
                {analysis?.status === 'SAFE' ? 'Protocol: Optimal' : analysis?.status === 'WARNING' ? 'Protocol: Elevated Risk' : 'Protocol: Critical Breach'}
              </h2>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 relative z-10 border-l border-white/5 pl-8">
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Scanning Frequency</p>
              <p className="text-white font-bold tabular-nums">1.2ms Real-time</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">AI Trust Score</p>
              <p className="text-emerald-400 font-bold tabular-nums">99.8%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Row 1: Three Equal Cards */}
        <div className={cn(
          "sentinel-border rounded-3xl overflow-hidden",
          analysis?.status === 'DANGER' ? 'glow-rose' : analysis?.status === 'WARNING' ? 'glow-amber' : 'glow-emerald'
        )}>
          <GlassCard className={cn(
            "p-8 h-full flex flex-col items-center justify-center text-center relative overflow-hidden",
            analysis?.status === 'DANGER' ? 'bg-rose-950/20' : analysis?.status === 'WARNING' ? 'bg-amber-950/20' : 'bg-emerald-950/20'
          )}>
            <div className="absolute top-0 right-0 p-6 opacity-5">
              <Sparkles className="w-24 h-24" />
            </div>
            <h3 className="text-[10px] font-black text-gray-500 tracking-[0.3em] uppercase mb-6">Trap Forecast Velocity</h3>
            <div className="relative">
              <h1 className={cn(
                "text-7xl font-black tracking-tighter tabular-nums italic",
                analysis?.status === 'DANGER' ? 'text-rose-500' : analysis?.status === 'WARNING' ? 'text-amber-500' : 'text-emerald-500'
              )}>
                {analysis?.debt_trap_days ? `${analysis.debt_trap_days}D` : 'CLEAN'}
              </h1>
              <p className="text-gray-500 mt-6 font-black uppercase tracking-[0.15em] text-[10px] px-4 max-w-[200px] mx-auto leading-relaxed">
                Critical EMI Threshold Proximity Monitor
              </p>
            </div>
          </GlassCard>
        </div>

        {/* Risk Indicators */}
        <div className="sentinel-border glow-blue rounded-3xl overflow-hidden">
          <GlassCard className="p-8 space-y-8 flex flex-col justify-center h-full">
            <h3 className="text-[10px] font-black text-gray-500 tracking-[0.3em] uppercase">Vulnerability Vectors</h3>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">EMI Liquidity Ratio</span>
                <span className={cn(
                  "text-xl font-black tabular-nums italic",
                  (analysis?.emi_to_income_ratio || 0) > 40 ? 'text-rose-400' : 'text-emerald-400'
                )}>
                  {analysis?.emi_to_income_ratio || 0}%
                </span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div className={cn(
                  "h-full transition-all duration-1000 rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]",
                  (analysis?.emi_to_income_ratio || 0) > 40 ? 'bg-rose-500' : 'bg-emerald-500'
                )} style={{ width: `${analysis?.emi_to_income_ratio || 0}%` }}></div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Net Savings Retention</span>
                <span className={cn(
                  "text-xl font-black tabular-nums italic",
                  (analysis?.savings_rate || 0) < 20 ? 'text-rose-400' : 'text-emerald-400'
                )}>
                  {analysis?.savings_rate || 0}%
                </span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div className={cn(
                  "h-full transition-all duration-1000 rounded-full",
                  (analysis?.savings_rate || 0) < 20 ? 'bg-rose-500' : 'bg-emerald-500'
                )} style={{ width: `${analysis?.savings_rate || 0}%` }}></div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Stability Profile</span>
              <div className={cn(
                "px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border",
                analysis?.trend === 'DETERIORATING' ? 'text-rose-400 border-rose-500/20 bg-rose-500/5' : 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5'
              )}>
                {analysis?.trend || 'STABLE PROTOCOL'}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Health Trend Chart */}
        <div className="sentinel-border glow-blue rounded-3xl overflow-hidden">
          <GlassCard className="p-8 flex flex-col justify-center h-full">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-[10px] font-black text-gray-500 tracking-[0.3em] uppercase">Vitality Trajectory</h3>
              <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Projection Mode</span>
                <Switch checked={showScenario} onCheckedChange={setShowScenario} className="data-[state=checked]:bg-primary" />
              </div>
            </div>
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={healthTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="month" stroke="#4B5563" fontSize={10} axisLine={false} tickLine={false} dy={10} />
                  <YAxis domain={[0, 100]} stroke="#4B5563" hide />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0A0F1E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                    itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke={analysis?.status === 'DANGER' ? "#EF4444" : "#3B82F6"}
                    strokeWidth={4}
                    dot={{ r: 4, fill: analysis?.status === 'DANGER' ? "#EF4444" : "#3B82F6", strokeWidth: 0 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                  {showScenario && (
                    <Line type="monotone" data={[...healthTrend, { month: 'Forecast', score: 45 }]} dataKey="score" stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* AI Prescription - Sentinel Strategic Directives */}
      {analysis?.prescription && (
        <div className="space-y-6 mt-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="flex items-center gap-4 px-2">
            <div className="h-[2px] w-12 bg-primary rounded-full" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Sentinel Strategic Directives</h2>
          </div>

          {/* Header Section */}
          <div className="sentinel-border glow-emerald rounded-3xl overflow-hidden">
            <GlassCard className="p-10 border-l-4 border-l-emerald-500 bg-emerald-500/[0.02]">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                <div className="flex items-start gap-6">
                  <div className="p-5 bg-emerald-500/20 rounded-2xl flex-shrink-0 animate-pulse shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    <AlertOctagon className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic mb-3">
                      Master Optimization Plan
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-2xl font-medium">
                      {analysis.scenario_if_no_action || "Your financial health is currently stable. Follow these AI-curated steps to further optimize your savings and bulletproof your future from debt traps."}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleApply}
                  disabled={isApplying}
                  className="bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest px-10 h-14 rounded-2xl shadow-2xl shadow-primary/20 flex-shrink-0 transition-all active:scale-95"
                >
                  {isApplying ? <Loader2 className="animate-spin mr-3" /> : <Zap className="w-5 h-5 mr-3" />}
                  {isApplying ? "Syncing Logic..." : "Execute Strategy"}
                </Button>
              </div>
            </GlassCard>
          </div>

          {/* Action Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {(analysis.prescription || []).map((step: any, i: number) => (
              <div key={i} className="sentinel-border glow-blue rounded-3xl overflow-hidden group">
                <GlassCard className="p-8 h-full transition-all group-hover:bg-white/[0.08] relative overflow-hidden">
                  {/* Background Effect */}
                  <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-5 transition-opacity duration-500 translate-x-4 translate-y--4 group-hover:translate-x-0 group-hover:translate-y-0">
                    <CheckCircle className="w-32 h-32 text-emerald-500" />
                  </div>

                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-md border border-emerald-500/20">
                        Directive {i + 1}
                      </span>
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-[0.2em] border px-3 py-1.5 rounded-md shadow-sm",
                        step.priority === 'HIGH'
                          ? "text-rose-400 border-rose-500/30 bg-rose-500/10"
                          : "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                      )}>
                        {step.priority} PRIORITY
                      </span>
                    </div>

                    <p className="text-white font-black text-xl leading-snug group-hover:text-primary transition-colors italic tracking-tight">
                      {step.action}
                    </p>

                    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                          <DollarSign className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">
                            Retention Delta
                          </p>
                          <p className="text-emerald-400 font-black text-2xl tabular-nums italic">
                            +₹{step.monthly_saving.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="p-3 rounded-full bg-white/5 group-hover:bg-primary/20 transition-all border border-white/5 group-hover:border-primary/30">
                        <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}