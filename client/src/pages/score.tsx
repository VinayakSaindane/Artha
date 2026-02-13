import { GlassCard, PageHeader } from "@/components/ui-custom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { Check, Info } from "lucide-react";

export default function Score() {
  const [creditScore, setCreditScore] = useState([750]);
  
  // Gauge Data
  const gaugeData = [
    { name: "Score", value: 82 },
    { name: "Remaining", value: 18 }
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Loan Predictor" subtitle="Check your eligibility before applying and protect your CIBIL score" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-gray-400">Monthly Income</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                  <Input className="pl-8 bg-black/20 border-white/10 text-white" defaultValue="45000" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-gray-400">Current EMIs</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                  <Input className="pl-8 bg-black/20 border-white/10 text-white" defaultValue="12000" />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                 <div className="flex justify-between mb-2">
                   <Label className="text-gray-400">Credit Score (CIBIL)</Label>
                   <span className="text-primary font-bold">{creditScore[0]}</span>
                 </div>
                 <Slider 
                   defaultValue={[750]} 
                   max={900} 
                   min={300} 
                   step={1} 
                   onValueChange={setCreditScore}
                   className="py-4"
                 />
                 <div className="flex justify-between text-xs text-gray-600 px-1">
                   <span>300</span>
                   <span>900</span>
                 </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-400">Loan Amount Requested</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                  <Input className="pl-8 bg-black/20 border-white/10 text-white" defaultValue="500000" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-400">Loan Purpose</Label>
                <Select defaultValue="personal">
                  <SelectTrigger className="bg-black/20 border-white/10 text-white">
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Personal Use</SelectItem>
                    <SelectItem value="home">Home Renovation</SelectItem>
                    <SelectItem value="car">Vehicle Purchase</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button className="w-full mt-8 h-12 text-lg bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]">
              Predict My Approval
            </Button>
          </GlassCard>
        </div>

        {/* Prediction Result */}
        <div className="space-y-6">
          <GlassCard className="p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
             <div className="relative w-48 h-48 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={gaugeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      startAngle={180}
                      endAngle={0}
                      paddingAngle={0}
                      dataKey="value"
                      stroke="none"
                    >
                      <Cell key="score" fill="#10B981" />
                      <Cell key="remaining" fill="rgba(255,255,255,0.1)" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center -mt-8">
                  <span className="text-4xl font-bold text-white">82%</span>
                  <span className="text-xs text-emerald-400">High Chance</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Based on your profile, you have a very high chance of approval for ₹5L.
              </p>
          </GlassCard>

          <div className="space-y-3">
             <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">How to Improve</h4>
             {[
               "Reduce current EMI burden by ₹2,000",
               "Maintain credit utilization below 30%",
               "Avoid multiple loan inquiries this month"
             ].map((tip, i) => (
               <div key={i} className="flex gap-3 text-sm text-gray-300">
                 <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                 {tip}
               </div>
             ))}
          </div>
          
           <div className="space-y-3 pt-4 border-t border-white/5">
             <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Likely Lenders</h4>
             <div className="flex gap-4">
               {["HDFC", "ICICI", "SBI"].map((bank) => (
                 <div key={bank} className="px-3 py-2 bg-white rounded text-black font-bold text-xs">
                   {bank}
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
