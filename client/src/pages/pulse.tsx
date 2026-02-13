import { GlassCard, PageHeader } from "@/components/ui-custom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Activity, AlertOctagon, TrendingUp, DollarSign, Loader2, Sparkles, CheckCircle, Zap } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useState, useEffect } from "react";
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
    try {
      const response = await pulseApi.analyze();
      setAnalysis(response.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to analyze debt pulse.",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const healthTrend = [
    { month: 'Trending', score: analysis?.health_score || 70 },
    { month: 'Current', score: analysis?.health_score || 72 },
  ];

  if (analyzing && !analysis) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Heartbeat Header */}
      <div className="relative h-24 overflow-hidden rounded-xl bg-black/20 border border-white/5 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <svg className="w-full h-20 stroke-emerald-500/50" viewBox="0 0 1000 100" fill="none" preserveAspectRatio="none">
            <path d="M0,50 L200,50 L210,20 L220,80 L230,50 L400,50 L410,20 L420,80 L430,50 L600,50 L610,20 L620,80 L630,50 L1000,50" strokeWidth="2" className="animate-pulse" />
          </svg>
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <Activity className={`w-6 h-6 ${analysis?.status === 'DANGER' ? 'text-rose-500' : 'text-emerald-500'} animate-pulse`} />
          <h2 className="text-2xl font-bold text-white tracking-widest uppercase">
            {analysis?.status === 'SAFE' ? 'System Normal' : analysis?.status === 'WARNING' ? 'System Caution' : 'System Critical'}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Row 1: Three Equal Cards */}
        <GlassCard className={`p-8 flex flex-col items-center justify-center text-center border-rose-500/30 bg-gradient-to-b ${analysis?.status === 'DANGER' ? 'from-rose-950/30' :
            analysis?.status === 'WARNING' ? 'from-amber-950/30' : 'from-emerald-950/30'
          } to-transparent relative overflow-hidden min-h-[300px]`}>
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Sparkles className="w-16 h-16" />
          </div>
          <h3 className="text-gray-400 font-medium tracking-widest uppercase mb-4 text-xs">Debt Trap Forecast</h3>
          <div className="relative">
            <h1 className={`text-6xl md:text-7xl font-bold tracking-tighter tabular-nums ${analysis?.status === 'DANGER' ? 'text-rose-500' :
                analysis?.status === 'WARNING' ? 'text-amber-500' : 'text-emerald-500'
              }`}>
              {analysis?.debt_trap_days ? `${analysis.debt_trap_days} DAYS` : 'SAFE'}
            </h1>
            <p className="text-gray-500 mt-4 font-medium text-sm px-4">Until you hit critical EMI ratio (&gt;50%)</p>
          </div>
        </GlassCard>

        {/* Risk Indicators */}
        <GlassCard className="p-8 space-y-6 flex flex-col justify-center">
          <h3 className="text-white font-bold text-lg mb-2">Risk Indicators</h3>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400 font-medium">EMI Ratio</span>
              <span className={`${(analysis?.emi_to_income_ratio || 0) > 40 ? 'text-rose-400' : 'text-emerald-400'} font-bold`}>
                {analysis?.emi_to_income_ratio || 0}%
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className={`h-full ${(analysis?.emi_to_income_ratio || 0) > 40 ? 'bg-rose-500' : 'bg-emerald-500'} transition-all duration-1000`} style={{ width: `${analysis?.emi_to_income_ratio || 0}%` }}></div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400 font-medium">Savings Rate</span>
              <span className={`${(analysis?.savings_rate || 0) < 20 ? 'text-rose-400' : 'text-emerald-400'} font-bold`}>
                {analysis?.savings_rate || 0}%
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className={`h-full ${(analysis?.savings_rate || 0) < 20 ? 'bg-rose-500' : 'bg-emerald-500'} transition-all duration-1000`} style={{ width: `${analysis?.savings_rate || 0}%` }}></div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400 font-medium">Trend Status</span>
              <span className={`${analysis?.trend === 'DETERIORATING' ? 'text-rose-400' : 'text-emerald-400'} font-bold`}>
                {analysis?.trend || 'STABLE'}
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className={`h-full ${analysis?.trend === 'DETERIORATING' ? 'bg-rose-500' : 'bg-emerald-500'} w-full transition-all duration-1000`}></div>
            </div>
          </div>
        </GlassCard>

        {/* Health Trend Chart */}
        <GlassCard className="p-6 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-6 px-2">
            <h3 className="text-white font-bold text-lg">Health Trend</h3>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest">Predicted</span>
              <Switch checked={showScenario} onCheckedChange={setShowScenario} />
            </div>
          </div>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={healthTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="#6B7280" fontSize={10} />
                <YAxis domain={[0, 100]} stroke="#6B7280" hide />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0A0F1E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="score" stroke={analysis?.status === 'DANGER' ? "#EF4444" : "#10B981"} strokeWidth={4} dot={{ r: 6, fill: analysis?.status === 'DANGER' ? "#EF4444" : "#10B981" }} />
                {showScenario && (
                  <Line type="monotone" data={[...healthTrend, { month: 'Forecast', score: 45 }]} dataKey="score" stroke="#EF4444" strokeWidth={3} strokeDasharray="5 5" />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* AI Prescription - FULL WIDTH and Optimized */}
        {analysis?.prescription && (
          <GlassCard className="lg:col-span-3 p-8 md:p-12 border-l-8 border-l-emerald-500 bg-emerald-500/5 relative overflow-hidden mt-2">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <AlertOctagon className="w-48 h-48 text-emerald-500" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-10 relative z-10 items-stretch">
              {/* Left Info Column */}
              <div className="xl:col-span-1 flex flex-col h-full bg-black/20 p-8 rounded-3xl border border-white/5">
                <div className="p-4 bg-emerald-500/20 rounded-2xl w-fit mb-6">
                  <AlertOctagon className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Immediate Action Plan</h3>
                <p className="text-gray-400 leading-relaxed text-sm flex-1">
                  {analysis.scenario_if_no_action || "Your financial health is currently stable. Follow these AI-curated steps to further optimize your savings and bulletproof your future from debt traps."}
                </p>
                <Button className="mt-8 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 shadow-lg shadow-emerald-500/20">
                  <Zap className="w-4 h-4 mr-2" /> Apply Strategy
                </Button>
              </div>

              {/* Steps Grid Column */}
              <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                {(analysis.prescription || []).map((step: any, i: number) => (
                  <div key={i} className="bg-black/30 p-8 rounded-3xl border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between group overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
                      <CheckCircle className="w-16 h-16 text-emerald-500" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-emerald-400 font-bold text-[10px] tracking-[0.2em] uppercase bg-emerald-500/10 px-3 py-1 rounded-full">Step 0{i + 1}</span>
                        <span className={cn(
                          "text-[10px] font-bold uppercase tracking-widest border px-3 py-1 rounded-full",
                          step.priority === 'HIGH' ? "text-rose-400 border-rose-500/30 bg-rose-500/5" : "text-emerald-400 border-emerald-500/30 bg-emerald-500/5"
                        )}>
                          {step.priority}
                        </span>
                      </div>
                      <h4 className="text-white font-bold text-lg mb-4 leading-snug group-hover:text-emerald-400 transition-colors">Action Required</h4>
                      <p className="text-gray-300 text-sm leading-relaxed mb-6">{step.action}</p>
                    </div>

                    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <DollarSign className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 font-bold uppercase">Monthly Save</p>
                          <p className="text-emerald-400 font-bold text-lg">₹{step.monthly_saving.toLocaleString()}</p>
                        </div>
                      </div>
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
