# Quick Start Guide

## ✅ Installation Complete!

All packages have been successfully installed:

- **Backend (Go)**: All dependencies downloaded and verified
- **Frontend (Web)**: recharts and all dependencies installed

## 🚀 Running the Application

### Option 1: Local Development (Recommended for Development)

#### Terminal 1 - Start Backend:

```bash
cd backend
go run main.go
```

Backend will run on: http://localhost:8080

#### Terminal 2 - Start Frontend:

```bash
cd web
pnpm dev
```

Frontend will run on: http://localhost:3000

### Option 2: Docker (Recommended for Production)

```bash
# From project root
docker-compose up --build
```

Access:

- **Dashboard**: http://localhost:3000
- **API**: http://localhost:8080/metrics
- **WebSocket**: ws://localhost:8080/ws

## 🔧 Environment Setup

### Frontend Environment Variables

Create `web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=ws://localhost:8080
```

## 📊 Features

The dashboard displays:

- **Real-time CPU Usage** - Live chart showing CPU percentage
- **Memory Usage** - Current memory consumption with history
- **Disk Usage** - Pie chart of disk space distribution
- **System Uptime** - How long the system has been running
- **System Information** - OS, platform, hostname details

## 🧪 Testing the API

```bash
# Get current metrics (REST API)
curl http://localhost:8080/metrics

# Health check
curl http://localhost:8080/health
```

## 📁 Project Structure

```
monitoring-agent/
├── backend/                # Go backend
│   ├── main.go            # Main server with WebSocket
│   ├── handlers/          # HTTP handlers
│   │   └── metrics.go
│   ├── metrics/           # System metrics collection
│   │   └── collector.go
│   ├── go.mod & go.sum    # Go dependencies
│   └── Dockerfile
│
├── web/                   # Next.js frontend
│   ├── src/
│   │   ├── app/          # Next.js pages
│   │   │   └── page.tsx  # Main dashboard
│   │   └── components/   # React components
│   │       ├── MetricCard.tsx
│   │       ├── CPUChart.tsx
│   │       ├── MemoryChart.tsx
│   │       └── DiskChart.tsx
│   ├── package.json
│   └── Dockerfile
│
└── docker-compose.yml     # Container orchestration
```

## 🎯 Next Steps

1. Start both services (see "Running the Application" above)
2. Open http://localhost:3000 in your browser
3. Watch the real-time metrics update every 2 seconds!

## 💡 Tips

- WebSocket auto-reconnects if connection is lost
- Metrics update every 2 seconds by default
- Dashboard keeps last 20 data points for charts
- All CORS headers are configured for local development

Enjoy your monitoring dashboard! 🚀
