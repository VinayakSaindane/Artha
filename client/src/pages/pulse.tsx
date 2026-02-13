import { GlassCard, PageHeader } from "@/components/ui-custom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Activity, AlertOctagon, TrendingUp, TrendingDown, DollarSign, Loader2, Sparkles, Brain } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from "recharts";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { pulseApi } from "@/api/arthApi";
import { useToast } from "@/hooks/use-toast";

export default function Pulse() {
  const [showScenario, setShowScenario] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const fetchAnalysis = async () => {
    setAnalyzing(true);
    // Safety timeout
    const timeout = setTimeout(() => {
      if (!analysis) setAnalyzing(false);
    }, 4000);

    try {
      const response = await pulseApi.analyze();
      setAnalysis(response.data);
    } catch (error: any) {
      console.warn("Pulse fetch failed, using internal analysis");
    } finally {
      clearTimeout(timeout);
      setAnalyzing(false);
    }
  };

  const healthData = [
    { name: 'Sep', score: 85 },
    { name: 'Oct', score: 78 },
    { name: 'Nov', score: 82 },
    { name: 'Dec', score: 65 },
    { name: 'Jan', score: 70 },
    { name: 'Feb', score: analysis?.health_score || 72 },
  ];

  if (analyzing && !analysis) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
          <Brain className="w-8 h-8 text-primary absolute inset-0 m-auto" />
        </div>
        <p className="text-gray-400 font-medium animate-pulse">ARTH AI is analyzing your debt patterns...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <PageHeader title="Debt Pulse" subtitle="Real-time debt trap monitoring and AI forecasting" />
        <div className={cn(
          "px-4 py-2 rounded-full border flex items-center gap-2 mb-2 animate-in fade-in zoom-in duration-500",
          analysis?.status === 'DANGER' ? "bg-rose-500/10 border-rose-500/20 text-rose-500" :
            analysis?.status === 'WARNING' ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
              "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
        )}>
          <div className={cn("w-2 h-2 rounded-full animate-ping",
            analysis?.status === 'DANGER' ? "bg-rose-500" :
              analysis?.status === 'WARNING' ? "bg-amber-500" : "bg-emerald-500"
          )} />
          <span className="text-xs font-bold uppercase tracking-widest">
            System {analysis?.status || 'Normal'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Metric */}
        <GlassCard className="lg:col-span-2 p-8 flex flex-col items-center justify-center text-center overflow-hidden relative min-h-[300px]">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <path d="M0,50 Q25,30 50,50 T100,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </svg>
          </div>

          <h3 className="text-gray-400 font-medium tracking-widest uppercase mb-2">Debt Trap Forecast</h3>
          <div className="relative z-10">
            <div className="flex items-baseline justify-center gap-2">
              <h1 className={cn(
                "text-7xl font-bold tracking-tighter tabular-nums",
                analysis?.status === 'DANGER' ? 'text-rose-500' :
                  analysis?.status === 'WARNING' ? 'text-amber-500' : 'text-emerald-500'
              )}>
                {analysis?.debt_trap_days || 'SAFE'}
              </h1>
              {analysis?.debt_trap_days && <span className="text-2xl font-bold text-gray-500">DAYS</span>}
            </div>
            <p className="text-gray-400 mt-2 max-w-[250px] mx-auto text-sm">Estimated time until your debt becomes unmanageable at current spending.</p>
          </div>

          <div className="mt-8 flex gap-4 w-full px-4">
            <div className="flex-1 p-3 rounded-xl bg-white/5 border border-white/5 text-center">
              <p className="text-[10px] text-gray-500 uppercase font-bold">Health Score</p>
              <p className="text-xl font-bold text-white">{analysis?.health_score || 0}</p>
            </div>
            <div className="flex-1 p-3 rounded-xl bg-white/5 border border-white/5 text-center">
              <p className="text-[10px] text-gray-500 uppercase font-bold">EMI/Income</p>
              <p className="text-xl font-bold text-white">{analysis?.emi_to_income_ratio || 0}%</p>
            </div>
          </div>
        </GlassCard>

        {/* Chart Card */}
        <GlassCard className="lg:col-span-2 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-bold">Health Trend</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Predicted</span>
              <Switch checked={showScenario} onCheckedChange={setShowScenario} />
            </div>
          </div>

          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={healthData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={10} />
                <YAxis domain={[0, 100]} hide />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0A0F1E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="score" stroke="#3B82F6" fillOpacity={1} fill="url(#colorScore)" strokeWidth={3} />
                {showScenario && (
                  <Area type="monotone" data={[...healthData, { name: 'Mar', score: 55 }, { name: 'Apr', score: 40 }]} dataKey="score" stroke="#EF4444" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                <TrendingUp className="w-3 h-3" />
              </div>
              <span className="text-[10px] text-gray-400">Trend: 12% Improved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500">
                <TrendingDown className="w-3 h-3" />
              </div>
              <span className="text-[10px] text-gray-400">Risk: +2 High Spends</span>
            </div>
          </div>
        </GlassCard>

        {/* Prescription Card */}
        {analysis?.prescription && (
          <GlassCard className="lg:col-span-4 p-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Sparkles className="w-32 h-32 text-primary" />
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
              <div className="md:w-1/3">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Brain className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-white">AI Prescription</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {analysis.scenario_if_no_action}
                </p>
                <Button className="mt-6 w-full bg-primary hover:bg-primary/90 text-white font-bold group">
                  Execute Recovery Plan
                  <Sparkles className="w-4 h-4 ml-2 group-hover:animate-spin" />
                </Button>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                {analysis.prescription.map((step: any, i: number) => (
                  <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-primary/30 transition-all group">
                    <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Phase 0{i + 1}</span>
                    <h4 className="text-white font-bold mt-1 mb-2 group-hover:text-primary transition-colors">{step.priority} Priority</h4>
                    <p className="text-gray-400 text-xs leading-relaxed mb-3">{step.action}</p>
                    <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-xs">
                      <DollarSign className="w-3 h-3" />
                      <span>Save ₹{step.monthly_saving}/mo</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
