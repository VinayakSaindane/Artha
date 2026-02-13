import { GlassCard, PageHeader } from "@/components/ui-custom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useState, useEffect } from "react";
import { TrendingUp, School, Umbrella, Home, Loader2, Plus, Target } from "lucide-react";
import { goalsApi } from "@/api/arthApi";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Goals() {
  const [age, setAge] = useState([28]);
  const [retireAge, setRetireAge] = useState([55]);
  const [savings, setSavings] = useState(15000);
  const [planning, setPlanning] = useState(false);
  const [plan, setPlan] = useState<any>(null);
  const [goals, setGoals] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: "", target_amount: "", category: "Other", deadline: "" });
  const { toast } = useToast();

  const categoryIcons: any = {
    Education: School,
    Emergency: Umbrella,
    Housing: Home,
    Retirement: Target,
    Other: Target
  };

  const categoryColors: any = {
    Education: "border-l-blue-500",
    Emergency: "border-l-rose-500",
    Housing: "border-l-purple-500",
    Retirement: "border-l-emerald-500",
    Other: "border-l-gray-500"
  };

  const iconColors: any = {
    Education: "text-blue-500",
    Emergency: "text-rose-500",
    Housing: "text-purple-500",
    Retirement: "text-emerald-500",
    Other: "text-gray-500"
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await goalsApi.getGoals();
      setGoals(response.data);
    } catch (error) {
      console.error("Failed to fetch goals");
    }
  };

  const handleAddGoal = async () => {
    if (!newGoal.name || !newGoal.target_amount) return;
    try {
      await goalsApi.createGoal({
        ...newGoal,
        target_amount: parseFloat(newGoal.target_amount)
      });
      toast({ title: "Goal Set! 🎯", description: "Your new financial target has been saved." });
      setIsDialogOpen(false);
      setNewGoal({ name: "", target_amount: "", category: "Other", deadline: "" });
      fetchGoals();
    } catch (error) {
      toast({ title: "Error", description: "Failed to create goal.", variant: "destructive" });
    }
  };

  const handlePlan = async () => {
    setPlanning(true);
    try {
      const response = await goalsApi.plan({
        age: age[0],
        retirement_age: retireAge[0],
        income: 50000,
        current_savings: 500000,
        monthly_sip: savings,
        risk_appetite: "moderate"
      });
      setPlan(response.data);
      toast({
        title: "Strategy Generated",
        description: "Your personalized retirement plan is ready.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate retirement plan.",
        variant: "destructive",
      });
    } finally {
      setPlanning(false);
    }
  };

  const chartData = plan?.year_by_year_projection || [
    { year: '2025', corpus: 500000, age: age[0] },
    { year: '2030', corpus: 2500000, age: age[0] + 5 },
    { year: '2035', corpus: 6500000, age: age[0] + 10 },
    { year: '2040', corpus: 12000000, age: age[0] + 15 },
    { year: '2045', corpus: 21000000, age: age[0] + 20 },
    { year: '2050', corpus: 35000000, age: age[0] + 25 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader title="Goals & Planning" subtitle="Map out your financial journey to freedom" />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white">
              <Plus className="w-4 h-4 mr-2" /> Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0A0F1E] border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Set New Financial Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Goal Name</Label>
                <Input
                  placeholder="e.g. Dream House"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  className="bg-black/40 border-white/10 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Target Amount (₹)</Label>
                  <Input
                    type="number"
                    placeholder="2500000"
                    value={newGoal.target_amount}
                    onChange={(e) => setNewGoal({ ...newGoal, target_amount: e.target.value })}
                    className="bg-black/40 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={newGoal.category}
                    onValueChange={(val) => setNewGoal({ ...newGoal, category: val })}
                  >
                    <SelectTrigger className="bg-black/40 border-white/10 text-white">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0D1425] border-white/10 text-white">
                      {['Retirement', 'Education', 'Emergency', 'Housing', 'Other'].map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Target Date</Label>
                <Input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  className="bg-black/40 border-white/10 text-white"
                />
              </div>
              <Button onClick={handleAddGoal} className="w-full bg-primary mt-4">Save Goal</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard className="lg:col-span-1 p-6 space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between">
              <Label className="text-gray-400">Current Age</Label>
              <span className="text-white font-bold">{age[0]}</span>
            </div>
            <Slider value={age} max={80} min={18} step={1} onValueChange={setAge} />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <Label className="text-gray-400">Retirement Age</Label>
              <span className="text-white font-bold">{retireAge[0]}</span>
            </div>
            <Slider value={retireAge} max={80} min={40} step={1} onValueChange={setRetireAge} />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-400">Monthly SIP / Savings</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
              <Input
                className="pl-8 bg-black/20 border-white/10 text-white"
                type="number"
                value={savings}
                onChange={(e) => setSavings(Number(e.target.value))}
              />
            </div>
          </div>

          <Button
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]"
            onClick={handlePlan}
            disabled={planning}
          >
            {planning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {planning ? "Planning..." : "Generate AI Plan"}
          </Button>

          {plan && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <Target className="w-12 h-12" />
              </div>
              <div className="flex gap-3 relative z-10">
                <div className="p-2 bg-emerald-500/20 rounded-full h-fit">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-400 text-sm mb-1">AI Recommendation</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Target Corpus: ₹{((plan?.retirement_corpus_needed || 0) / 10000000).toFixed(1)}Cr.
                    Monthly SIP Needed: <span className="text-white font-bold">₹{(plan?.monthly_sip_needed || 0).toLocaleString()}</span>.
                  </p>
                </div>
              </div>
            </div>
          )}
        </GlassCard>

        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-lg font-bold text-white mb-6">Corpus Growth Projection</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`} />
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0A0F1E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: any) => [`₹${value.toLocaleString()}`, "Corpus"]}
                  />
                  <Area type="monotone" dataKey="corpus" stroke="#3B82F6" fillOpacity={1} fill="url(#colorAmount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {goals.length === 0 ? (
              <div className="col-span-3 h-32 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-white/5 rounded-2xl">
                <Target className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-sm">No custom goals set yet</p>
              </div>
            ) : (
              goals.map((g, i) => {
                const Icon = categoryIcons[g.category] || Target;
                return (
                  <GlassCard key={i} className={`p-4 flex flex-col justify-between min-h-[140px] border-l-4 ${categoryColors[g.category] || "border-l-gray-500"}`}>
                    <Icon className={`w-6 h-6 ${iconColors[g.category] || "text-gray-500"} mb-2`} />
                    <div>
                      <p className="text-sm text-gray-400 truncate">{g.name}</p>
                      <h4 className="text-xl font-bold text-white">₹{(g.target_amount / 100000).toFixed(1)}L</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {g.deadline ? `Target: ${new Date(g.deadline).getFullYear()}` : 'No deadline'}
                      </p>
                    </div>
                  </GlassCard>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
