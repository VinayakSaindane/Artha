import { GlassCard, PageHeader } from "@/components/ui-custom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { Check, Info, Loader2 } from "lucide-react";
import { scoreApi } from "@/api/arthApi";
import { useToast } from "@/hooks/use-toast";

export default function Score() {
  const [creditScore, setCreditScore] = useState([750]);
  const [income, setIncome] = useState(45000);
  const [existingEmis, setExistingEmis] = useState(12000);
  const [loanAmount, setLoanAmount] = useState(500000);
  const [loanPurpose, setLoanPurpose] = useState("personal");
  const [predicting, setPredicting] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const { toast } = useToast();
  const [loadingStep, setLoadingStep] = useState(0);
  const loadingSteps = [
    "Initalizing Risk Analysis...",
    "Scanning CIBIL History...",
    "Auditing Debt-to-Equity Ratio...",
    "Cross-referencing Lender Criteria...",
    "Computing Approval Vector..."
  ];

  const handlePredict = async () => {
    setPredicting(true);
    const interval = setInterval(() => {
      setLoadingStep(prev => (prev + 1) % loadingSteps.length);
    }, 1200);

    // Tech feeling delay
    await new Promise(r => setTimeout(r, 4000));

    try {
      const response = await scoreApi.predict({
        income,
        existing_emis: existingEmis,
        credit_score: creditScore[0],
        loan_amount: loanAmount,
        employment_type: "salaried",
        loan_purpose: loanPurpose,
        monthly_expenses: 15000
      });
      setPrediction(response.data);
      toast({
        title: "Sentinel Analysis Complete",
        description: "Your approval vectors have been established.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to establish prediction.",
        variant: "destructive",
      });
    } finally {
      clearInterval(interval);
      setPredicting(false);
    }
  };

  const gaugeData = prediction ? [
    { name: "Score", value: prediction.approval_probability },
    { name: "Remaining", value: 100 - prediction.approval_probability }
  ] : [
    { name: "Score", value: 0 },
    { name: "Remaining", value: 100 }
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Loan Predictor" subtitle="Check your eligibility before applying and protect your CIBIL score" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-gray-400">Monthly Income</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                  <Input
                    className="pl-8 bg-black/20 border-white/10 text-white"
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-400">Current EMIs</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                  <Input
                    className="pl-8 bg-black/20 border-white/10 text-white"
                    type="number"
                    value={existingEmis}
                    onChange={(e) => setExistingEmis(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <div className="flex justify-between mb-2">
                  <Label className="text-gray-400">Credit Score (CIBIL)</Label>
                  <span className="text-primary font-bold">{creditScore[0]}</span>
                </div>
                <Slider
                  value={creditScore}
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
                  <Input
                    className="pl-8 bg-black/20 border-white/10 text-white"
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-400">Loan Purpose</Label>
                <Select value={loanPurpose} onValueChange={setLoanPurpose}>
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

            <Button
              className="w-full mt-8 h-12 text-lg bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]"
              onClick={handlePredict}
              disabled={predicting}
            >
              {predicting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {predicting ? "Analyzing Profile..." : "Predict My Approval"}
            </Button>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard className="p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
            {!prediction ? (
              <div className="h-64 flex flex-col items-center justify-center text-gray-500">
                <Info className="w-12 h-12 mb-4 opacity-20" />
                <p>Enter details to see prediction</p>
              </div>
            ) : (
              <>
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
                        <Cell key="score" fill={prediction.approval_probability > 70 ? "#10B981" : prediction.approval_probability > 40 ? "#F59E0B" : "#EF4444"} />
                        <Cell key="remaining" fill="rgba(255,255,255,0.1)" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center -mt-8">
                    <span className="text-4xl font-bold text-white">{prediction.approval_probability}%</span>
                    <span className={`text-xs ${prediction.approval_probability > 70 ? "text-emerald-400" :
                      prediction.approval_probability > 40 ? "text-amber-400" : "text-rose-400"
                      }`}>{prediction.verdict}</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Recommended Loan: ₹{prediction.recommended_loan_amount.toLocaleString()}
                </p>
              </>
            )}
          </GlassCard>

          {prediction && (
            <>
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">How to Improve</h4>
                {prediction.improvement_tips.map((tip: any, i: number) => (
                  <div key={i} className="flex gap-3 text-sm text-gray-300">
                    <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p>{tip.action}</p>
                      <p className="text-xs text-primary/70">Impact: {tip.impact}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-white/5">
                <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Likely Lenders</h4>
                <div className="flex flex-wrap gap-2">
                  {prediction.suggested_banks.map((bank: string) => (
                    <div key={bank} className="px-3 py-2 bg-white rounded text-black font-bold text-xs">
                      {bank}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

