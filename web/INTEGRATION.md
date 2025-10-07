# Frontend Integration Guide

## Setup Instructions

Since you already have a Next.js starter app in the `web` folder, follow these steps to integrate the monitoring dashboard:

### 1. Install Required Dependencies

```bash
cd web
npm install recharts
# or if using pnpm
pnpm add recharts
```

### 2. Configure Environment Variables

Create a `.env.local` file in the `web` folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=ws://localhost:8080
```

### 3. Update Next.js Configuration

Make sure your `next.config.js` has the standalone output configuration for Docker:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
}

module.exports = nextConfig
```

### 4. Ensure Tailwind CSS is Configured

Your existing setup should already have Tailwind CSS. If not, install it:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 5. File Structure

The following files have been created for you:

- `src/components/MetricCard.tsx` - Displays individual metric cards
- `src/components/CPUChart.tsx` - CPU usage chart
- `src/components/MemoryChart.tsx` - Memory usage chart
- `src/components/DiskChart.tsx` - Disk usage pie chart
- `src/app/page.tsx` - Main dashboard page (replace your existing one)

### 6. Run the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

### 7. Docker Deployment

To use the provided Dockerfile, copy it to your web folder:

```bash
cp ../frontend/Dockerfile ./
cp ../frontend/.dockerignore ./
```

Then update the docker-compose.yml to point to `./web` instead of `./frontend`.

### 8. Connect to Backend

Make sure the Go backend is running on port 8080 before starting the frontend. The WebSocket connection will automatically attempt to connect and reconnect if the connection is lost.

## Troubleshooting

- If you see import errors, make sure `recharts` is installed
- If WebSocket doesn't connect, verify the backend is running and CORS is enabled
- Check the browser console for any connection errors
- Ensure the environment variables are set correctly
