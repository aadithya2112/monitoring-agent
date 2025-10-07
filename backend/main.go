package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"sync"
	"time"

	"monitoring-agent/handlers"
	"monitoring-agent/metrics"

	"github.com/gorilla/websocket"
)

var (
	upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true // Allow all origins for development
		},
	}
	clients   = make(map[*websocket.Conn]bool)
	clientsMu sync.Mutex
	broadcast = make(chan metrics.SystemMetrics)
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Start the metrics broadcaster
	go handleBroadcast()

	// Start periodic metrics collection
	go collectAndBroadcastMetrics()

	// Routes
	http.HandleFunc("/metrics", handlers.MetricsHandler)
	http.HandleFunc("/ws", handleWebSocket)
	http.HandleFunc("/health", healthHandler)

	log.Printf("Server starting on port %s", port)
	if err := http.ListenAndServe(":"+port, enableCORS(http.DefaultServeMux)); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("WebSocket upgrade error:", err)
		return
	}
	defer conn.Close()

	// Register client
	clientsMu.Lock()
	clients[conn] = true
	clientsMu.Unlock()

	log.Printf("New WebSocket connection. Total clients: %d", len(clients))

	// Send initial metrics
	m, err := metrics.Collect()
	if err == nil {
		if err := conn.WriteJSON(m); err != nil {
			log.Println("Error sending initial metrics:", err)
		}
	}

	// Keep connection alive and handle client messages
	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			clientsMu.Lock()
			delete(clients, conn)
			clientsMu.Unlock()
			log.Printf("Client disconnected. Total clients: %d", len(clients))
			break
		}
	}
}

func handleBroadcast() {
	for {
		metrics := <-broadcast
		clientsMu.Lock()
		for client := range clients {
			err := client.WriteJSON(metrics)
			if err != nil {
				log.Printf("WebSocket write error: %v", err)
				client.Close()
				delete(clients, client)
			}
		}
		clientsMu.Unlock()
	}
}

func collectAndBroadcastMetrics() {
	ticker := time.NewTicker(2 * time.Second)
	defer ticker.Stop()

	for range ticker.C {
		m, err := metrics.Collect()
		if err != nil {
			log.Println("Error collecting metrics:", err)
			continue
		}

		// Broadcast to all connected clients
		select {
		case broadcast <- m:
		default:
			// Channel full, skip this broadcast
		}
	}
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status": "healthy",
		"time":   time.Now().Format(time.RFC3339),
	})
}

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
