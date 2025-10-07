import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MemoryStick } from "lucide-react"

interface MemoryChartProps {
  data: Array<{
    timestamp: string
    memory: {
      usedPercent: number
    }
  }>
}

export default function MemoryChart({ data }: MemoryChartProps) {
  const chartData = data.map((item, index) => ({
    time: index,
    memory: Number(item.memory.usedPercent.toFixed(1)),
  }))

  return (
    <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <MemoryStick className="w-5 h-5 text-purple-400" />
          Memory Usage History
        </CardTitle>
        <CardDescription className="text-gray-400">
          RAM consumption over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="time"
              stroke="#9ca3af"
              tick={{ fill: "#9ca3af" }}
              label={{
                value: "Time",
                position: "insideBottom",
                offset: -5,
                fill: "#9ca3af",
              }}
            />
            <YAxis
              stroke="#9ca3af"
              tick={{ fill: "#9ca3af" }}
              domain={[0, 100]}
              label={{
                value: "Usage (%)",
                angle: -90,
                position: "insideLeft",
                fill: "#9ca3af",
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(17, 24, 39, 0.9)",
                border: "1px solid #374151",
                borderRadius: "0.5rem",
              }}
              labelStyle={{ color: "#9ca3af" }}
            />
            <Line
              type="monotone"
              dataKey="memory"
              stroke="#a855f7"
              strokeWidth={2}
              dot={false}
              animationDuration={300}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
