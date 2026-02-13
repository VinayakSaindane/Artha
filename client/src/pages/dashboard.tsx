import { GlassCard, StatCard, PageHeader } from "@/components/ui-custom";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  ScanLine, 
  CreditCard, 
  Target, 
  Wallet, 
  TrendingDown, 
  TrendingUp,
  AlertTriangle,
  Coffee,
  ShoppingBag,
  Car,
  Home,
  Activity
} from "lucide-react";
import { Link } from "wouter";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function Dashboard() {
  const healthScore = 74;
  
  // Health Ring Data
  const healthData = [
    { name: "Score", value: healthScore },
    { name: "Remaining", value: 100 - healthScore }
  ];
  
  // Recent Transactions
  const transactions = [
    { id: 1, name: "Uber Ride", category: "Transport", amount: 450, date: "Today, 10:30 AM", icon: Car },
    { id: 2, name: "Starbucks", category: "Food", amount: 320, date: "Today, 08:15 AM", icon: Coffee },
    { id: 3, name: "Grocery Mart", category: "Essentials", amount: 1200, date: "Yesterday", icon: ShoppingBag },
    { id: 4, name: "Rent Payment", category: "Housing", amount: 15000, date: "Feb 1", icon: Home },
  ];

  return (
    <div className="space-y-6">
      {/* Top Greeting & Health Score */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Namaste, Rahul 👋</h1>
          <p className="text-gray-400 mt-1">Here's what's happening with your money today.</p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <Button className="bg-primary hover:bg-primary/90 text-white">
            <Plus className="w-4 h-4 mr-2" /> Add Expense
          </Button>
          <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
            <ScanLine className="w-4 h-4 mr-2" /> Scan Agreement
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Monthly Income" 
          value="₹45,000" 
          icon={Wallet} 
          trend="+2.5%" 
          trendUp={true} 
        />
        <StatCard 
          title="Expenses" 
          value="₹28,400" 
          icon={TrendingDown} 
          trend="Within Budget" 
          trendUp={true} 
        />
        <StatCard 
          title="Savings" 
          value="₹16,600" 
          icon={TrendingUp} 
          subtext="Target: ₹20k" 
        />
        <StatCard 
          title="Debt Risk" 
          value="Low" 
          icon={AlertTriangle} 
          trend="Safe" 
          trendUp={true} 
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Health Score Card */}
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
                  <Cell key="score" fill="#10B981" />
                  <Cell key="remaining" fill="rgba(255,255,255,0.1)" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center -mt-8">
              <span className="text-4xl font-bold text-white">{healthScore}</span>
              <span className="text-xs text-emerald-400">Excellent</span>
            </div>
          </div>
          <p className="text-center text-sm text-gray-400 mt-[-20px]">
            You're doing better than 82% of peers. Keep maintaining your low EMI ratio.
          </p>
        </GlassCard>

        {/* Recent Transactions */}
        <GlassCard className="col-span-1 lg:col-span-2 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-white">Recent Transactions</h3>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 p-0 h-auto">View All</Button>
          </div>
          <div className="space-y-4">
            {transactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-white/5 border border-white/5 text-gray-300">
                    <t.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.category} • {t.date}</p>
                  </div>
                </div>
                <span className="font-medium text-white">-₹{t.amount}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Arth Pulse Alert */}
        <div className="col-span-1 lg:col-span-3">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-center gap-4 animate-pulse">
            <div className="p-2 bg-amber-500/20 rounded-full text-amber-500">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-amber-500">Arth Pulse Alert</h4>
              <p className="text-amber-200/80 text-sm">⚠️ Your EMI ratio is projected to hit 48% in 60 days if spending continues. <Link href="/pulse" className="underline hover:text-amber-100">Check Pulse Analysis</Link></p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
