import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface MetricCardProps {
  title: string
  value: string
  subValue: string
  color: string
  percentage: number | null
  icon?: React.ReactNode
}

export default function MetricCard({
  title,
  value,
  subValue,
  color,
  percentage,
  icon,
}: MetricCardProps) {
  const getStatusColor = (percent: number | null) => {
    if (percent === null) return "default"
    if (percent > 90) return "destructive"
    if (percent > 75) return "secondary"
    return "default"
  }

  return (
    <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-slate-700 hover:border-slate-600 transition-all hover:shadow-lg backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-300">
          {title}
        </CardTitle>
        {icon && <div className="text-gray-400">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between mb-2">
          <div className="text-3xl font-bold text-white">{value}</div>
          {percentage !== null && (
            <Badge variant={getStatusColor(percentage)} className="ml-2">
              {percentage.toFixed(1)}%
            </Badge>
          )}
        </div>
        <p className="text-xs text-gray-400 mb-3">{subValue}</p>
        {percentage !== null && (
          <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full ${color} transition-all duration-500 ease-out`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
