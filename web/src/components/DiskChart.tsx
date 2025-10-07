import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { HardDrive } from "lucide-react"

interface DiskChartProps {
  data: {
    disk: {
      used: number
      free: number
      total: number
    }
  }
}

export default function DiskChart({ data }: DiskChartProps) {
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
  }

  const chartData = [
    {
      name: "Used",
      value: data.disk.used,
      formatted: formatBytes(data.disk.used),
    },
    {
      name: "Free",
      value: data.disk.free,
      formatted: formatBytes(data.disk.free),
    },
  ]

  const COLORS = ["#ec4899", "#10b981"]

  const renderCustomLabel = (entry: any) => {
    const percent = ((entry.value / data.disk.total) * 100).toFixed(1)
    return `${entry.name}: ${percent}%`
  }

  return (
    <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-pink-400" />
          Disk Usage Distribution
        </CardTitle>
        <CardDescription className="text-gray-400">
          Storage allocation breakdown
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => formatBytes(value)}
              contentStyle={{
                backgroundColor: "rgba(17, 24, 39, 0.9)",
                border: "1px solid #374151",
                borderRadius: "0.5rem",
              }}
              labelStyle={{ color: "#9ca3af" }}
            />
            <Legend
              formatter={(value, entry: any) =>
                `${value}: ${entry.payload.formatted}`
              }
              wrapperStyle={{ color: "#9ca3af" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
