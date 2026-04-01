package moltwall

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

const (
	defaultBaseURL = "https://www.moltwall.xyz"
	defaultTimeout = 10 * time.Second
	sdkVersion     = "0.1.0"
)

// Client is the MoltWall firewall client.
//
// Usage:
//
//	wall := moltwall.New("moltwall_live_...")
//
//	resp, err := wall.Check(ctx, moltwall.CheckRequest{
//	    AgentID: "my-agent",
//	    Action:  "transfer_funds",
//	    Tool:    "wallet",
//	    Args:    map[string]any{"amount": 100},
//	    Source:  moltwall.SourceUser,
//	})
//	if err != nil {
//	    log.Fatal(err)
//	}
//	if resp.Blocked() {
//	    log.Fatalf("blocked: %s", resp.Reason)
//	}
type Client struct {
	apiKey  string
	baseURL string
	http    *http.Client
}

// Option configures the Client.
type Option func(*Client)

// WithBaseURL overrides the default MoltWall API base URL.
func WithBaseURL(url string) Option {
	return func(c *Client) { c.baseURL = url }
}

// WithTimeout sets the HTTP timeout.
func WithTimeout(d time.Duration) Option {
	return func(c *Client) { c.http.Timeout = d }
}

// WithHTTPClient replaces the underlying HTTP client.
func WithHTTPClient(hc *http.Client) Option {
	return func(c *Client) { c.http = hc }
}

// New creates a configured MoltWall Client.
func New(apiKey string, opts ...Option) *Client {
	c := &Client{
		apiKey:  apiKey,
		baseURL: defaultBaseURL,
		http:    &http.Client{Timeout: defaultTimeout},
	}
	for _, o := range opts {
		o(c)
	}
	return c
}

// Check evaluates an agent action through the MoltWall firewall.
func (c *Client) Check(ctx context.Context, req CheckRequest) (*CheckResponse, error) {
	if req.Source == "" {
		req.Source = SourceAgent
	}

	start := time.Now()
	var resp CheckResponse
	if err := c.post(ctx, "/api/MoltWall/check", req, &resp); err != nil {
		return nil, err
	}
	resp.LatencyMs = float64(time.Since(start).Microseconds()) / 1000

	return &resp, nil
}

// CheckAndBlock is a convenience wrapper — returns BlockedError if the decision is deny.
func (c *Client) CheckAndBlock(ctx context.Context, req CheckRequest) (*CheckResponse, error) {
	resp, err := c.Check(ctx, req)
	if err != nil {
		return nil, err
	}
	if resp.Blocked() {
		return resp, &BlockedError{Response: resp}
	}
	return resp, nil
}

// RegisterTool registers a tool with MoltWall for policy enforcement.
func (c *Client) RegisterTool(ctx context.Context, req RegisterToolRequest) (map[string]any, error) {
	var result map[string]any
	if err := c.post(ctx, "/api/tools/register", req, &result); err != nil {
		return nil, err
	}
	return result, nil
}

// GetLogs fetches paginated audit logs.
func (c *Client) GetLogs(ctx context.Context, decision string, limit, offset int) (*LogsResponse, error) {
	path := fmt.Sprintf("/api/logs?limit=%d&offset=%d", limit, offset)
	if decision != "" {
		path += "&decision=" + decision
	}
	var result LogsResponse
	if err := c.get(ctx, path, &result); err != nil {
		return nil, err
	}
	return &result, nil
}

// ── internal helpers ─────────────────────────────────────────────────────────

func (c *Client) post(ctx context.Context, path string, body, out any) error {
	b, err := json.Marshal(body)
	if err != nil {
		return fmt.Errorf("moltwall: marshal: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.baseURL+path, bytes.NewReader(b))
	if err != nil {
		return fmt.Errorf("moltwall: request: %w", err)
	}
	c.setHeaders(req)

	return c.do(req, out)
}

func (c *Client) get(ctx context.Context, path string, out any) error {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, c.baseURL+path, nil)
	if err != nil {
		return fmt.Errorf("moltwall: request: %w", err)
	}
	c.setHeaders(req)
	return c.do(req, out)
}

func (c *Client) setHeaders(req *http.Request) {
	req.Header.Set("x-api-key", c.apiKey)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("User-Agent", "moltwall-go/"+sdkVersion)
}

func (c *Client) do(req *http.Request, out any) error {
	resp, err := c.http.Do(req)
	if err != nil {
		return fmt.Errorf("moltwall: http: %w", err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	if resp.StatusCode == http.StatusUnauthorized {
		return &AuthError{StatusCode: resp.StatusCode}
	}
	if resp.StatusCode >= 400 {
		return &APIError{StatusCode: resp.StatusCode, Body: string(body)}
	}

	if out != nil {
		if err := json.Unmarshal(body, out); err != nil {
			return fmt.Errorf("moltwall: decode: %w", err)
		}
	}
	return nil
}
