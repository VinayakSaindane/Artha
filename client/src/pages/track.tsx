import { GlassCard, PageHeader } from "@/components/ui-custom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Search, Filter, TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const expenseData = [
  { name: "Food", value: 8500, color: "#3B82F6" },
  { name: "Transport", value: 4200, color: "#10B981" },
  { name: "EMI", value: 12500, color: "#F59E0B" },
  { name: "Health", value: 3200, color: "#EF4444" },
  { name: "Fun", value: 5400, color: "#8B5CF6" },
];

const budgetData = [
  { category: "Food", budget: 7000, actual: 8500 },
  { category: "Transport", budget: 5000, actual: 4200 },
  { category: "EMI", budget: 12500, actual: 12500 },
  { category: "Health", budget: 5000, actual: 3200 },
  { category: "Fun", budget: 4000, actual: 5400 },
];

export default function Track() {
  return (
    <div className="space-y-6">
      <PageHeader title="Expense Tracker" subtitle="Monitor your spending patterns in real-time" />

      {/* Top Controls */}
      <GlassCard className="p-4 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-[300px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input className="pl-9 bg-black/20 border-white/10 text-white placeholder:text-gray-500" placeholder="Search expenses..." />
          </div>
          <Button variant="outline" className="border-white/10 text-gray-300">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
        </div>
        <div className="flex gap-2">
           <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border border-white/10">
            <Mic className="w-4 h-4 mr-2" /> Voice Add
           </Button>
           <Button className="bg-primary hover:bg-primary/90 text-white">
            + Add Expense
           </Button>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Breakdown Chart */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-bold text-white mb-6">Monthly Breakdown</h3>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {expenseData.map((entry, index) => (
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
            {expenseData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-gray-400">{item.name}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Budget vs Actual */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-bold text-white mb-6">Budget vs Actual</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetData} layout="vertical" barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" stroke="#6B7280" hide />
                <YAxis dataKey="category" type="category" stroke="#9CA3AF" width={70} tick={{fontSize: 12}} />
                <Tooltip 
                   cursor={{fill: 'rgba(255,255,255,0.05)'}}
                   contentStyle={{ backgroundColor: '#0A0F1E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Bar dataKey="budget" name="Budget" fill="rgba(255,255,255,0.1)" radius={[0, 4, 4, 0]} />
                <Bar dataKey="actual" name="Actual" fill="#3B82F6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Tip Card */}
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
