// Package moltwall provides a Go client for the MoltWall AI agent security firewall.
package moltwall

// DecisionType represents a firewall decision.
type DecisionType string

const (
	DecisionAllow              DecisionType = "allow"
	DecisionDeny               DecisionType = "deny"
	DecisionSandbox            DecisionType = "sandbox"
	DecisionRequireConfirmation DecisionType = "require_confirmation"
)

// RiskLevel represents the risk classification of a registered tool.
type RiskLevel string

const (
	RiskLow      RiskLevel = "low"
	RiskMedium   RiskLevel = "medium"
	RiskHigh     RiskLevel = "high"
	RiskCritical RiskLevel = "critical"
)

// SourceType identifies who or what triggered an agent action.
type SourceType string

const (
	SourceUser      SourceType = "user"
	SourceAgent     SourceType = "agent"
	SourceSystem    SourceType = "system"
	SourceExternal  SourceType = "external"
	SourceDeveloper SourceType = "developer"
)

// CheckRequest is the payload sent to the MoltWall firewall.
type CheckRequest struct {
	AgentID    string         `json:"agent_id"`
	Action     string         `json:"action"`
	Tool       string         `json:"tool"`
	Args       map[string]any `json:"args,omitempty"`
	Source     SourceType     `json:"source"`
	UserIntent string         `json:"user_intent,omitempty"`
	Context    map[string]any `json:"context,omitempty"`
}

// CheckResponse is the decision returned by the MoltWall firewall.
type CheckResponse struct {
	Decision      DecisionType `json:"decision"`
	RiskScore     float64      `json:"risk_score"`
	Reason        string       `json:"reason"`
	ActionID      string       `json:"action_id"`
	LatencyMs     float64      `json:"-"` // populated by client
	GuardrailFlags []string    `json:"guardrail_flags,omitempty"`
	PolicyMatched string       `json:"policy_matched,omitempty"`
}

// Allowed returns true if the firewall approved the action.
func (r *CheckResponse) Allowed() bool {
	return r.Decision == DecisionAllow
}

// Blocked returns true if the firewall denied the action.
func (r *CheckResponse) Blocked() bool {
	return r.Decision == DecisionDeny
}

// RegisterToolRequest is the payload for registering a tool.
type RegisterToolRequest struct {
	ToolID      string    `json:"tool_id"`
	Publisher   string    `json:"publisher"`
	RiskLevel   RiskLevel `json:"risk_level"`
	Permissions []string  `json:"permissions,omitempty"`
	Description string    `json:"description,omitempty"`
}

// ActionLog is a single audit log entry.
type ActionLog struct {
	ActionID  string         `json:"action_id"`
	AgentID   string         `json:"agent_id"`
	Tool      string         `json:"tool"`
	Action    string         `json:"action"`
	Decision  DecisionType   `json:"decision"`
	RiskScore float64        `json:"risk_score"`
	Reason    string         `json:"reason"`
	Source    SourceType     `json:"source"`
	Timestamp string         `json:"timestamp"`
	Args      map[string]any `json:"args,omitempty"`
}

// LogsResponse wraps the paginated logs API response.
type LogsResponse struct {
	Logs  []ActionLog `json:"logs"`
	Total int         `json:"total"`
}
