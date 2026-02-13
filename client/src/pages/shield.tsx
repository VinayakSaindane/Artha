import { GlassCard, PageHeader } from "@/components/ui-custom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, CheckCircle, AlertTriangle, XCircle, Download } from "lucide-react";
import { useState } from "react";
import { shieldApi } from "@/api/arthApi";
import { useToast } from "@/hooks/use-toast";

export default function Shield() {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setText(""); // Clear text if file is chosen
      toast({
        title: "File Selected",
        description: `${e.target.files[0].name} ready for analysis.`,
      });
    }
  };

  const handleAnalyze = async () => {
    if (!text && !file) {
      toast({
        title: "Error",
        description: "Please paste text or upload a file first.",
        variant: "destructive",
      });
      return;
    }
    setAnalyzing(true);
    try {
      const response = await shieldApi.analyze({ text, file: file || undefined });
      setAnalysis(response.data.analysis); // Note: Backend returns { analysis: { ... } }
      toast({
        title: "Success",
        description: "Agreement analyzed successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to analyze agreement.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Arth Shield" subtitle="AI-powered agreement analyzer to protect you from hidden risks" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <label className="cursor-pointer">
            <input type="file" className="hidden" accept=".pdf,.txt" onChange={handleFileChange} />
            <GlassCard className={`p-8 border-dashed border-2 ${file ? 'border-primary bg-primary/5' : 'border-white/10'} flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors min-h-[200px]`}>
              <div className="p-4 rounded-full bg-white/5 mb-4">
                <Upload className={`w-8 h-8 ${file ? 'text-primary animate-bounce' : 'text-gray-400'}`} />
              </div>
              <h3 className="text-lg font-medium text-white">
                {file ? file.name : "Drop your agreement PDF"}
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                {file ? "File ready for analysis" : "or click to browse files"}
              </p>
            </GlassCard>
          </label>

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
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <Button
            className="w-full h-12 text-lg bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]"
            onClick={handleAnalyze}
            disabled={analyzing}
          >
            {analyzing ? "Analyzing Clauses..." : "Analyze with AI"}
          </Button>
        </div>

        <div className="space-y-6">
          {!analysis ? (
            <GlassCard className="h-full flex flex-col items-center justify-center p-8 text-center opacity-50">
              <FileText className="w-16 h-16 text-gray-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-500">Analysis Results</h3>
              <p className="text-gray-600 mt-2">Upload a document to see risk analysis here</p>
            </GlassCard>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
              <GlassCard className={`p-6 border-l-4 ${analysis.risk_level === "HIGH" ? "border-l-rose-500" :
                analysis.risk_level === "MEDIUM" ? "border-l-amber-500" : "border-l-emerald-500"
                }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-gray-400 font-medium text-sm uppercase tracking-wider">Risk Score: {analysis.risk_score}/100</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-3xl font-bold ${analysis.risk_level === "HIGH" ? "text-rose-500" :
                        analysis.risk_level === "MEDIUM" ? "text-amber-500" : "text-emerald-500"
                        }`}>{analysis.risk_level} RISK</span>
                      <span className="px-2 py-1 bg-white/5 text-gray-400 text-xs rounded-full border border-white/10">AI Verified</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">{analysis.summary}</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/5">
                    <Download className="w-4 h-4 mr-2" /> Report
                  </Button>
                </div>
              </GlassCard>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-400 px-2">
                  <span>Flagged Clauses ({(analysis?.flags || []).length})</span>
                </div>

                {(analysis?.flags || []).map((flag: any, i: number) => (
                  <GlassCard key={i} className={`p-4 border-l-4 ${flag.severity === "HIGH" ? "border-l-rose-500" :
                    flag.severity === "MEDIUM" ? "border-l-amber-500" : "border-l-emerald-500"
                    }`}>
                    <div className="flex items-start gap-3">
                      {flag.severity === "HIGH" ? <XCircle className="w-5 h-5 text-rose-500 mt-1 shrink-0" /> :
                        flag.severity === "MEDIUM" ? <AlertTriangle className="w-5 h-5 text-amber-500 mt-1 shrink-0" /> :
                          <CheckCircle className="w-5 h-5 text-emerald-500 mt-1 shrink-0" />}
                      <div>
                        <h4 className={`font-bold text-sm ${flag.severity === "HIGH" ? "text-rose-400" :
                          flag.severity === "MEDIUM" ? "text-amber-400" : "text-emerald-400"
                          }`}>{flag.issue}</h4>
                        <p className="text-white/80 text-sm mt-1">"{flag.clause_text}"</p>
                        <div className={`mt-3 p-3 rounded-lg border ${flag.severity === "HIGH" ? "bg-rose-500/10 border-rose-500/20" :
                          flag.severity === "MEDIUM" ? "bg-amber-500/10 border-amber-500/20" : "bg-emerald-500/10 border-emerald-500/20"
                          }`}>
                          <p className="text-xs">
                            <span className="font-bold">Regulation:</span> {flag.regulation_violated}
                          </p>
                          <p className="text-xs mt-1">
                            <span className="font-bold">Suggested Fix:</span> {flag.suggested_fix}
                          </p>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                ))}

                {(analysis?.missing_clauses || []).length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-400 mb-2 px-2">Missing Clauses</h4>
                    <div className="space-y-2">
                      {(analysis?.missing_clauses || []).map((clause: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/10 text-xs text-gray-300">
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                          {clause}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

