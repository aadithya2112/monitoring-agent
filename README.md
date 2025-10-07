# Lightweight Containerized System Monitoring Agent

A real-time system monitoring dashboard with a Go backend and Next.js frontend, fully containerized with Docker.

## Features

- **Real-time Monitoring**: WebSocket-based live updates
- **System Metrics**: CPU, Memory, Disk usage, and System uptime
- **REST API**: HTTP endpoint for metrics polling
- **Interactive Dashboard**: Charts and gauges for visualization
- **Containerized**: Docker-ready with docker-compose orchestration

## Project Structure

```
monitoring-agent/
├── backend/                 # Go backend
│   ├── main.go             # Main application entry
│   ├── handlers/           # HTTP & WebSocket handlers
│   ├── metrics/            # System metrics collection
│   ├── go.mod              # Go dependencies
│   ├── go.sum
│   └── Dockerfile
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # Next.js app directory
│   │   └── components/    # React components
│   ├── package.json
│   ├── next.config.js
│   └── Dockerfile
├── docker-compose.yml      # Docker orchestration
└── README.md
```

## Prerequisites

### For Local Development

- Go 1.21 or higher
- Node.js 18+ and npm
- Git

### For Docker Deployment

- Docker 20.10+
- Docker Compose 2.0+

## Local Development

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install Go dependencies:

```bash
go mod download
```

3. Run the backend:

```bash
go run main.go
```

The backend will start on `http://localhost:8080`

**API Endpoints:**

- `GET /metrics` - Get current system metrics (JSON)
- `GET /ws` - WebSocket connection for real-time metrics

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## Docker Deployment

### Quick Start

1. Build and start all services:

```bash
docker-compose up --build
```

2. Access the application:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

### Docker Commands

```bash
# Build and start in detached mode
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild specific service
docker-compose up -d --build backend
docker-compose up -d --build frontend

# Remove volumes (clean slate)
docker-compose down -v
```

## Environment Variables

### Backend

- `PORT` - Server port (default: 8080)
- `METRICS_INTERVAL` - Metrics collection interval in seconds (default: 2)

### Frontend

- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:8080)
- `NEXT_PUBLIC_WS_URL` - Backend WebSocket URL (default: ws://localhost:8080)

## Architecture

### Backend (Go)

- **Framework**: Standard library with Gorilla WebSocket
- **Metrics**: gopsutil for system information
- **Concurrency**: Goroutines for WebSocket broadcasting
- **CORS**: Enabled for frontend communication

### Frontend (Next.js)

- **Framework**: Next.js 14 with App Router
- **Charts**: Recharts for data visualization
- **WebSocket**: Native WebSocket API
- **Styling**: Tailwind CSS

## Development Notes

- The backend uses WebSocket broadcasting to push metrics to all connected clients every 2 seconds
- The frontend automatically reconnects if the WebSocket connection is lost
- Docker volumes are used for development hot-reloading (commented out in docker-compose.yml)
- Health checks are configured in docker-compose for service monitoring

## Troubleshooting

### Backend not collecting metrics

- Ensure the application has proper permissions to read system information
- On macOS/Linux, some metrics may require elevated privileges

### WebSocket connection failed

- Check that both services are running
- Verify CORS settings in the backend
- Check browser console for connection errors

### Docker build issues

- Clear Docker cache: `docker-compose build --no-cache`
- Ensure Docker daemon is running
- Check Docker logs: `docker-compose logs`

## Future Enhancements

- [ ] Historical data storage (e.g., InfluxDB)
- [ ] Multiple host monitoring
- [ ] Alert/notification system
- [ ] Authentication and authorization
- [ ] Custom metric collection
- [ ] Export metrics to Prometheus format

## License

MIT
