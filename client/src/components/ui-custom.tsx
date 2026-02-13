import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function GlassCard({ children, className, ...props }: React.ComponentProps<typeof Card>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card 
        className={cn(
          "glass-card border-white/5 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-colors", 
          className
        )} 
        {...props}
      >
        {children}
      </Card>
    </motion.div>
  );
}

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendUp,
  subtext
}: { 
  title: string; 
  value: string; 
  icon?: any; 
  trend?: string; 
  trendUp?: boolean;
  subtext?: string;
}) {
  return (
    <GlassCard className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-gray-400 font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
        </div>
        {Icon && (
          <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {(trend || subtext) && (
        <div className="flex items-center gap-2">
          {trend && (
            <span className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full",
              trendUp 
                ? "bg-emerald-500/10 text-emerald-400" 
                : "bg-rose-500/10 text-rose-400"
            )}>
              {trend}
            </span>
          )}
          {subtext && <span className="text-xs text-gray-500">{subtext}</span>}
        </div>
      )}
    </GlassCard>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-white tracking-tight">{title}</h1>
      {subtitle && <p className="text-gray-400 mt-2">{subtitle}</p>}
    </div>
  );
}
