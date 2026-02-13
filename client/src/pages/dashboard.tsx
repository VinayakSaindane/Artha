import { GlassCard, StatCard, PageHeader } from "@/components/ui-custom";
import {
  Plus,
  ScanLine,
  CreditCard,
  Wallet,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Coffee,
  ShoppingBag,
  Car,
  Home,
  Activity,
  Loader2,
  Sparkles
} from "lucide-react";
import { Link } from "wouter";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useArthStore } from "@/store/useArthStore";
import { useState, useEffect } from "react";
import { expensesApi, pulseApi, festivalApi } from "@/api/arthApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { user } = useArthStore();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [pulse, setPulse] = useState<any>(null);
  const [recentExpenses, setRecentExpenses] = useState<any[]>([]);
  const [festivals, setFestivals] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({ amount: "", category: "Food", description: "" });
  const { toast } = useToast();

  const CATEGORY_COLORS: any = {
    Food: "#3B82F6",
    Transport: "#10B981",
    EMI: "#F59E0B",
    Health: "#EF4444",
    Fun: "#8B5CF6",
    Other: "#6B7280"
  };

  const categoryIcons: any = {
    Food: Coffee,
    Transport: Car,
    Essentials: ShoppingBag,
    Housing: Home,
    EMI: CreditCard,
    Other: Wallet
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    // Stage 1: Fast Load
    try {
      const expensesRes = await expensesApi.getExpenses();
      setRecentExpenses(expensesRes.data.slice(0, 4));

      // Calculate initial stats early
      const initialTotal = expensesRes.data.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);
      setStats({
        income: user?.monthly_income || 50000,
        expenses: initialTotal,
        savings: (user?.monthly_income || 50000) - initialTotal
      });
    } catch (e) {
      console.warn("Initial Load Error", e);
      // Fallback stats if expenses fail
      setStats({
        income: user?.monthly_income || 50000,
        expenses: 0,
        savings: user?.monthly_income || 50000
      });
    }

    // Stage 2: Secondary Loads (AI and Summary)
    Promise.allSettled([
      expensesApi.getSummary(),
      pulseApi.analyze(),
      festivalApi.getFestivals()
    ]).then((results: any[]) => {
      const [summaryRes, pulseRes, festivalRes] = results;

      if (summaryRes.status === 'fulfilled') {
        const total = summaryRes.value.data.reduce((acc: number, curr: any) => acc + curr.total_amount, 0);
        setStats((prev: any) => ({ ...prev, expenses: total, savings: (prev?.income || 50000) - total }));
      }

      if (pulseRes.status === 'fulfilled') {
        setPulse(pulseRes.value.data);
      }

      if (festivalRes.status === 'fulfilled') {
        setFestivals(festivalRes.value.data);
      }
    }).finally(() => {
      setLoading(false);
    });

    // Safety timeout to ensure loader disappears
    setTimeout(() => setLoading(false), 3000);
  };

  const handleAddExpense = async () => {
    if (!newExpense.amount) return;
    try {
      await expensesApi.createExpense({
        ...newExpense,
        amount: parseFloat(newExpense.amount)
      });
      toast({ title: "Expense Added", description: "Your expense has been logged." });
      setIsDialogOpen(false);
      setNewExpense({ amount: "", category: "Food", description: "" });
      fetchData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to add expense.", variant: "destructive" });
    }
  };

  const healthScore = pulse?.health_score || 0;
  const healthData = [
    { name: "Score", value: healthScore },
    { name: "Remaining", value: 100 - healthScore }
  ];

  if (loading && !stats) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Namaste, {user?.name || 'User'} 👋</h1>
          <p className="text-gray-400 mt-1">Here's what's happening with your money today.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-white shadow-[0_4px_20px_-5px_rgba(59,130,246,0.5)]">
                <Plus className="w-4 h-4 mr-2" /> Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0A0F1E] border-white/10 text-white">
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Amount (₹)</Label>
                  <Input
                    type="number"
                    placeholder="500"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    className="bg-black/40 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={newExpense.category}
                    onValueChange={(val) => setNewExpense({ ...newExpense, category: val })}
                  >
                    <SelectTrigger className="bg-black/40 border-white/10">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0D1425] border-white/10 text-white">
                      {Object.keys(CATEGORY_COLORS).map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    placeholder="e.g. Dinner"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    className="bg-black/40 border-white/10"
                  />
                </div>
                <Button onClick={handleAddExpense} className="w-full bg-primary">Save Expense</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Link href="/shield">
            <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
              <ScanLine className="w-4 h-4 mr-2" /> Scan Agreement
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monthly Income"
          value={`₹${(stats?.income || 0).toLocaleString()}`}
          icon={Wallet}
          trend="+0%"
          trendUp={true}
        />
        <StatCard
          title="Expenses"
          value={`₹${(stats?.expenses || 0).toLocaleString()}`}
          icon={TrendingDown}
          trend="Current"
          trendUp={true}
        />
        <StatCard
          title="Savings"
          value={`₹${(stats?.savings || 0).toLocaleString()}`}
          icon={TrendingUp}
          subtext={`Target: ₹${((stats?.income || 45000) * 0.2).toLocaleString()}`}
        />
        <StatCard
          title="Debt Risk"
          value={pulse?.status || "Low"}
          icon={AlertTriangle}
          trend={pulse?.trend || "Safe"}
          trendUp={pulse?.trend === 'IMPROVING'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="col-span-1 p-6 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-50">
            <Activity className="w-6 h-6 text-emerald-400" />
          </div>
          <h3 className="text-lg font-medium text-white mb-6">Financial Health</h3>
          <div className="relative w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={healthData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  startAngle={180}
                  endAngle={0}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell key="score" fill={healthScore > 70 ? "#10B981" : healthScore > 40 ? "#F59E0B" : "#EF4444"} />
                  <Cell key="remaining" fill="rgba(255,255,255,0.1)" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center -mt-8">
              <span className="text-4xl font-bold text-white">{healthScore}</span>
              <span className={`text-xs ${healthScore > 70 ? 'text-emerald-400' : healthScore > 40 ? 'text-amber-400' : 'text-rose-400'}`}>
                {healthScore > 70 ? 'Excellent' : healthScore > 40 ? 'Moderate' : 'Critical'}
              </span>
            </div>
          </div>
          <p className="text-center text-sm text-gray-400 mt-[-20px]">
            {healthScore > 70 ? "You're doing better than 82% of peers. Keep it up!" : "Consider checking the Pulse section for improvement tips."}
          </p>
        </GlassCard>

        <GlassCard className="col-span-1 lg:col-span-2 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-white">Recent Transactions</h3>
            <Link href="/track">
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 p-0 h-auto">View All</Button>
            </Link>
          </div>
          <div className="space-y-4">
            {recentExpenses.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-gray-500">
                <Wallet className="w-12 h-12 mb-2 opacity-20" />
                <p>No recent expenses found</p>
              </div>
            ) : (
              recentExpenses.map((t) => {
                const Icon = categoryIcons[t.category] || categoryIcons.Other;
                return (
                  <div key={t._id || t.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-white/5 border border-white/5 text-gray-300">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{t.description || t.category}</p>
                        <p className="text-xs text-gray-400">{t.category} • {new Date(t.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className="font-medium text-white">-₹{t.amount.toLocaleString()}</span>
                  </div>
                );
              })
            )}
          </div>
        </GlassCard>

        {pulse && pulse.status !== 'SAFE' && (
          <div className="col-span-1 lg:col-span-3">
            <div className={`${pulse.status === 'DANGER' ? 'bg-rose-500/10 border-rose-500/20' : 'bg-amber-500/10 border-amber-500/20'} border rounded-xl p-4 flex items-center gap-4`}>
              <div className={`p-2 rounded-full ${pulse.status === 'DANGER' ? 'bg-rose-500/20 text-rose-500' : 'bg-amber-500/20 text-amber-500'}`}>
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className={`font-bold ${pulse.status === 'DANGER' ? 'text-rose-500' : 'text-amber-500'}`}>Arth Pulse Alert</h4>
                <p className={`${pulse.status === 'DANGER' ? 'text-rose-200/80' : 'text-amber-200/80'} text-sm`}>
                  ⚠️ {pulse.scenario_if_no_action} <Link href="/pulse" className="underline font-bold">Check Analysis</Link>
                </p>
              </div>
            </div>
          </div>
        )}

        {festivals.length > 0 && (
          <div className="col-span-1 lg:col-span-3">
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center gap-4">
              <div className="p-2 rounded-full bg-primary/20 text-primary">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white">Festival Debt Shield Active: {festivals[0].name}</h4>
                <p className="text-gray-400 text-sm">
                  You have {Math.ceil((new Date(festivals[0].date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days to reach your goal. <Link href="/festival-shield" className="text-primary underline font-bold">See Strategy</Link>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
