#!/bin/bash

echo "🔍 Comparing Docker vs Native Metrics"
echo "======================================"
echo ""

echo "💻 YOUR MAC (Native System):"
echo "----------------------------"
echo "CPU Cores: $(sysctl -n hw.ncpu)"
echo "Memory: $(sysctl -n hw.memsize | awk '{print $1/1024/1024/1024 " GB"}')"
echo "Disk: $(df -h / | tail -1 | awk '{print $2}')"
echo "OS: $(sw_vers -productName) $(sw_vers -productVersion)"
echo ""

echo "🐳 DOCKER CONTAINER (What it sees):"
echo "-----------------------------------"
if docker ps | grep -q monitoring-backend; then
    echo "CPU Cores: $(docker exec monitoring-backend nproc)"
    echo "Memory: $(docker exec monitoring-backend cat /proc/meminfo | grep MemTotal | awk '{print $2/1024/1024 " GB"}')"
    echo "Disk: $(docker exec monitoring-backend df -h /hostfs | tail -1 | awk '{print $2}')"
    echo "OS: $(docker exec monitoring-backend cat /etc/os-release 2>/dev/null | grep PRETTY_NAME | cut -d'"' -f2)"
    echo ""
    echo "📊 Current Metrics from API:"
    echo "----------------------------"
    curl -s http://localhost:8080/metrics 2>/dev/null | python3 -m json.tool 2>/dev/null | grep -A2 -E '"(cpu|memory|disk|system)"' || echo "Backend not responding"
else
    echo "❌ Container not running"
    echo "Run: docker-compose up -d"
fi

echo ""
echo "⚠️  NOTICE:"
echo "Docker on macOS runs in a Linux VM, so the container sees VM metrics, not your Mac's true resources."
echo ""
echo "For accurate Mac monitoring, run natively:"
echo "  cd backend && go run main.go"
echo "  cd web && pnpm dev"
