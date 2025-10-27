#!/bin/bash

# Test script to validate host monitoring implementation

echo "🧪 Testing Host Monitoring Implementation"
echo "=========================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi
echo "✅ Docker is running"

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose not found"
    exit 1
fi
echo "✅ docker-compose is available"

# Check if containers are running
echo ""
echo "📦 Checking container status..."
if docker ps | grep -q "monitoring-backend"; then
    echo "✅ Backend container is running"
    
    # Test volume mounts
    echo ""
    echo "🔍 Verifying volume mounts..."
    
    if docker exec monitoring-backend test -d /host/proc; then
        echo "✅ /host/proc is mounted"
    else
        echo "❌ /host/proc is NOT mounted"
    fi
    
    if docker exec monitoring-backend test -d /host/sys; then
        echo "✅ /host/sys is mounted"
    else
        echo "❌ /host/sys is NOT mounted"
    fi
    
    if docker exec monitoring-backend test -d /hostfs; then
        echo "✅ /hostfs is mounted"
    else
        echo "❌ /hostfs is NOT mounted"
    fi
    
    # Test environment variables
    echo ""
    echo "🔍 Verifying environment variables..."
    
    if docker exec monitoring-backend env | grep -q "HOST_PROC=/host/proc"; then
        echo "✅ HOST_PROC is set"
    else
        echo "❌ HOST_PROC is NOT set"
    fi
    
    if docker exec monitoring-backend env | grep -q "HOST_SYS=/host/sys"; then
        echo "✅ HOST_SYS is set"
    else
        echo "❌ HOST_SYS is NOT set"
    fi
    
    # Test API endpoint
    echo ""
    echo "🔍 Testing API endpoint..."
    
    if curl -s http://localhost:8080/metrics > /dev/null; then
        echo "✅ Backend API is responding"
        
        # Get sample metrics
        echo ""
        echo "📊 Sample metrics:"
        curl -s http://localhost:8080/metrics | jq '.cpu, .memory, .disk' 2>/dev/null || echo "Install jq for formatted output: brew install jq"
    else
        echo "❌ Backend API is NOT responding"
    fi
    
else
    echo "❌ Backend container is NOT running"
    echo ""
    echo "To start the containers, run:"
    echo "  docker-compose up -d --build"
fi

# Check frontend
echo ""
if docker ps | grep -q "monitoring-frontend"; then
    echo "✅ Frontend container is running"
    
    if curl -s http://localhost:3000 > /dev/null; then
        echo "✅ Frontend is responding"
        echo "🌐 Dashboard available at: http://localhost:3000"
    else
        echo "⏳ Frontend is starting up... (may take a few moments)"
    fi
else
    echo "❌ Frontend container is NOT running"
fi

echo ""
echo "=========================================="
echo "Test complete!"
echo ""
echo "Quick commands:"
echo "  Start:  docker-compose up -d --build"
echo "  Logs:   docker-compose logs -f"
echo "  Stop:   docker-compose down"
echo "  Status: docker-compose ps"
