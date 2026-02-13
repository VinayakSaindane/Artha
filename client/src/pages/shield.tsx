import { GlassCard, PageHeader } from "@/components/ui-custom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, CheckCircle, AlertTriangle, XCircle, Download } from "lucide-react";
import { useState } from "react";

export default function Shield() {
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Arth Shield" subtitle="AI-powered agreement analyzer to protect you from hidden risks" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Zone */}
        <div className="space-y-6">
          <GlassCard className="p-8 border-dashed border-2 border-white/10 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors cursor-pointer min-h-[200px]">
            <div className="p-4 rounded-full bg-white/5 mb-4">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-white">Drop your agreement PDF</h3>
            <p className="text-sm text-gray-500 mt-2">or click to browse files</p>
          </GlassCard>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0A0F1E] px-2 text-gray-500">Or paste text</span>
            </div>
          </div>

          <Textarea 
            placeholder="Paste contract clauses here..." 
            className="min-h-[200px] bg-black/20 border-white/10 text-white resize-none focus:border-primary/50"
          />

          <Button 
            className="w-full h-12 text-lg bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]"
            onClick={handleAnalyze}
            disabled={analyzing}
          >
            {analyzing ? "Analyzing Clauses..." : "Analyze with AI"}
          </Button>
        </div>

        {/* Results Zone */}
        <div className="space-y-6">
          {!analyzed ? (
            <GlassCard className="h-full flex flex-col items-center justify-center p-8 text-center opacity-50">
              <FileText className="w-16 h-16 text-gray-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-500">Analysis Results</h3>
              <p className="text-gray-600 mt-2">Upload a document to see risk analysis here</p>
            </GlassCard>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
              {/* Overall Score */}
              <GlassCard className="p-6 border-l-4 border-l-amber-500">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-gray-400 font-medium text-sm uppercase tracking-wider">Risk Score</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-3xl font-bold text-amber-500">MEDIUM RISK</span>
                      <span className="px-2 py-1 bg-amber-500/10 text-amber-500 text-xs rounded-full border border-amber-500/20">Review Required</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/5">
                    <Download className="w-4 h-4 mr-2" /> Report
                  </Button>
                </div>
              </GlassCard>

              {/* Flags List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-400 px-2">
                  <span>Flagged Clauses (3)</span>
                </div>

                <GlassCard className="p-4 border-l-4 border-l-rose-500">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-rose-500 mt-1 shrink-0" />
                    <div>
                      <h4 className="font-bold text-rose-400 text-sm">Foreclosure Charges</h4>
                      <p className="text-white/80 text-sm mt-1">"Bank reserves right to charge 4% penalty on pre-payment."</p>
                      <div className="mt-3 p-3 bg-rose-500/10 rounded-lg border border-rose-500/20">
                        <p className="text-xs text-rose-300"><span className="font-bold">RBI Violation:</span> Floating rate loans for individuals cannot have foreclosure charges.</p>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-4 border-l-4 border-l-amber-500">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-1 shrink-0" />
                    <div>
                      <h4 className="font-bold text-amber-500 text-sm">Interest Reset Clause</h4>
                      <p className="text-white/80 text-sm mt-1">"Bank may reset the spread at its sole discretion every 3 months."</p>
                      <p className="text-xs text-amber-400 mt-2">⚠️ Tip: Negotiate for "linked to external benchmark" instead of "sole discretion".</p>
                    </div>
                  </div>
                </GlassCard>
                
                <GlassCard className="p-4 border-l-4 border-l-emerald-500">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-1 shrink-0" />
                    <div>
                      <h4 className="font-bold text-emerald-500 text-sm">Tenure Extension</h4>
                      <p className="text-white/80 text-sm mt-1">Standard clause. No issues found.</p>
                    </div>
                  </div>
                </GlassCard>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
