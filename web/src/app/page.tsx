"use client"

import { useEffect, useState } from "react"
import MetricCard from "@/components/MetricCard"
import CPUChart from "@/components/CPUChart"
import MemoryChart from "@/components/MemoryChart"
import DiskChart from "@/components/DiskChart"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Cpu,
  MemoryStick,
  HardDrive,
  Clock,
  Activity,
  Server,
  Wifi,
  WifiOff,
} from "lucide-react"

interface SystemMetrics {
  timestamp: string
  cpu: {
    usagePercent: number
    cores: number
  }
  memory: {
    total: number
    used: number
    available: number
    usedPercent: number
  }
  disk: {
    total: number
    used: number
    free: number
    usedPercent: number
  }
  system: {
    os: string
    platform: string
    platformVersion: string
    hostname: string
    goVersion: string
  }
  uptime: number
  uptimeHuman: string
}

export default function Home() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<SystemMetrics[]>([])

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080"
    let ws: WebSocket | null = null
    let reconnectTimer: NodeJS.Timeout

    const connect = () => {
      try {
        ws = new WebSocket(`${wsUrl}/ws`)

        ws.onopen = () => {
          console.log("WebSocket connected")
          setConnected(true)
          setError(null)
        }

        ws.onmessage = (event) => {
          try {
            const data: SystemMetrics = JSON.parse(event.data)
            setMetrics(data)
            setHistory((prev) => {
              const newHistory = [...prev, data].slice(-20) // Keep last 20 data points
              return newHistory
            })
          } catch (err) {
            console.error("Error parsing message:", err)
          }
        }

        ws.onerror = (error) => {
          console.error("WebSocket error:", error)
          setError("Connection error")
        }

        ws.onclose = () => {
          console.log("WebSocket disconnected")
          setConnected(false)
          // Attempt to reconnect after 3 seconds
          reconnectTimer = setTimeout(connect, 3000)
        }
      } catch (err) {
        console.error("Error creating WebSocket:", err)
        setError("Failed to connect")
        reconnectTimer = setTimeout(connect, 3000)
      }
    }

    connect()

    return () => {
      if (reconnectTimer) clearTimeout(reconnectTimer)
      if (ws) {
        ws.close()
      }
    }
  }, [])

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Activity className="w-8 h-8 text-gray-700" />
                System Monitor
              </h1>
              {metrics && (
                <p className="text-gray-600 text-sm flex items-center gap-2">
                  <Server className="w-4 h-4" />
                  {metrics.system.hostname} • {metrics.system.os} •{" "}
                  {metrics.system.platform}
                </p>
              )}
            </div>
            <Badge
              variant={connected ? "default" : "destructive"}
              className="flex items-center gap-2 px-4 py-2 text-sm"
            >
              {connected ? (
                <Wifi className="w-4 h-4" />
              ) : (
                <WifiOff className="w-4 h-4" />
              )}
              {connected ? "Connected" : error || "Disconnected"}
            </Badge>
          </div>
          <Separator className="bg-gray-200" />
        </div>

        {metrics ? (
          <>
            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
              <MetricCard
                title="CPU Usage"
                value={`${metrics.cpu.usagePercent.toFixed(1)}%`}
                subValue={`${metrics.cpu.cores} cores available`}
                color="bg-gray-700"
                percentage={metrics.cpu.usagePercent}
                icon={<Cpu className="w-5 h-5" />}
              />
              <MetricCard
                title="Memory Usage"
                value={`${metrics.memory.usedPercent.toFixed(1)}%`}
                subValue={`${formatBytes(metrics.memory.used)} / ${formatBytes(
                  metrics.memory.total
                )}`}
                color="bg-gray-600"
                percentage={metrics.memory.usedPercent}
                icon={<MemoryStick className="w-5 h-5" />}
              />
              <MetricCard
                title="Disk Usage"
                value={`${metrics.disk.usedPercent.toFixed(1)}%`}
                subValue={`${formatBytes(metrics.disk.used)} / ${formatBytes(
                  metrics.disk.total
                )}`}
                color="bg-gray-500"
                percentage={metrics.disk.usedPercent}
                icon={<HardDrive className="w-5 h-5" />}
              />
              <MetricCard
                title="System Uptime"
                value={metrics.uptimeHuman}
                subValue={`${metrics.uptime.toLocaleString()} seconds`}
                color="bg-gray-400"
                percentage={null}
                icon={<Clock className="w-5 h-5" />}
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
              <CPUChart data={history} />
              <MemoryChart data={history} />
            </div>

            <div className="mb-6">
              <DiskChart data={metrics} />
            </div>

            {/* System Info */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  System Information
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Detailed information about your system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-gray-500 text-xs uppercase tracking-wide">
                      Hostname
                    </p>
                    <p className="font-semibold text-gray-900">
                      {metrics.system.hostname}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500 text-xs uppercase tracking-wide">
                      Operating System
                    </p>
                    <p className="font-semibold text-gray-900">
                      {metrics.system.os}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500 text-xs uppercase tracking-wide">
                      Platform
                    </p>
                    <p className="font-semibold text-gray-900">
                      {metrics.system.platform}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500 text-xs uppercase tracking-wide">
                      Platform Version
                    </p>
                    <p className="font-semibold text-gray-900">
                      {metrics.system.platformVersion}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500 text-xs uppercase tracking-wide">
                      Go Version
                    </p>
                    <p className="font-semibold text-gray-900">
                      {metrics.system.goVersion}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500 text-xs uppercase tracking-wide">
                      Last Update
                    </p>
                    <p className="font-semibold text-gray-900">
                      {new Date(metrics.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="text-center text-gray-900 py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700 mb-4"></div>
            <p className="text-gray-600">Loading metrics...</p>
          </div>
        )}
      </div>
    </main>
  )
}
