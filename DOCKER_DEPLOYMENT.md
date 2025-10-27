# Docker Deployment Guide

This guide explains how to run the monitoring agent in Docker containers while monitoring the **host machine** (your Mac).

## 🏗️ Architecture

The monitoring agent runs in Docker containers but monitors your **actual host machine** resources by:

- Mounting host system paths (`/proc`, `/sys`, `/etc`)
- Using privileged mode to access host metrics
- Running in host PID namespace for accurate process information

## 📋 Prerequisites

- Docker Desktop installed and running
- Docker Compose available

## 🚀 Quick Start

### 1. Build and Start

```bash
# Build and start all services
docker-compose up --build

# Or run in background (detached mode)
docker-compose up -d --build
```

### 2. Access the Application

- **Frontend Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:8080/metrics
- **WebSocket**: ws://localhost:8080/ws

### 3. Stop the Services

```bash
# Stop and remove containers
docker-compose down

# Stop, remove containers, and remove volumes
docker-compose down -v
```

## 📊 What Gets Monitored

The agent monitors your **host machine** (Mac), not the containers themselves:

- ✅ **CPU Usage**: Real CPU usage of your Mac
- ✅ **Memory**: Actual RAM usage of your Mac
- ✅ **Disk**: Host filesystem usage (entire Mac disk)
- ✅ **System Info**: macOS version, hostname, uptime
- ✅ **Uptime**: Your Mac's actual uptime

## 🔧 Configuration

### Environment Variables

**Backend (`docker-compose.yml`):**

```yaml
environment:
  - PORT=8080 # Backend API port
  - METRICS_INTERVAL=2 # Metrics collection interval (seconds)
  - HOST_PROC=/host/proc # Host /proc mount point
  - HOST_SYS=/host/sys # Host /sys mount point
  - HOST_ETC=/host/etc # Host /etc mount point
```

**Frontend (`docker-compose.yml`):**

```yaml
environment:
  - NEXT_PUBLIC_API_URL=http://localhost:8080
  - NEXT_PUBLIC_WS_URL=ws://localhost:8080
```

### Volume Mounts

The backend container mounts these host paths (read-only):

```yaml
volumes:
  - /proc:/host/proc:ro # Process/CPU information
  - /sys:/host/sys:ro # Kernel/system information
  - /etc:/host/etc:ro # Host configuration
  - /:/hostfs:ro # Root filesystem for disk metrics
```

### Security Settings

```yaml
privileged: true # Required for accessing host system metrics
pid: "host" # Use host PID namespace for accurate monitoring
```

## 🛠️ Development vs Production

### Development (Local)

For local development without Docker:

```bash
# Terminal 1 - Backend
cd backend
go run main.go

# Terminal 2 - Frontend
cd web
pnpm dev
```

### Production (Docker)

For production deployment, use the Docker Compose setup as described above.

## 📝 Useful Commands

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Rebuild Specific Service

```bash
# Rebuild backend only
docker-compose up -d --build backend

# Rebuild frontend only
docker-compose up -d --build frontend
```

### Check Container Status

```bash
# List running containers
docker-compose ps

# View container resource usage
docker stats monitoring-backend monitoring-frontend
```

### Health Checks

Both services have health checks configured:

```bash
# Check backend health
curl http://localhost:8080/metrics

# Check frontend health
curl http://localhost:3000
```

## 🐛 Troubleshooting

### Port Already in Use

If you get "port already in use" errors:

```bash
# Find what's using port 8080
lsof -i :8080

# Find what's using port 3000
lsof -i :3000

# Kill the process or stop your local dev servers
```

### Container Can't Access Host Metrics

Ensure:

1. Docker Desktop is running
2. Volume mounts are correctly configured
3. Privileged mode is enabled

### Build Failures

```bash
# Clean rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up
```

## 📦 Image Sizes

- **Backend**: ~20MB (Alpine-based Go binary)
- **Frontend**: ~300MB (Node.js with Next.js standalone build)

## 🔒 Security Notes

- Volume mounts are **read-only** (`:ro`) for security
- Privileged mode is required for host monitoring
- In production, consider additional security measures
- Network is isolated with bridge driver

## 🎯 Next Steps

- Configure alerts/thresholds
- Add more metrics (network, processes)
- Set up persistent storage for historical data
- Deploy to cloud platforms (AWS, Azure, GCP)
- Add authentication/authorization

## 📚 Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [gopsutil Library](https://github.com/shirou/gopsutil)
- [Next.js Docker Deployment](https://nextjs.org/docs/deployment#docker-image)
