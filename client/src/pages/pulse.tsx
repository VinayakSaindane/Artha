import { GlassCard, PageHeader } from "@/components/ui-custom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Activity, AlertOctagon, TrendingUp, DollarSign, Loader2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from "recharts";
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
    { month: 'Sep', score: 85 },
    { month: 'Oct', score: 82 },
    { month: 'Nov', score: 78 },
    { month: 'Dec', score: 75 },
    { month: 'Jan', score: 74 },
    { month: 'Feb', score: analysis?.health_score || 72 },
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
        <GlassCard className={`lg:col-span-3 p-8 flex flex-col items-center justify-center text-center border-rose-500/30 bg-gradient-to-b ${analysis?.status === 'DANGER' ? 'from-rose-950/30' : analysis?.status === 'WARNING' ? 'from-amber-950/30' : 'from-emerald-950/30'
          } to-transparent`}>
          <h3 className="text-gray-400 font-medium tracking-widest uppercase mb-4">Debt Trap Forecast</h3>
          <div className="relative">
            <h1 className={`text-6xl md:text-8xl font-bold tracking-tighter tabular-nums ${analysis?.status === 'DANGER' ? 'text-rose-500' : analysis?.status === 'WARNING' ? 'text-amber-500' : 'text-emerald-500'
              }`}>
              {analysis?.debt_trap_days ? `${analysis.debt_trap_days} DAYS` : 'SAFE'}
            </h1>
            <p className="text-gray-400 mt-2 font-medium">Until you hit critical EMI ratio ({">"}50%)</p>
          </div>
        </GlassCard>

        <GlassCard className="p-6 space-y-4">
          <h3 className="text-white font-bold mb-4">Risk Indicators</h3>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">EMI Ratio</span>
              <span className={`${analysis?.emi_to_income_ratio > 40 ? 'text-rose-400' : 'text-emerald-400'} font-bold`}>
                {analysis?.emi_to_income_ratio}%
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className={`h-full ${analysis?.emi_to_income_ratio > 40 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${analysis?.emi_to_income_ratio}%` }}></div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Savings Rate</span>
              <span className={`${analysis?.savings_rate < 20 ? 'text-rose-400' : 'text-emerald-400'} font-bold`}>
                {analysis?.savings_rate}%
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className={`h-full ${analysis?.savings_rate < 20 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${analysis?.savings_rate}%` }}></div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Trend</span>
              <span className={`${analysis?.trend === 'DETERIORATING' ? 'text-rose-400' : 'text-emerald-400'} font-bold`}>
                {analysis?.trend}
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className={`h-full ${analysis?.trend === 'DETERIORATING' ? 'bg-rose-500' : 'bg-emerald-500'} w-full`}></div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-2 p-6">
          <h3 className="text-white font-bold mb-6">Health Trend (Last 6 Months)</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={healthTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis domain={[0, 100]} stroke="#6B7280" hide />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0A0F1E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="score" stroke={analysis?.status === 'DANGER' ? "#EF4444" : "#10B981"} strokeWidth={3} dot={{ fill: analysis?.status === 'DANGER' ? "#EF4444" : "#10B981" }} />
                {showScenario && (
                  <Line type="monotone" data={[...healthTrend, { month: 'Mar', score: 65 }, { month: 'Apr', score: 58 }]} dataKey="score" stroke="#EF4444" strokeWidth={3} strokeDasharray="5 5" />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-3 mt-4 justify-end">
            <span className="text-sm text-gray-400">Show "No Action" Scenario</span>
            <Switch checked={showScenario} onCheckedChange={setShowScenario} />
          </div>
        </GlassCard>

        {analysis?.prescription && (
          <GlassCard className="lg:col-span-3 p-6 border-l-4 border-l-emerald-500 bg-emerald-500/5">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="p-3 bg-emerald-500/20 rounded-full shrink-0">
                <AlertOctagon className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Immediate Action Plan</h3>
                <p className="text-gray-300 mb-4">{analysis.scenario_if_no_action}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {analysis.prescription.map((step: any, i: number) => (
                    <div key={i} className="bg-black/20 p-3 rounded-lg border border-white/5">
                      <p className="text-emerald-400 font-bold text-sm mb-1">Step {i + 1} ({step.priority})</p>
                      <p className="text-gray-300 text-sm">{step.action}</p>
                      <p className="text-xs text-emerald-500 mt-2">Saving: ₹{step.monthly_saving}</p>
                    </div>
                  ))}
                </div>
                <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white">Apply This Plan</Button>
              </div>
            </div>
          </GlassCard>
        )}

      </div>
    </div>
  );
}

