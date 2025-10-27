# macOS Docker Desktop Limitation

## 🚨 The Problem

You've discovered a fundamental limitation of Docker Desktop on macOS:

### Architecture on macOS

```
Your Mac (macOS)
    ↓
Docker Desktop (Hypervisor)
    ↓
Linux VM (lightweight)
    ↓
Docker Containers
```

When you mount `/proc`, `/sys`, or `/` into a container on macOS:

- ❌ You're NOT mounting your Mac's filesystem
- ✅ You're mounting the **Linux VM's** filesystem
- The Linux VM has limited resources (4GB RAM by default, small disk)

### What You're Actually Monitoring

Currently monitoring: **Docker Desktop's Linux VM**, not your Mac!

```
Container → Mounts → Linux VM → Shows VM's metrics (4GB RAM, 391MB disk)
                                  NOT your Mac's metrics
```

## 💡 Solutions

### Option 1: Run Natively (Recommended for Mac)

**Pros:**

- ✅ True host monitoring
- ✅ See your Mac's full resources
- ✅ Accurate CPU, memory, disk stats
- ✅ Simple, no Docker complexity

**How to use:**

```bash
# Terminal 1 - Backend
cd backend
go run main.go

# Terminal 2 - Frontend
cd web
pnpm dev
```

Access at: http://localhost:3000

### Option 2: Monitor Docker Desktop VM

Accept that you're monitoring Docker's VM and adjust expectations.

**What you'll see:**

- CPU: VM's CPU allocation
- Memory: ~4-8GB (VM limit, not Mac's full RAM)
- Disk: VM's disk (~400MB)
- OS: Linux (not macOS)

**To increase VM resources:**

1. Open Docker Desktop
2. Go to Settings → Resources
3. Increase:
   - CPUs: 2-4 cores
   - Memory: 8GB
   - Disk: 60GB+
4. Click "Apply & Restart"

Then rebuild:

```bash
docker-compose down
docker-compose up --build
```

### Option 3: Deploy to Linux Server

The Docker setup works **perfectly on Linux** because there's no VM layer.

On a Linux server, your container would see true host metrics.

### Option 4: Use Docker Stats API (Different Purpose)

Monitor Docker containers themselves instead of the host:

```bash
docker stats
```

This would require code changes to use Docker SDK.

## 🎯 Recommendation

For your use case (**monitoring your Mac during development**):

### Use Native Execution (Option 1)

This is the simplest and most accurate approach for local development.

```bash
# Stop Docker containers
docker-compose down

# Run natively
cd backend && go run main.go &
cd web && pnpm dev
```

## 📊 Comparison

| Metric  | Native on Mac        | Docker on Mac (Current) | Docker on Linux   |
| ------- | -------------------- | ----------------------- | ----------------- |
| CPU     | ✅ True Mac CPU      | ⚠️ VM CPU only          | ✅ True host CPU  |
| Memory  | ✅ 16GB+ (your Mac)  | ❌ 4GB (VM limit)       | ✅ True host RAM  |
| Disk    | ✅ 500GB+ (your Mac) | ❌ 400MB (VM)           | ✅ True host disk |
| OS Info | ✅ macOS             | ❌ Linux                | ✅ True Linux     |
| Uptime  | ✅ Mac uptime        | ❌ VM uptime            | ✅ Host uptime    |

## 🔧 Why Docker on Mac Is Different

**Linux/Windows:**

```
Container → Direct access → Host kernel → Real metrics ✅
```

**macOS:**

```
Container → Linux VM → Virtualized metrics → Not your Mac ❌
```

macOS doesn't have native container support, so Docker Desktop creates a Linux VM. Your containers run inside this VM, completely isolated from macOS.

## 📝 Summary

**The host monitoring setup is correct** - it works perfectly on Linux. The limitation is Docker Desktop's architecture on macOS.

**For your development needs:** Run the app natively without Docker to monitor your actual Mac.

**For production:** Deploy to a Linux server where Docker monitoring works as intended.
