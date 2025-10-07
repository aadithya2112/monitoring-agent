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
import { Activity } from "lucide-react"

interface CPUChartProps {
  data: Array<{
    timestamp: string
    cpu: {
      usagePercent: number
    }
  }>
}

export default function CPUChart({ data }: CPUChartProps) {
  const chartData = data.map((item, index) => ({
    time: index,
    cpu: Number(item.cpu.usagePercent.toFixed(1)),
  }))

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <CardTitle className="text-gray-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-gray-700" />
          CPU Usage History
        </CardTitle>
        <CardDescription className="text-gray-600">
          Real-time CPU utilization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="time"
              stroke="#6b7280"
              tick={{ fill: "#6b7280" }}
              label={{
                value: "Time",
                position: "insideBottom",
                offset: -5,
                fill: "#6b7280",
              }}
            />
            <YAxis
              stroke="#6b7280"
              tick={{ fill: "#6b7280" }}
              domain={[0, 100]}
              label={{
                value: "Usage (%)",
                angle: -90,
                position: "insideLeft",
                fill: "#6b7280",
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.98)",
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
              }}
              labelStyle={{ color: "#374151" }}
            />
            <Line
              type="monotone"
              dataKey="cpu"
              stroke="#4b5563"
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
