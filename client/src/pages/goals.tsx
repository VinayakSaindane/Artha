import { GlassCard, PageHeader } from "@/components/ui-custom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useState } from "react";
import { TrendingUp, School, Umbrella, Home } from "lucide-react";

export default function Goals() {
  const [age, setAge] = useState([28]);
  const [retireAge, setRetireAge] = useState([55]);
  const [savings, setSavings] = useState(15000);

  // Mock Projection Data
  const data = [
    { year: '2025', amount: 500000 },
    { year: '2030', amount: 2500000 },
    { year: '2035', amount: 6500000 },
    { year: '2040', amount: 12000000 },
    { year: '2045', amount: 21000000 },
    { year: '2050', amount: 35000000 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Goals & Planning" subtitle="Map out your financial journey to freedom" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <GlassCard className="lg:col-span-1 p-6 space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between">
              <Label className="text-gray-400">Current Age</Label>
              <span className="text-white font-bold">{age[0]}</span>
            </div>
            <Slider defaultValue={[28]} max={80} min={18} step={1} onValueChange={setAge} />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <Label className="text-gray-400">Retirement Age</Label>
              <span className="text-white font-bold">{retireAge[0]}</span>
            </div>
            <Slider defaultValue={[55]} max={80} min={40} step={1} onValueChange={setRetireAge} />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-400">Monthly SIP / Savings</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
              <Input 
                className="pl-8 bg-black/20 border-white/10 text-white" 
                value={savings} 
                onChange={(e) => setSavings(Number(e.target.value))}
              />
            </div>
          </div>
          
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <div className="flex gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-full h-fit">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                 <h4 className="font-bold text-emerald-400 text-sm mb-1">AI Recommendation</h4>
                 <p className="text-xs text-gray-300 leading-relaxed">To reach your goal of ₹5Cr by age {retireAge[0]}, try increasing your SIP by <span className="text-white font-bold">₹3,200/mo</span>.</p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Projection Chart */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-lg font-bold text-white mb-6">Corpus Growth Projection</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" tickFormatter={(value) => `₹${value/100000}L`} />
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0A0F1E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value) => [`₹${(value as number).toLocaleString()}`, "Corpus"]}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#3B82F6" fillOpacity={1} fill="url(#colorAmount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Goal Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GlassCard className="p-4 flex flex-col justify-between min-h-[140px] border-l-4 border-l-blue-500">
              <School className="w-6 h-6 text-blue-500 mb-2" />
              <div>
                <p className="text-sm text-gray-400">Child Education</p>
                <h4 className="text-xl font-bold text-white">₹25L</h4>
                <p className="text-xs text-gray-500 mt-1">Target: 2035</p>
              </div>
            </GlassCard>
            
            <GlassCard className="p-4 flex flex-col justify-between min-h-[140px] border-l-4 border-l-rose-500">
              <Umbrella className="w-6 h-6 text-rose-500 mb-2" />
              <div>
                <p className="text-sm text-gray-400">Emergency Fund</p>
                <h4 className="text-xl font-bold text-white">₹5L</h4>
                <p className="text-xs text-gray-500 mt-1">Status: 60% Done</p>
              </div>
            </GlassCard>

            <GlassCard className="p-4 flex flex-col justify-between min-h-[140px] border-l-4 border-l-purple-500">
              <Home className="w-6 h-6 text-purple-500 mb-2" />
              <div>
                <p className="text-sm text-gray-400">Home Down Payment</p>
                <h4 className="text-xl font-bold text-white">₹40L</h4>
                <p className="text-xs text-gray-500 mt-1">Target: 2028</p>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
