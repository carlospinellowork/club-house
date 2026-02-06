"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import { motion } from "motion/react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ProfileMetricsProps {
  memberId: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const isGreen = payload[0]?.dataKey === "posts" && payload[0]?.fill?.includes("greenGradient");
    return (
      <div className="bg-zinc-900/95 backdrop-blur-xl border border-emerald-500/30 p-3 rounded-xl shadow-2xl ring-1 ring-emerald-500/20">
        <p className="text-[10px] uppercase tracking-[0.1em] text-emerald-400/80 font-bold mb-2">{label}</p>
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)]" />
          <p className="text-sm font-bold tracking-tight text-white">
            {payload[0].value} <span className="text-emerald-300/70 font-medium">Posts</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export function ProfileMetrics({ memberId }: ProfileMetricsProps) {
  const { data: activityData, isLoading } = trpc.member.getActivityData.useQuery({
    id: memberId,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Skeleton className="h-[300px] w-full rounded-[2rem]" />
        <Skeleton className="h-[300px] w-full rounded-[2rem]" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
      className="mt-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfico de Consistência - Verde Campo */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-950/40 to-card border-emerald-500/20 shadow-2xl rounded-[1.5rem] transition-all duration-500 hover:border-emerald-500/40 hover:shadow-emerald-500/10 group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.1),transparent_50%)]" />

          <CardHeader className="pb-4 flex flex-row items-center justify-between relative z-10 border-b border-emerald-500/10 bg-emerald-950/20">
            <div>
              <CardTitle className="text-sm font-bold text-emerald-50 flex items-center gap-2">
                ⚽ Consistência
              </CardTitle>
              <p className="text-[10px] text-emerald-400/70 font-medium mt-1">Total de postagens nos últimos 6 meses</p>
            </div>
            <div className="bg-emerald-500/10 backdrop-blur-md text-[10px] font-bold px-3 py-1.5 rounded-lg border border-emerald-500/30 tracking-tight text-emerald-300 shadow-lg shadow-emerald-500/5">
              6 MESES
            </div>
          </CardHeader>

          <CardContent className="h-[260px] pt-6 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="50%" stopColor="#059669" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#047857" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#10b981" opacity={0.15} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6ee7b7", fontSize: 10, fontWeight: 500, opacity: 0.8 }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    stroke: '#10b981',
                    strokeWidth: 2,
                    strokeDasharray: '4 4',
                    opacity: 0.3
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="posts"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#greenGradient)"
                  animationDuration={2000}
                  animationEasing="ease-in-out"
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: "#10b981",
                    stroke: "#d1fae5",
                    strokeWidth: 2,
                    className: "drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Volume - Dourado Troféu */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-amber-950/40 to-card border-amber-500/20 shadow-2xl rounded-[1.5rem] transition-all duration-500 hover:border-amber-500/40 hover:shadow-amber-500/10 group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(245,158,11,0.1),transparent_50%)]" />

          <CardHeader className="pb-4 flex flex-row items-center justify-between relative z-10 border-b border-amber-500/10 bg-amber-950/20">
            <div>
              <CardTitle className="text-sm font-bold text-amber-50 flex items-center gap-2">
                🏆 Volume Mensal
              </CardTitle>
              <p className="text-[10px] text-amber-400/70 font-medium mt-1">Comparativo de performance por mês</p>
            </div>
          </CardHeader>

          <CardContent className="h-[260px] pt-6 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.9} />
                    <stop offset="50%" stopColor="#f59e0b" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#d97706" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f59e0b" opacity={0.15} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#fcd34d", fontSize: 10, fontWeight: 500, opacity: 0.8 }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: '#f59e0b', opacity: 0.08, radius: 8 }}
                />
                <Bar
                  dataKey="posts"
                  fill="url(#goldGradient)"
                  radius={[6, 6, 0, 0]}
                  barSize={32}
                  animationDuration={2500}
                  className="drop-shadow-[0_4px_12px_rgba(245,158,11,0.3)]"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
