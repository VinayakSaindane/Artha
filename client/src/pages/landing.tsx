import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Shield, Activity, Target, PieChart, Lock, Loader2 } from "lucide-react";
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background blobs */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none mix-blend-screen"
        style={{
          backgroundImage: `url(${bgGradient})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-2xl font-bold text-white flex items-center gap-2">
          ARTH <span className="text-primary">₳</span>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" className="text-gray-300 hover:text-white" onClick={() => setIsLogin(true)}>Login</Button>
          <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6" onClick={() => setIsLogin(false)}>Get Started</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <h1 className="text-5xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
            Your Money. <br />
            Your Future. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Your ARTH.
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
            India's first AI co-pilot that tracks, protects, predicts and plans your entire financial life.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-primary hover:bg-primary/90 shadow-[0_0_30px_-10px_rgba(59,130,246,0.5)]" onClick={() => setIsLogin(false)}>
              Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-white/10 text-white hover:bg-white/5">
              See How It Works
            </Button>
          </div>

          <div className="flex flex-wrap gap-3 pt-4">
            {[
              { icon: PieChart, text: "Track" },
              { icon: Shield, text: "Shield" },
              { icon: Activity, text: "Score" },
              { icon: Target, text: "Goals" },
              { icon: Activity, text: "Pulse" }
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-sm text-gray-300">
                <feature.icon className="w-4 h-4 text-primary" />
                {feature.text}
              </div>
            ))}
          </div>
        </div>

        {/* Auth Card */}
        <div className="lg:pl-12">
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl p-2">
            <CardContent className="p-8 space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-white">
                  {isLogin ? "Welcome Back" : "Create Account"}
                </h3>
                <p className="text-gray-400">
                  {isLogin ? "Enter your details to access your dashboard" : "Join ARTH and take control of your finances"}
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
                        className="h-12 bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/50"
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
                          className="h-12 bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Input
                          type="number"
                          placeholder="Age"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          required
                          className="h-12 bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/50"
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
                    className="h-12 bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/50"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 text-lg bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {isLogin ? "Sign In" : "Sign Up"}
                </Button>
              </form>

              <div className="text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-primary hover:underline"
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#0A0F1E] px-2 text-gray-500">Or continue with</span>
                </div>
              </div>

              <Button variant="outline" className="w-full h-12 border-white/10 text-white hover:bg-white/5">
                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                Google
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

