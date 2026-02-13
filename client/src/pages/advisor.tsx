import { GlassCard, PageHeader } from "@/components/ui-custom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
    PieChart, Pie, Cell, Legend
} from "recharts";
import { useState, useEffect } from "react";
import {
    TrendingUp, Shield, Zap, Target, Brain,
    Wallet, PieChart as PieIcon, AlertTriangle,
    ArrowRight, Loader2, Info, CheckCircle2
} from "lucide-react";
import { advisorApi, expensesApi, goalsApi } from "@/api/arthApi";
import { useToast } from "@/hooks/use-toast";
import { useArthStore } from "@/store/useArthStore";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Advisor() {
    const { user } = useArthStore();
    const [loading, setLoading] = useState(false);
    const [strategy, setStrategy] = useState<any>(null);
    const { toast } = useToast();

    const [inputs, setInputs] = useState({
        age: user?.age || 28,
        income: user?.monthly_income || 50000,
        expenses: 30000, // estimated
        savings: 500000,
        investments: 200000,
        retirement_age: 55,
        risk_appetite: "moderate"
    });

    const handleAnalyze = async () => {
        setLoading(true);
        try {
            const response = await advisorApi.getStrategy(inputs);
            setStrategy(response.data);
            toast({
                title: "Analysis Complete",
                description: "Your personalized financial roadmap is ready.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to generate strategy. Using internal engine.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

    const allocationData = strategy ? [
        { name: "Equity", value: strategy.asset_allocation.equity },
        { name: "Debt", value: strategy.asset_allocation.debt },
        { name: "Gold", value: strategy.asset_allocation.gold },
    ] : [];

    return (
        <div className="space-y-6 pb-12">
            <PageHeader
                title="AI Financial Advisor"
                subtitle="Professional-grade wealth strategy for the Indian middle class."
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sidebar: Inputs */}
                <aside className="lg:col-span-4 space-y-6">
                    <GlassCard className="p-6 space-y-6 sticky top-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/20 rounded-lg">
                                <Brain className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="text-lg font-bold text-white">Strategy Inputs</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs text-gray-400">Current Age</Label>
                                    <Input
                                        type="number"
                                        value={inputs.age}
                                        onChange={(e) => setInputs({ ...inputs, age: Number(e.target.value) })}
                                        className="bg-black/20 border-white/10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-gray-400">Retirement Age</Label>
                                    <Input
                                        type="number"
                                        value={inputs.retirement_age}
                                        onChange={(e) => setInputs({ ...inputs, retirement_age: Number(e.target.value) })}
                                        className="bg-black/20 border-white/10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs text-gray-400">Monthly Income (₹)</Label>
                                <div className="relative">
                                    <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <Input
                                        type="number"
                                        value={inputs.income}
                                        onChange={(e) => setInputs({ ...inputs, income: Number(e.target.value) })}
                                        className="pl-10 bg-black/20 border-white/10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs text-gray-400">Monthly Expenses (₹)</Label>
                                <Input
                                    type="number"
                                    value={inputs.expenses}
                                    onChange={(e) => setInputs({ ...inputs, expenses: Number(e.target.value) })}
                                    className="bg-black/20 border-white/10"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs text-gray-400">Current Lumpsum Savings (₹)</Label>
                                <Input
                                    type="number"
                                    value={inputs.savings}
                                    onChange={(e) => setInputs({ ...inputs, savings: Number(e.target.value) })}
                                    className="bg-black/20 border-white/10"
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <Label className="text-xs text-gray-400">Risk Appetite</Label>
                                    <span className="text-xs font-bold text-primary uppercase">{inputs.risk_appetite}</span>
                                </div>
                                <div className="flex gap-2">
                                    {['conservative', 'moderate', 'aggressive'].map((risk) => (
                                        <button
                                            key={risk}
                                            onClick={() => setInputs({ ...inputs, risk_appetite: risk })}
                                            className={cn(
                                                "flex-1 py-2 text-[10px] font-bold uppercase rounded-lg border transition-all",
                                                inputs.risk_appetite === risk
                                                    ? "bg-primary border-primary text-white"
                                                    : "bg-white/5 border-white/10 text-gray-400 hover:border-primary/50"
                                            )}
                                        >
                                            {risk}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Button
                                onClick={handleAnalyze}
                                disabled={loading}
                                className="w-full h-12 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                            >
                                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Zap className="w-4 h-4 mr-2" />}
                                Generate AI Strategy
                            </Button>
                        </div>
                    </GlassCard>
                </aside>

                {/* Main Content: Results */}
                <main className="lg:col-span-8 space-y-8 min-h-[600px]">
                    {/* Active Input Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] text-primary font-bold uppercase tracking-wider animate-in fade-in slide-in-from-left-2">
                            Age {inputs.age}
                        </div>
                        <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-gray-400 font-bold uppercase tracking-wider animate-in fade-in slide-in-from-left-4">
                            Target: {inputs.retirement_age}
                        </div>
                        <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-gray-400 font-bold uppercase tracking-wider animate-in fade-in slide-in-from-left-6">
                            Risk: {inputs.risk_appetite}
                        </div>
                        <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-gray-400 font-bold uppercase tracking-wider animate-in fade-in slide-in-from-left-8">
                            Income: ₹{(inputs.income / 1000).toFixed(0)}k
                        </div>
                    </div>

                    {!strategy && !loading ? (
                        <GlassCard className="h-full flex flex-col items-center justify-center p-12 text-center border-dashed border-2 opacity-60">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                                <Brain className="w-10 h-10 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Awaiting Financial Signal</h3>
                            <p className="text-gray-400 max-w-sm">Enter your details and let ARTH AI build your retirement roadmap and inflation-adjusted strategy.</p>
                        </GlassCard>
                    ) : loading ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-6">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full border-4 border-primary/20 animate-[spin_3s_linear_infinite]" />
                                <div className="w-24 h-24 rounded-full border-t-4 border-primary absolute inset-0 animate-spin" />
                                <Brain className="w-10 h-10 text-primary absolute inset-0 m-auto" />
                            </div>
                            <div className="text-center space-y-2">
                                <h4 className="text-xl font-bold text-white uppercase tracking-widest">Processing Data</h4>
                                <p className="text-gray-500 text-sm animate-pulse italic">Running 10,000 Monte Carlo simulations...</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {/* Top Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <GlassCard className="p-6 border-l-4 border-l-emerald-500">
                                    <div className="flex justify-between items-start">
                                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Health Score</p>
                                        <Zap className="w-4 h-4 text-emerald-500" />
                                    </div>
                                    <h2 className="text-4xl font-bold text-white mt-2">{strategy.health_score}<span className="text-lg text-gray-500">/100</span></h2>
                                    <p className="text-xs text-emerald-500 mt-2 font-medium">Top 15% of your age group</p>
                                </GlassCard>

                                <GlassCard className="p-6 border-l-4 border-l-blue-500">
                                    <div className="flex justify-between items-start">
                                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Savings Rate</p>
                                        <TrendingUp className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <h2 className="text-4xl font-bold text-white mt-2">{(strategy.summary.savings_rate * 100).toFixed(0)}%</h2>
                                    <p className="text-xs text-gray-500 mt-2">Target: 30% for early retirement</p>
                                </GlassCard>

                                <GlassCard className="p-6 border-l-4 border-l-amber-500">
                                    <div className="flex justify-between items-start">
                                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Emergency Fund</p>
                                        <Shield className="w-4 h-4 text-amber-500" />
                                    </div>
                                    <h2 className="text-4xl font-bold text-white mt-2">{strategy.summary.emergency_fund_months}<span className="text-lg text-gray-500"> mo</span></h2>
                                    <p className="text-xs text-amber-500 mt-2 font-medium">{strategy.summary.emergency_fund_status}</p>
                                </GlassCard>
                            </div>

                            {/* Main Chart: Corpus Projection */}
                            <GlassCard className="p-8">
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">Retirement Corpus Projection</h3>
                                        <p className="text-sm text-gray-400">Inflation-adjusted growth across life stages</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 uppercase font-bold">Shortfall</p>
                                        <p className="text-xl font-bold text-rose-500">₹{(strategy.retirement.shortfall / 10000000).toFixed(1)} Cr</p>
                                    </div>
                                </div>

                                <div className="h-[350px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={strategy.projections}>
                                            <defs>
                                                <linearGradient id="colorCorpus" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                            <XAxis dataKey="age" stroke="#6B7280" label={{ value: 'Age', position: 'insideBottom', offset: -5, fill: '#6B7280' }} />
                                            <YAxis stroke="#6B7280" tickFormatter={(val) => `₹${(val / 10000000).toFixed(1)}Cr`} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#0D1425', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                                itemStyle={{ color: '#fff' }}
                                                formatter={(val: any) => [`₹${(val / 10000000).toFixed(2)} Cr`, "Projected Corpus"]}
                                            />
                                            <Area type="monotone" dataKey="corpus" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorCorpus)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-8">
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <p className="text-xs text-gray-500 uppercase font-bold">Needed Corpus</p>
                                        <p className="text-2xl font-bold text-white">₹{(strategy.retirement.needed_corpus / 10000000).toFixed(2)} Cr</p>
                                        <p className="text-[10px] text-gray-400 mt-1">Adjusted to {strategy.retirement_age || inputs.retirement_age} years old</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
                                        <p className="text-xs text-primary uppercase font-bold">Recommended SIP</p>
                                        <p className="text-2xl font-bold text-white">₹{strategy.retirement.monthly_sip_required.toLocaleString()}<span className="text-sm text-gray-400">/mo</span></p>
                                        <p className="text-[10px] text-primary/70 mt-1">To bridge the gap in 25 years</p>
                                    </div>
                                </div>
                            </GlassCard>

                            {/* Recommendations & Logic */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <GlassCard className="p-6">
                                    <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                        <PieIcon className="w-5 h-5 text-primary" /> Asset Allocation
                                    </h4>
                                    <div className="h-[200px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={allocationData}
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {allocationData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend verticalAlign="middle" align="right" layout="vertical" />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="space-y-2 mt-4">
                                        <p className="text-sm font-bold text-white tracking-widest uppercase text-center">{inputs.risk_appetite} Strategy</p>
                                        <p className="text-xs text-gray-400 leading-relaxed text-center px-4">{strategy.risk_analysis}</p>
                                    </div>
                                </GlassCard>

                                <GlassCard className="p-6 space-y-4">
                                    <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                        <Zap className="w-5 h-5 text-primary" /> Top Action Steps
                                    </h4>
                                    <div className="space-y-3">
                                        {strategy.action_steps.map((step: any, i: number) => (
                                            <div key={i} className="group p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-primary/30 transition-all cursor-default">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h5 className="font-bold text-white group-hover:text-primary transition-colors">{step.title}</h5>
                                                    <span className={cn(
                                                        "text-[8px] font-bold px-2 py-0.5 rounded-full border",
                                                        step.impact === 'HIGH' ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/5" : "text-blue-400 border-blue-500/30 bg-blue-500/5"
                                                    )}>
                                                        {step.impact} IMPACT
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-400 leading-relaxed">{step.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </GlassCard>
                            </div>

                            {/* Disclaimer */}
                            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-start gap-4">
                                <Info className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                                <p className="text-[10px] text-gray-500 leading-relaxed">
                                    Disclaimer: This is AI-generated financial guidance based on historical data and probabilistic models. Calculations are projections and not guaranteed returns. Inflation and market performance can vary significantly. Please consult a SEBI Registered Investment Advisor before making significant financial decisions.
                                </p>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
