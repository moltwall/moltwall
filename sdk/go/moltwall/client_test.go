package moltwall_test

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/moltwall/sdk-go/moltwall"
)

func mockServer(t *testing.T, decision moltwall.DecisionType, riskScore float64) *httptest.Server {
	t.Helper()
	return httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Validate API key header
		if r.Header.Get("x-api-key") == "" {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(map[string]any{
			"decision":   decision,
			"risk_score": riskScore,
			"reason":     "test decision",
			"action_id":  "test-action-id",
		})
	}))
}

func TestCheck_Allow(t *testing.T) {
	srv := mockServer(t, moltwall.DecisionAllow, 0.1)
	defer srv.Close()

	wall := moltwall.New("test-key", moltwall.WithBaseURL(srv.URL))
	resp, err := wall.Check(context.Background(), moltwall.CheckRequest{
		AgentID: "agent-1",
		Action:  "read_file",
		Tool:    "fs",
		Source:  moltwall.SourceUser,
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !resp.Allowed() {
		t.Errorf("expected allow, got %s", resp.Decision)
	}
	if resp.LatencyMs <= 0 {
		t.Error("expected positive latency")
	}
}

func TestCheck_Deny(t *testing.T) {
	srv := mockServer(t, moltwall.DecisionDeny, 0.92)
	defer srv.Close()

	wall := moltwall.New("test-key", moltwall.WithBaseURL(srv.URL))
	resp, err := wall.CheckAndBlock(context.Background(), moltwall.CheckRequest{
		AgentID: "agent-1",
		Action:  "transfer_funds",
		Tool:    "wallet",
	})

	var blocked *moltwall.BlockedError
	if err == nil {
		t.Fatal("expected BlockedError, got nil")
	}
	if !errorAs(err, &blocked) {
		t.Fatalf("expected *BlockedError, got %T", err)
	}
	if resp.Decision != moltwall.DecisionDeny {
		t.Errorf("expected deny, got %s", resp.Decision)
	}
}

func TestCheck_AuthError(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusUnauthorized)
	}))
	defer srv.Close()

	wall := moltwall.New("bad-key", moltwall.WithBaseURL(srv.URL))
	_, err := wall.Check(context.Background(), moltwall.CheckRequest{
		AgentID: "a", Action: "x", Tool: "y",
	})

	var authErr *moltwall.AuthError
	if !errorAs(err, &authErr) {
		t.Fatalf("expected *AuthError, got %T: %v", err, err)
	}
}

// errorAs is a simple helper to avoid importing errors in older Go versions.
func errorAs[T error](err error, target *T) bool {
	if err == nil {
		return false
	}
	if e, ok := err.(T); ok {
		*target = e
		return true
	}
	return false
}
