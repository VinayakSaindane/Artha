import { GlassCard, PageHeader } from "@/components/ui-custom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User, Bell, Shield, Wallet, Save, Loader2, Sparkles, LogOut } from "lucide-react";
import { useState } from "react";
import { useArthStore } from "@/store/useArthStore";
import { authApi } from "@/api/arthApi";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function Settings() {
    const { user, setUser } = useArthStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        monthly_income: user?.monthly_income || 0,
        age: user?.age || 28
    });
    const { toast } = useToast();
    const [, setLocation] = useLocation();

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await authApi.updateProfile(formData);
            setUser(res.data);
            toast({ title: "Profile Updated", description: "Your changes have been saved successfully." });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.detail || "Failed to update profile",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        setLocation("/");
        toast({ title: "Logged Out", description: "Session cleared successfully." });
    };

    return (
        <div className="space-y-6">
            <PageHeader title="Settings" subtitle="Customize your ARTH experience and profile" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-4">
                    <GlassCard className="p-4 space-y-2">
                        <Button variant="ghost" className="w-full justify-start text-white bg-white/5 border border-white/10">
                            <User className="w-4 h-4 mr-2 text-primary" /> Profile Settings
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white">
                            <Bell className="w-4 h-4 mr-2" /> Notifications
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white">
                            <Shield className="w-4 h-4 mr-2" /> Privacy & Security
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white">
                            <Sparkles className="w-4 h-4 mr-2" /> AI Preferences
                        </Button>
                        <div className="pt-4 mt-4 border-t border-white/5">
                            <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-rose-400 hover:text-rose-500 hover:bg-rose-500/10">
                                <LogOut className="w-4 h-4 mr-2" /> Sign Out
                            </Button>
                        </div>
                    </GlassCard>

                    <GlassCard className="p-6 bg-primary/5 border-primary/20">
                        <h4 className="font-bold text-white flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary" /> Premium Active
                        </h4>
                        <p className="text-xs text-gray-400 mt-2">You have full access to Gemini 2.5 Debt Predictions and ARTH Shield.</p>
                    </GlassCard>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <GlassCard className="p-6 space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <User className="w-5 h-5 text-primary" /> Personal Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Full Name</Label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="John Doe"
                                        className="bg-black/20 border-white/10 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email Address</Label>
                                    <Input
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="john@example.com"
                                        className="bg-black/20 border-white/10 text-white"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Monthly Income (₹)</Label>
                                    <div className="relative">
                                        <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <Input
                                            type="number"
                                            value={formData.monthly_income}
                                            onChange={(e) => setFormData({ ...formData, monthly_income: Number(e.target.value) })}
                                            className="pl-10 bg-black/20 border-white/10 text-white"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Current Age</Label>
                                    <Input
                                        type="number"
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                                        className="bg-black/20 border-white/10 text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Bell className="w-5 h-5 text-primary" /> Preferences
                            </h3>

                            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                <div>
                                    <p className="font-medium text-white text-sm">Debt Trap Alerts</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Push notification when EMI ratio crosses 40%</p>
                                </div>
                                <Switch defaultChecked />
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                <div>
                                    <p className="font-medium text-white text-sm">Smart Expense Categorization</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Use AI to automatically label scanned receipts</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </div>

                        <Button
                            onClick={handleSave}
                            disabled={loading}
                            className="w-full h-12 bg-primary hover:bg-primary/90 text-white shadow-[0_4px_20px_-5px_rgba(59,130,246,0.5)]"
                        >
                            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Save All Changes
                        </Button>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
