package handlers

import (
	"encoding/json"
	"log"
	"net/http"

	"monitoring-agent/metrics"
)

// MetricsHandler handles the /metrics endpoint
func MetricsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	m, err := metrics.Collect()
	if err != nil {
		log.Println("Error collecting metrics:", err)
		http.Error(w, "Failed to collect metrics", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(m); err != nil {
		log.Println("Error encoding metrics:", err)
		http.Error(w, "Failed to encode metrics", http.StatusInternalServerError)
	}
}
