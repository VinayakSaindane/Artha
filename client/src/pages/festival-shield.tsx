import { GlassCard, PageHeader } from "@/components/ui-custom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Gift, AlertCircle, TrendingUp, Calendar, Zap, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { festivalApi } from "@/api/arthApi";
import { useToast } from "@/hooks/use-toast";
import { useArthStore } from "@/store/useArthStore";

export default function FestivalShield() {
    const { user } = useArthStore();
    const [festivalName, setFestivalName] = useState("");
    const [festivalDate, setFestivalDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState<any>(null);
    const { toast } = useToast();

    const handlePlan = async () => {
        if (!festivalName || !festivalDate) {
            toast({ title: "Error", description: "Please enter festival details.", variant: "destructive" });
            return;
        }
        setLoading(true);
        try {
            const response = await festivalApi.plan({ name: festivalName, date: festivalDate });
            setAnalysis(response.data.analysis);
            toast({ title: "Shield Activated! 🛡️", description: "Your savings strategy is ready." });
        } catch (error) {
            toast({ title: "Error", description: "Failed to generate strategy.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Festival Debt Shield™️"
                subtitle="AI-powered cultural debt prevention. Predict spikes, plan savings, and stay debt-free."
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <GlassCard className="p-8 border-primary/20 bg-primary/5">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Sparkles className="text-primary w-5 h-5" /> Shield Setup
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-gray-400">Festival / Occasion Name</Label>
                                <Input
                                    placeholder="e.g., Diwali 2026, Wedding Season"
                                    className="bg-black/20 border-white/10 text-white"
                                    value={festivalName}
                                    onChange={(e) => setFestivalName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-400">Festival Date</Label>
                                <Input
                                    type="date"
                                    className="bg-black/20 border-white/10 text-white"
                                    value={festivalDate}
                                    onChange={(e) => setFestivalDate(e.target.value)}
                                />
                            </div>
                            <Button
                                onClick={handlePlan}
                                disabled={loading}
                                className="w-full bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]"
                            >
                                {loading ? <Loader2 className="animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
                                Activate AI Shield
                            </Button>
                        </div>
                    </GlassCard>

                    {!analysis && (
                        <div className="p-6 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
                            <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                <Gift className="text-emerald-400 w-5 h-5" /> Why use Shield?
                            </h4>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Indian households spend <span className="text-emerald-400 font-bold">2.4x more</span> during festivals. Most of this ends up on high-interest credit card debt. ARTH predicts this spike and helps you save ₹95-200 per day early so you don't need a loan.
                            </p>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    {!analysis ? (
                        <GlassCard className="h-full flex flex-col items-center justify-center p-12 text-center opacity-30 border-dashed border-2">
                            <AlertCircle className="w-16 h-16 text-gray-600 mb-4" />
                            <h3 className="text-xl font-bold text-gray-500">Awaiting Signal...</h3>
                            <p className="text-gray-600 mt-2">Activate the shield to see your personalized preventive strategy</p>
                        </GlassCard>
                    ) : (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <GlassCard className="p-6 border-l-4 border-l-primary bg-primary/5">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="text-xs font-bold text-primary uppercase tracking-widest">Detected Pattern</span>
                                        <h3 className="text-2xl font-bold text-white mt-1">{analysis.detected_spike_pattern}</h3>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs text-gray-400 uppercase">Est. Extra Spending</span>
                                        <p className="text-xl font-bold text-rose-500">₹{analysis.estimated_extra_spending.toLocaleString()}</p>
                                    </div>
                                </div>
                                <p className="text-gray-400 text-sm">{analysis.debt_warning}</p>
                            </GlassCard>

                            <div className="grid grid-cols-2 gap-4">
                                <GlassCard className="p-4 text-center">
                                    <p className="text-xs text-gray-400 uppercase">Daily Savings Target</p>
                                    <p className="text-3xl font-bold text-emerald-400 mt-2">₹{analysis.savings_plan.daily_target}</p>
                                    <p className="text-[10px] text-gray-500 mt-1">For {analysis.savings_plan.days_remaining} days</p>
                                </GlassCard>
                                <GlassCard className="p-4 text-center">
                                    <p className="text-xs text-gray-400 uppercase">Total Shield Target</p>
                                    <p className="text-3xl font-bold text-white mt-2">₹{analysis.savings_plan.total_target.toLocaleString()}</p>
                                    <p className="text-[10px] text-gray-500 mt-1">100% Debt avoidance</p>
                                </GlassCard>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-white flex items-center gap-2 ml-1">
                                    <TrendingUp className="w-4 h-4 text-primary" /> AI Guilt-Free Tips
                                </h4>
                                {analysis.actionable_tips.map((tip: string, i: number) => (
                                    <div key={i} className="flex gap-4 p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
                                            {i + 1}
                                        </div>
                                        <p className="text-sm text-gray-300">{tip}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center gap-3">
                                <Calendar className="text-indigo-400 w-5 h-5 shrink-0" />
                                <p className="text-xs text-gray-400">
                                    We'll send you a nudge every morning at 9 AM to track your daily ₹{analysis.savings_plan.daily_target} shield.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
