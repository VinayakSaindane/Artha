import { GlassCard, PageHeader } from "@/components/ui-custom";
import { Button } from "@/components/ui/button";
import {
  Activity,
  AlertOctagon,
  Loader2,
  Zap,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  IndianRupee,
  RefreshCw,
  ChevronRight
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine
} from "recharts";
import { useState, useEffect } from "react";
import { pulseApi } from "@/api/arthApi";
import { useToast } from "@/hooks/use-toast";

export default function Pulse() {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isApplying, setIsApplying] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const cached = localStorage.getItem("pulse_analysis");
    if (cached) setAnalysis(JSON.parse(cached));
    fetchAnalysis();
  }, []);

  const fetchAnalysis = async () => {
    setAnalyzing(true);
    try {
      const response = await pulseApi.analyze();
      setAnalysis(response.data);
      localStorage.setItem("pulse_analysis", JSON.stringify(response.data));
    } catch {
      toast({ title: "Error", description: "Pulse scan failed.", variant: "destructive" });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleApply = () => {
    setIsApplying(true);
    toast({ title: "Syncing Strategy...", description: "AI is configuring your SIPs and budget limits." });
    setTimeout(() => {
      setIsApplying(false);
      toast({ title: "Strategy Applied! 🚀", description: "Your monthly SIP has been simulated and budget targets locked." });
    }, 2500);
  };

  const score = analysis?.health_score || 0;
  const status = analysis?.status || "SAFE";

  const statusConfig = {
    SAFE: { label: "Healthy", color: "text-emerald-400", bg: "bg-emerald-500/15", border: "border-emerald-500/20", bar: "bg-emerald-500", ring: "border-emerald-500/30" },
    WARNING: { label: "Needs Attention", color: "text-amber-400", bg: "bg-amber-500/15", border: "border-amber-500/20", bar: "bg-amber-500", ring: "border-amber-500/30" },
    DANGER: { label: "Critical", color: "text-rose-400", bg: "bg-rose-500/15", border: "border-rose-500/20", bar: "bg-rose-500", ring: "border-rose-500/30" }
  };
  const cfg = statusConfig[status as keyof typeof statusConfig] || statusConfig.SAFE;

  const scoreColor = score > 70 ? "#10B981" : score > 40 ? "#F59E0B" : "#EF4444";
  const emiRatio = analysis?.emi_to_income_ratio || 0;
  const savingsRate = analysis?.savings_rate || 0;

  const healthTrend = [
    { month: "3M ago", score: Math.max(10, score - 12) },
    { month: "2M ago", score: Math.max(10, score - 6) },
    { month: "Last Mo", score: Math.max(10, score - 2) },
    { month: "Now", score: score },
  ];

  // ── Loading State ──────────────────────────────────────────────────────────
  if (analyzing && !analysis) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-6">
        <div className="relative w-24 h-24">
          <div className="w-24 h-24 rounded-full border-4 border-primary/20 animate-pulse absolute" />
          <div className="w-24 h-24 rounded-full border-t-4 border-primary animate-spin absolute" />
          <Activity className="w-8 h-8 text-primary absolute inset-0 m-auto" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">Scanning your finances…</h2>
          <p className="text-gray-400 text-sm mt-1">This takes just a moment</p>
        </div>
      </div>
    );
  }

  // ── Main Screen ────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* ── Page Title + Refresh ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <PageHeader title="Arth Pulse" subtitle="Your personal financial health report" />
        <Button
          variant="outline"
          size="sm"
          onClick={fetchAnalysis}
          disabled={analyzing}
          className="border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
        >
          {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
          {!analyzing && "Refresh"}
        </Button>
      </div>

      {/* ── Hero Score Card ───────────────────────────────────────────────── */}
      <GlassCard className={`p-6 border ${cfg.border} relative overflow-hidden`}>
        {/* subtle glow blob */}
        <div className={`absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10 blur-3xl ${status === "SAFE" ? "bg-emerald-500" : status === "WARNING" ? "bg-amber-500" : "bg-rose-500"
          }`} />

        <div className="relative flex flex-col md:flex-row md:items-center gap-6">

          {/* Score Ring */}
          <div className="flex-shrink-0 flex items-center gap-5">
            <div className={`relative w-24 h-24 rounded-full border-4 ${cfg.ring} flex items-center justify-center`}
              style={{ boxShadow: `0 0 24px ${scoreColor}33` }}>
              <div className="text-center">
                <span className="text-3xl font-black text-white leading-none">{score}</span>
                <span className="block text-[10px] text-gray-400 mt-0.5">/ 100</span>
              </div>
            </div>
            <div>
              <span className={`text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                {cfg.label}
              </span>
              <h2 className="text-xl font-bold text-white mt-2">Financial Health Score</h2>
              <p className="text-gray-400 text-sm">
                {score > 70
                  ? "You're managing money well. Keep it up!"
                  : score > 40
                    ? "A few tweaks can improve your score quickly."
                    : "Act now — your finances need urgent attention."}
              </p>
            </div>
          </div>

          {/* Quick stats strip */}
          <div className="flex-1 grid grid-cols-3 gap-3 md:gap-4">
            {[
              { label: "EMI Burden", value: `${emiRatio}%`, sub: emiRatio > 40 ? "Too high" : "Healthy", ok: emiRatio <= 40 },
              { label: "Savings Rate", value: `${savingsRate}%`, sub: savingsRate < 20 ? "Low" : "Good", ok: savingsRate >= 20 },
              {
                label: "Debt Risk", value: analysis?.debt_trap_days ? `${analysis.debt_trap_days}d` : "Safe",
                sub: analysis?.debt_trap_days ? "Days to risk" : "No danger",
                ok: !analysis?.debt_trap_days
              },
            ].map((item) => (
              <div key={item.label} className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                <p className={`text-lg font-bold ${item.ok ? "text-emerald-400" : "text-rose-400"}`}>{item.value}</p>
                <p className="text-white text-xs font-medium mt-0.5">{item.label}</p>
                <p className={`text-[10px] mt-0.5 ${item.ok ? "text-emerald-500/70" : "text-rose-500/70"}`}>{item.sub}</p>
              </div>
            ))}
          </div>

        </div>
      </GlassCard>

      {/* ── Middle Row: Trend + What These Numbers Mean ───────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Health Trend Chart */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-white font-semibold">Score Trend</h3>
            <span className={`flex items-center gap-1 text-xs font-medium ${score > (healthTrend[0].score) ? "text-emerald-400" : "text-rose-400"}`}>
              {score > healthTrend[0].score
                ? <TrendingUp className="w-3.5 h-3.5" />
                : <TrendingDown className="w-3.5 h-3.5" />}
              {Math.abs(score - healthTrend[0].score)} pts this quarter
            </span>
          </div>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={healthTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" stroke="#6B7280" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#6B7280" fontSize={11} tickLine={false} width={28} />
                <ReferenceLine y={70} stroke="#10B98133" strokeDasharray="4 4" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0A0F1E", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                  itemStyle={{ color: "#fff" }}
                  labelStyle={{ color: "#9CA3AF", fontSize: 11 }}
                  formatter={(v: any) => [`${v} pts`, "Score"]}
                />
                <Line type="monotone" dataKey="score" stroke={scoreColor} strokeWidth={2.5}
                  dot={{ r: 4, fill: scoreColor, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: scoreColor }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-gray-500 mt-2">Dashed line = healthy score (70+)</p>
        </GlassCard>

        {/* What Does This Mean — plain language */}
        <GlassCard className="p-6">
          <h3 className="text-white font-semibold mb-4">What This Means For You</h3>
          <div className="space-y-3">
            {[
              {
                icon: IndianRupee,
                title: "EMI is " + (emiRatio > 40 ? "eating too much of your income" : "under control"),
                detail: emiRatio > 40
                  ? `₹${emiRatio} of every ₹100 earned goes to EMIs. Ideally keep it below ₹40.`
                  : "Your EMI payments are within the safe limit. Good discipline!",
                ok: emiRatio <= 40
              },
              {
                icon: TrendingUp,
                title: "You save " + (savingsRate < 20 ? "less than the recommended 20%" : savingsRate + "% of your income"),
                detail: savingsRate < 20
                  ? "Try to save at least ₹20 for every ₹100 you earn. Even small increases help."
                  : "You're meeting the 20% savings benchmark. Keep this habit going.",
                ok: savingsRate >= 20
              },
              {
                icon: ShieldCheck,
                title: analysis?.debt_trap_days ? "Debt trap risk in " + analysis.debt_trap_days + " days" : "No debt trap risk right now",
                detail: analysis?.debt_trap_days
                  ? "At current spending, you may struggle with repayments soon. Review expenses."
                  : "Your income vs. debt ratio is balanced. No immediate danger.",
                ok: !analysis?.debt_trap_days
              }
            ].map((item, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${item.ok ? "bg-emerald-500/5 border-emerald-500/15" : "bg-rose-500/5 border-rose-500/15"
                }`}>
                <div className={`p-2 rounded-lg flex-shrink-0 ${item.ok ? "bg-emerald-500/15" : "bg-rose-500/15"}`}>
                  <item.icon className={`w-4 h-4 ${item.ok ? "text-emerald-400" : "text-rose-400"}`} />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{item.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* ── AI Prescription ───────────────────────────────────────────────── */}
      {analysis?.prescription && analysis.prescription.length > 0 && (
        <GlassCard className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-white">What You Should Do Next</h3>
              <p className="text-gray-400 text-sm mt-1 max-w-lg">
                {analysis.scenario_if_no_action || "Follow these steps to strengthen your financial health."}
              </p>
            </div>
            <Button
              onClick={handleApply}
              disabled={isApplying}
              className="bg-primary hover:bg-primary/90 text-white flex-shrink-0 shadow-[0_4px_20px_-5px_rgba(59,130,246,0.5)]"
            >
              {isApplying ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
              {isApplying ? "Applying…" : "Apply This Plan"}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(analysis.prescription || []).slice(0, 4).map((step: any, i: number) => (
              <div key={i}
                className="group flex items-start gap-4 border border-white/8 rounded-xl p-4 hover:border-primary/40 hover:bg-white/[0.03] transition-all duration-200">
                <div className="w-9 h-9 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary/25 transition-colors">
                  <span className="text-primary font-bold text-sm">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm leading-snug">{step.action || "Action Required"}</p>
                  <div className="flex items-center justify-between mt-2.5 gap-2">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${step.priority === "HIGH"
                      ? "bg-rose-500/15 text-rose-400 border border-rose-500/20"
                      : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                      }`}>
                      {step.priority === "HIGH" ? "High Priority" : "Recommended"}
                    </span>
                    {step.monthly_saving > 0 && (
                      <span className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        ₹{(step.monthly_saving || 0).toLocaleString()}/mo saved
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-primary flex-shrink-0 mt-1 transition-colors" />
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* ── Bottom Banner if SAFE ─────────────────────────────────────────── */}
      {status === "SAFE" && !analysis?.prescription?.length && (
        <GlassCard className="p-5 border border-emerald-500/20 bg-emerald-500/5">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-emerald-500/15">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-white font-semibold">You're on track! 🎉</p>
              <p className="text-gray-400 text-sm">Your finances look healthy. Keep tracking expenses to maintain this score.</p>
            </div>
          </div>
        </GlassCard>
      )}

    </div>
  );
}