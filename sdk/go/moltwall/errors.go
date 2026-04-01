package moltwall

import "fmt"

// BlockedError is returned when the firewall denies an action.
type BlockedError struct {
	Response *CheckResponse
}

func (e *BlockedError) Error() string {
	return fmt.Sprintf("[MoltWall] action blocked (risk=%.2f): %s", e.Response.RiskScore, e.Response.Reason)
}

// AuthError is returned on an invalid or expired API key.
type AuthError struct {
	StatusCode int
}

func (e *AuthError) Error() string {
	return fmt.Sprintf("[MoltWall] authentication failed (HTTP %d): check your API key", e.StatusCode)
}

// APIError is returned for any non-auth HTTP error from the firewall.
type APIError struct {
	StatusCode int
	Body       string
}

func (e *APIError) Error() string {
	return fmt.Sprintf("[MoltWall] API error %d: %s", e.StatusCode, e.Body)
}
