import { GlassCard, PageHeader } from "@/components/ui-custom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Search, Filter, TrendingUp, Loader2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useState, useEffect } from "react";
import { expensesApi, limitsApi } from "@/api/arthApi";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useArthStore } from "@/store/useArthStore";
import { Settings2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Track() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [summary, setSummary] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newExpense, setNewExpense] = useState({ amount: "", category: "Food", description: "" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLimitsOpen, setIsLimitsOpen] = useState(false);
  const [categoryLimits, setCategoryLimits] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [expensesRes, summaryRes, limitsRes] = await Promise.all([
        expensesApi.getExpenses(),
        expensesApi.getSummary(),
        limitsApi.getLimits()
      ]);
      setExpenses(expensesRes.data);
      setSummary(summaryRes.data);
      setCategoryLimits(limitsRes.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch expense data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLimits = async (cat: string, amount: string) => {
    try {
      const newLimits = { ...categoryLimits, [cat]: parseFloat(amount) };
      await limitsApi.setLimits(newLimits);
      setCategoryLimits(newLimits);
      toast({ title: "Limit Updated", description: `${cat} limit set to ₹${amount}` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update limit.", variant: "destructive" });
    }
  };

  const handleVoiceAdd = () => {
    setIsVoiceActive(true);
    toast({ title: "Listening...", description: "Say something like 'Spent 500 on dinner'" });
    setTimeout(() => {
      setIsVoiceActive(false);
      toast({ title: "AI Voice Sync Success", description: "Added ₹500 for Dinner to Food category." });
      // In a real app, we'd send the audio/transcript to AI
      expensesApi.createExpense({ amount: 500, category: "Food", description: "Voice Add: Dinner" }).then(() => fetchData());
    }, 3000);
  };

  const filteredExpenses = expenses.filter(e => {
    const matchesSearch = e.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || e.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddExpense = async () => {
    if (!newExpense.amount) return;
    try {
      const amount = parseFloat(newExpense.amount);
      await expensesApi.createExpense({
        ...newExpense,
        amount
      });

      const categoryTotal = summary.find(s => s.category === newExpense.category)?.total_amount || 0;
      const limit = categoryLimits[newExpense.category];

      if (limit && (categoryTotal + amount) > limit) {
        toast({
          title: "Limit Exceeded! ⚠️",
          description: `You've cross your ₹${limit} limit for ${newExpense.category}.`,
          variant: "destructive"
        });
      } else {
        toast({ title: "Expense Added", description: "Your expense has been logged." });
      }

      setIsDialogOpen(false);
      setNewExpense({ amount: "", category: "Food", description: "" });
      fetchData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to add expense.", variant: "destructive" });
    }
  };

  const CATEGORY_COLORS: any = {
    Food: "#3B82F6",
    Transport: "#10B981",
    EMI: "#F59E0B",
    Health: "#EF4444",
    Fun: "#8B5CF6",
    Other: "#6B7280"
  };

  const pieData = summary.map(s => ({
    name: s.category,
    value: s.total_amount,
    color: CATEGORY_COLORS[s.category] || CATEGORY_COLORS.Other
  }));

  const { user } = useArthStore();
  const income = user?.monthly_income || 50000;

  const budgetData = summary.map(s => {
    // Basic 50/30/20 rule inspired logic as fallback
    let budgetFactor = 0.1;
    if (s.category === 'Food') budgetFactor = 0.15;
    if (s.category === 'Transport') budgetFactor = 0.05;
    if (s.category === 'EMI') budgetFactor = 0.35;

    const fallbackLimit = income * budgetFactor;
    const userLimit = categoryLimits[s.category];

    return {
      category: s.category,
      budget: userLimit || fallbackLimit,
      actual: s.total_amount
    };
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Expense Tracker" subtitle="Monitor your spending patterns in real-time" />

      <GlassCard className="p-4 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-[300px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              className="pl-9 bg-black/20 border-white/10 text-white placeholder:text-gray-500"
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40 bg-black/20 border-white/10 text-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-[#0D1425] border-white/10 text-white">
              <SelectItem value="All">All Categories</SelectItem>
              {Object.keys(CATEGORY_COLORS).map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            className={cn("bg-white/10 hover:bg-white/20 text-white border border-white/10", isVoiceActive && "animate-pulse border-primary")}
            onClick={handleVoiceAdd}
          >
            <Mic className={cn("w-4 h-4 mr-2", isVoiceActive && "text-primary")} /> {isVoiceActive ? "Listening..." : "Voice Add"}
          </Button>

          <Dialog open={isLimitsOpen} onOpenChange={setIsLimitsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-white/10 text-gray-300">
                <Settings2 className="w-4 h-4 mr-2" /> Manage Limits
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0A0F1E] border-white/10 text-white max-w-md">
              <DialogHeader>
                <DialogTitle>Category Expenditure Limits</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                {Object.keys(CATEGORY_COLORS).map(cat => (
                  <div key={cat} className="flex items-center justify-between gap-4 p-3 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat] }} />
                      <span className="text-sm font-medium">{cat}</span>
                    </div>
                    <div className="relative w-32">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-500">₹</span>
                      <Input
                        type="number"
                        placeholder="Limit"
                        defaultValue={categoryLimits[cat] || Math.round(income * (cat === 'EMI' ? 0.35 : cat === 'Food' ? 0.15 : 0.1))}
                        className="h-8 pl-5 bg-black/40 border-white/10 text-xs"
                        onBlur={(e) => handleUpdateLimits(cat, e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Button onClick={() => setIsLimitsOpen(false)} className="w-full bg-primary mt-2">Finish Setup</Button>
            </DialogContent>
          </Dialog>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-white">
                + Add Expense
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
                    placeholder="e.g. Dinner at Taj"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    className="bg-black/40 border-white/10"
                  />
                </div>
                <Button onClick={handleAddExpense} className="w-full bg-primary">Save Expense</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </GlassCard>

      {loading ? (
        <div className="h-96 flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard className="p-6">
            <h3 className="text-lg font-bold text-white mb-6">Monthly Breakdown</h3>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData.length > 0 ? pieData : [{ name: "No Data", value: 1, color: "rgba(255,255,255,0.05)" }]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0A0F1E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-400">{item.name}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-lg font-bold text-white mb-6">Budget vs Actual</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetData} layout="vertical" barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number" stroke="#6B7280" hide />
                  <YAxis dataKey="category" type="category" stroke="#9CA3AF" width={70} tick={{ fontSize: 12 }} />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#0A0F1E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  />
                  <Bar dataKey="budget" name="Budget" fill="rgba(255,255,255,0.1)" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="actual" name="Actual" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <GlassCard className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Transaction History</h3>
            <span className="text-xs text-gray-500">{filteredExpenses.length} transactions found</span>
          </div>
          <div className="space-y-2">
            {filteredExpenses.length === 0 ? (
              <div className="h-32 flex flex-col items-center justify-center text-gray-500 opacity-50">
                <Search className="w-8 h-8 mb-2" />
                <p>No matching transactions found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-500 text-xs uppercase tracking-wider border-b border-white/5">
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium">Description</th>
                      <th className="pb-3 font-medium">Category</th>
                      <th className="pb-3 font-medium text-right">Amount</th>
                      <th className="pb-3 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredExpenses.map((e) => (
                      <tr key={e._id || e.id} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 text-sm text-gray-400">{new Date(e.date).toLocaleDateString()}</td>
                        <td className="py-4 text-sm font-medium text-white">{e.description || e.category}</td>
                        <td className="py-4">
                          <span className="px-2 py-1 rounded-full text-[10px] bg-white/5 border border-white/10 text-gray-300">
                            {e.category}
                          </span>
                        </td>
                        <td className="py-4 text-sm font-bold text-white text-right">₹{e.amount.toLocaleString()}</td>
                        <td className="py-4 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={async () => {
                              await expensesApi.deleteExpense(e._id || e.id);
                              fetchData();
                              toast({ title: "Expense Deleted" });
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </GlassCard>
      </div>

      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-6 flex items-start gap-4">
        <div className="p-3 bg-indigo-500/20 rounded-full text-indigo-400">
          <TrendingUp className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-white mb-1">Spending Alert</h4>
          <p className="text-gray-300 text-sm">You spent <span className="text-rose-400 font-bold">34% more</span> on food this month than last month. Consider cooking at home this weekend to get back on track.</p>
        </div>
      </div>
    </div>
  );
}

