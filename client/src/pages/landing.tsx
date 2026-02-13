import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Shield, Activity, Target, PieChart, Lock, Loader2, Sparkles } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { authApi } from "@/api/arthApi";
import { useArthStore } from "@/store/useArthStore";
import { useToast } from "@/hooks/use-toast";
import bgGradient from "@/assets/bg-gradient.png";

export default function Landing() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [income, setIncome] = useState("");
  const [age, setAge] = useState("");
  const [, setLocation] = useLocation();
  const { setToken, setUser } = useArthStore();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const response = await authApi.login({ email, password });
        setToken(response.data.access_token);
        // Get user data after login
        const userRes = await authApi.getMe();
        setUser(userRes.data);
        toast({ title: "Login Successful", description: `Welcome back, ${userRes.data.name}!` });
      } else {
        const response = await authApi.register({
          email,
          password,
          name,
          monthly_income: parseFloat(income),
          age: parseInt(age)
        });
        setToken(response.data.access_token);
        const userRes = await authApi.getMe();
        setUser(userRes.data);
        toast({ title: "Registration Successful", description: "Your account has been created." });
      }
      setLocation("/dashboard");
    } catch (error: any) {
      toast({
        title: "Authentication Failed",
        description: error.response?.data?.detail || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden sentinel-grid">
      {/* Dynamic Background Blobs */}
      <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />

      {/* Navigation */}
      <nav className="relative z-20 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto backdrop-blur-md">
        <div className="text-2xl font-bold text-white flex items-center gap-2 group cursor-default">
          <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          ARTHA <span className="text-primary tracking-tighter">SENTINEL</span>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/5 font-bold uppercase tracking-widest text-[10px]" onClick={() => setIsLogin(true)}>Login</Button>
          <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 font-bold shadow-lg shadow-primary/20" onClick={() => setIsLogin(false)}>Secure Access</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-widest animate-in fade-in slide-in-from-left-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            System Status: Monitoring
          </div>

          <h1 className="text-6xl lg:text-8xl font-bold text-white leading-[0.9] tracking-tighter">
            THE DIGITAL <br />
            <span className="text-gradient decoration-4 font-black">SENTINEL</span> <br />
            FOR WEALTH.
          </h1>

          <p className="text-lg text-gray-400 max-w-lg leading-relaxed font-medium">
            Beyond tracking. We use high-fidelity AI to <span className="text-primary font-bold">shield</span> your income from predatory legal traps, debt-spirals, and cultural spending spikes.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="h-14 px-10 text-lg rounded-xl bg-primary hover:bg-primary/110 text-white font-black uppercase tracking-tighter shadow-2xl shadow-primary/30 group" onClick={() => setIsLogin(false)}>
              Activate Shield <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-xl border-white/10 text-white bg-white/5 hover:bg-white/10 backdrop-blur-md shadow-xl transition-all">
              Live Demo
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-4">
            {[
              { icon: PieChart, text: "Wealth Track", desc: "Real-time auditing" },
              { icon: Shield, text: "Legal Shield", desc: "Contract analysis" },
              { icon: Activity, text: "Debt Pulse", desc: "Trap forecasting" },
              { icon: Target, text: "Life Goals", desc: "Wealth roadmaps" },
              { icon: Activity, text: "Score Guard", desc: "CIBIL protection" },
              { icon: Sparkles, text: "Festival Guard", desc: "Seasonal saving" }
            ].map((feature, i) => (
              <div key={i} className="group p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-white/[0.07] transition-all cursor-default animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                <feature.icon className="w-5 h-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-white uppercase tracking-wider">{feature.text}</p>
                <p className="text-[10px] text-gray-500 mt-1">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Auth Card */}
        <div className="relative animate-in fade-in zoom-in duration-700">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-emerald-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <Card className="relative bg-[#0A0F1E]/80 backdrop-blur-2xl border-white/10 rounded-3xl p-4 sentinel-border">
            <CardContent className="space-y-8 pt-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">
                  {isLogin ? "System Login" : "Initialize Sentinel"}
                </h2>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                  {isLogin ? "Authenticate to access wealth shield" : "Create your high-fidelity financial profile"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div className="space-y-2">
                      <Input
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="h-12 bg-black/40 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50 rounded-xl"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Input
                          type="number"
                          placeholder="Monthly Income"
                          value={income}
                          onChange={(e) => setIncome(e.target.value)}
                          required
                          className="h-12 bg-black/40 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Input
                          type="number"
                          placeholder="Age"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          required
                          className="h-12 bg-black/40 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50 rounded-xl"
                        />
                      </div>
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 bg-black/40 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      type="password"
                      placeholder="Secure Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 bg-black/40 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50 rounded-xl pr-10"
                    />
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 text-sm font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-white rounded-xl shadow-xl shadow-primary/20 transition-all active:scale-95"
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {isLogin ? "Secure Entry" : "Activate Protocol"}
                </Button>
              </form>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-primary transition-colors"
                >
                  {isLogin ? "New user? Request Access" : "Existing Sentinel? Authenticate"}
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/5" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em]">
                  <span className="bg-[#0A0F1E] px-4 text-gray-600">Secure Gateway</span>
                </div>
              </div>

              <Button variant="outline" className="w-full h-12 border-white/10 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl font-bold transition-all">
                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                Identity Sync
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

