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

  const COLORS = ["#374151", "#9ca3af"]

  const renderCustomLabel = (entry: any) => {
    const percent = ((entry.value / data.disk.total) * 100).toFixed(1)
    return `${entry.name}: ${percent}%`
  }

  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="#ffffff"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-sm font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <CardTitle className="text-gray-900 flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-gray-700" />
          Disk Usage Distribution
        </CardTitle>
        <CardDescription className="text-gray-600">
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
              label={renderCustomizedLabel}
              outerRadius={100}
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
                backgroundColor: "rgba(255, 255, 255, 0.98)",
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
              }}
              labelStyle={{ color: "#374151" }}
            />
            <Legend
              formatter={(value, entry: any) =>
                `${value}: ${entry.payload.formatted}`
              }
              wrapperStyle={{ color: "#374151" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
