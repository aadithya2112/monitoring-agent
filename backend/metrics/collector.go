package metrics

import (
	"os"
	"runtime"
	"time"

	"github.com/shirou/gopsutil/v3/cpu"
	"github.com/shirou/gopsutil/v3/disk"
	"github.com/shirou/gopsutil/v3/host"
	"github.com/shirou/gopsutil/v3/mem"
)

// SystemMetrics represents the system metrics
type SystemMetrics struct {
	Timestamp   time.Time   `json:"timestamp"`
	CPU         CPUMetrics  `json:"cpu"`
	Memory      MemMetrics  `json:"memory"`
	Disk        DiskMetrics `json:"disk"`
	System      SysMetrics  `json:"system"`
	Uptime      uint64      `json:"uptime"`
	UptimeHuman string      `json:"uptimeHuman"`
}

// CPUMetrics represents CPU usage
type CPUMetrics struct {
	UsagePercent float64 `json:"usagePercent"`
	Cores        int     `json:"cores"`
}

// MemMetrics represents memory usage
type MemMetrics struct {
	Total       uint64  `json:"total"`
	Used        uint64  `json:"used"`
	Available   uint64  `json:"available"`
	UsedPercent float64 `json:"usedPercent"`
}

// DiskMetrics represents disk usage
type DiskMetrics struct {
	Total       uint64  `json:"total"`
	Used        uint64  `json:"used"`
	Free        uint64  `json:"free"`
	UsedPercent float64 `json:"usedPercent"`
}

// SysMetrics represents system information
type SysMetrics struct {
	OS              string `json:"os"`
	Platform        string `json:"platform"`
	PlatformVersion string `json:"platformVersion"`
	Hostname        string `json:"hostname"`
	GoVersion       string `json:"goVersion"`
}

// Collect gathers all system metrics
func Collect() (SystemMetrics, error) {
	var m SystemMetrics
	m.Timestamp = time.Now()

	// CPU metrics
	cpuPercent, err := cpu.Percent(time.Second, false)
	if err != nil {
		return m, err
	}
	if len(cpuPercent) > 0 {
		m.CPU.UsagePercent = cpuPercent[0]
	}
	m.CPU.Cores = runtime.NumCPU()

	// Memory metrics
	vmStat, err := mem.VirtualMemory()
	if err != nil {
		return m, err
	}
	m.Memory.Total = vmStat.Total
	m.Memory.Used = vmStat.Used
	m.Memory.Available = vmStat.Available
	m.Memory.UsedPercent = vmStat.UsedPercent

	// Disk metrics - use host filesystem if running in container
	diskPath := "/"
	// Check if running in container with mounted host filesystem
	if _, err := os.Stat("/hostfs"); err == nil {
		diskPath = "/hostfs"
	}

	diskStat, err := disk.Usage(diskPath)
	if err != nil {
		return m, err
	}
	m.Disk.Total = diskStat.Total
	m.Disk.Used = diskStat.Used
	m.Disk.Free = diskStat.Free
	m.Disk.UsedPercent = diskStat.UsedPercent

	// System uptime
	uptime, err := host.Uptime()
	if err == nil {
		m.Uptime = uptime
		m.UptimeHuman = formatUptime(uptime)
	}

	// System info
	hostInfo, err := host.Info()
	if err == nil {
		m.System.OS = hostInfo.OS
		m.System.Platform = hostInfo.Platform
		m.System.PlatformVersion = hostInfo.PlatformVersion
		m.System.Hostname = hostInfo.Hostname
	}
	m.System.GoVersion = runtime.Version()

	return m, nil
}

// formatUptime converts seconds to human-readable format
func formatUptime(seconds uint64) string {
	days := seconds / 86400
	hours := (seconds % 86400) / 3600
	minutes := (seconds % 3600) / 60
	secs := seconds % 60

	if days > 0 {
		return formatDuration(days, hours, minutes, secs, "d")
	} else if hours > 0 {
		return formatDuration(hours, minutes, secs, 0, "h")
	} else if minutes > 0 {
		return formatDuration(minutes, secs, 0, 0, "m")
	}
	return formatDuration(secs, 0, 0, 0, "s")
}

func formatDuration(v1, v2, v3, v4 uint64, unit string) string {
	switch unit {
	case "d":
		return sprintf("%dd %dh %dm", v1, v2, v3)
	case "h":
		return sprintf("%dh %dm %ds", v1, v2, v3)
	case "m":
		return sprintf("%dm %ds", v1, v2)
	default:
		return sprintf("%ds", v1)
	}
}

func sprintf(format string, args ...interface{}) string {
	switch format {
	case "%dd %dh %dm":
		return formatString(args[0].(uint64), "d ", args[1].(uint64), "h ", args[2].(uint64), "m")
	case "%dh %dm %ds":
		return formatString(args[0].(uint64), "h ", args[1].(uint64), "m ", args[2].(uint64), "s")
	case "%dm %ds":
		return formatString(args[0].(uint64), "m ", args[1].(uint64), "s")
	case "%ds":
		return formatString(args[0].(uint64), "s")
	}
	return ""
}

func formatString(parts ...interface{}) string {
	result := ""
	for i := 0; i < len(parts); i += 2 {
		if i+1 < len(parts) {
			num := parts[i].(uint64)
			unit := parts[i+1].(string)
			result += itoa(int(num)) + unit
		}
	}
	return result
}

func itoa(n int) string {
	if n == 0 {
		return "0"
	}
	neg := n < 0
	if neg {
		n = -n
	}
	var buf [20]byte
	i := len(buf) - 1
	for n > 0 {
		buf[i] = byte('0' + n%10)
		n /= 10
		i--
	}
	if neg {
		buf[i] = '-'
		i--
	}
	return string(buf[i+1:])
}
