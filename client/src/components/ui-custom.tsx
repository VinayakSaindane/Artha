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
  subtext,
  className
}: {
  title: string;
  value: string;
  icon?: any;
  trend?: string;
  trendUp?: boolean;
  subtext?: string;
  className?: string;
}) {
  return (
    <div className={cn("sentinel-border glow-blue rounded-xl", className)}>
      <GlassCard className="p-6 h-full">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-500 mb-1">{title}</p>
            <h3 className="text-3xl font-black text-white tracking-tighter">{value}</h3>
          </div>
          {Icon && (
            <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <Icon className="w-5 h-5" />
            </div>
          )}
        </div>
        {(trend || subtext) && (
          <div className="flex items-center gap-2">
            {trend && (
              <span className={cn(
                "text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md",
                trendUp
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              )}>
                {trend}
              </span>
            )}
            {subtext && <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{subtext}</span>}
          </div>
        )}
      </GlassCard>
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-10 space-y-2 animate-in fade-in slide-in-from-left-4 duration-700">
      <div className="flex items-center gap-2">
      </div>
      <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
        {title}
      </h1>
      {subtitle && <p className="text-gray-400 font-medium max-w-2xl leading-relaxed">{subtitle}</p>}
    </div>
  );
}
