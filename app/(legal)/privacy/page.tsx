import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy · MoltWall",
  description: "MoltWall Privacy Policy — how we collect, use, store, and protect your data on the AI Agent Security Firewall platform.",
};

const EFFECTIVE_DATE = "March 19, 2026";
const COMPANY = "MoltWall";
const DOMAIN = "www.moltwall.xyz";
const CONTACT_EMAIL = "privacy@moltwall.xyz";
const DPA_EMAIL = "legal@moltwall.xyz";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">

      {/* Header */}
      <div className="mb-12 pb-8 border-b border-[#1a1a1a]">
        <p className="text-[11px] font-bold tracking-[0.25em] text-[#FFC400] uppercase font-display mb-3">Legal</p>
        <h1 className="font-display font-black text-white text-4xl uppercase mb-3">Privacy Policy</h1>
        <p className="text-[#555] text-sm">Effective Date: <span className="text-[#888]">{EFFECTIVE_DATE}</span></p>
        <p className="text-[#555] text-sm mt-1">
          This Privacy Policy explains how {COMPANY} collects, uses, stores, and protects information when you use the{" "}
          {COMPANY} AI Agent Security Firewall platform at <span className="text-[#FFC400]">{DOMAIN}</span>.
        </p>
      </div>

      {/* Quick nav */}
      <nav className="mb-12 p-5 bg-[#080808] border border-[#1a1a1a] rounded-2xl">
        <p className="text-[10px] font-bold tracking-[0.2em] text-[#555] uppercase mb-3">Contents</p>
        <ol className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[12px] text-[#666] list-none">
          {[
            ["1", "Who We Are"],
            ["2", "Scope of This Policy"],
            ["3", "Information We Collect"],
            ["4", "How We Use Your Information"],
            ["5", "Legal Bases for Processing (GDPR)"],
            ["6", "Data Sharing & Disclosure"],
            ["7", "Third-Party Sub-Processors"],
            ["8", "International Data Transfers"],
            ["9", "Data Retention"],
            ["10", "Security Measures"],
            ["11", "Cookies & Tracking Technologies"],
            ["12", "Your Rights & Choices"],
            ["13", "Children's Privacy"],
            ["14", "AI-Specific Data Practices"],
            ["15", "California Privacy Rights (CCPA)"],
            ["16", "Changes to This Policy"],
            ["17", "Contact & Data Requests"],
          ].map(([n, title]) => (
            <li key={n}>
              <a href={`#p${n}`} className="hover:text-[#FFC400] transition-colors">
                <span className="text-[#333] mr-1.5">{n}.</span>{title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="space-y-12">

        {/* 1 */}
        <Section id="p1" n="1" title="Who We Are">
          <p>
            {COMPANY} (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is the operator of the {COMPANY} AI Agent
            Security Firewall platform, accessible at <span className="text-[#FFC400]">{DOMAIN}</span>. We provide a
            production-grade security evaluation engine, TypeScript SDK, and security dashboard for teams building AI agents.
          </p>
          <p>
            For privacy inquiries, you may contact our privacy team at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
        </Section>

        {/* 2 */}
        <Section id="p2" n="2" title="Scope of This Policy">
          <p>
            This Privacy Policy applies to:
          </p>
          <ul>
            <li>Visitors to <span className="text-[#FFC400]">{DOMAIN}</span> and all subdomains.</li>
            <li>Registered users of the {COMPANY} security dashboard.</li>
            <li>Developers integrating the {COMPANY} SDK (<code>@moltwall/sdk</code>) into applications.</li>
            <li>Organizations whose AI agents submit Tool Call evaluations to the {COMPANY} API.</li>
          </ul>
          <p>
            This Policy does not apply to third-party services linked from the Platform. Those services are governed by
            their own privacy policies. We encourage you to review them.
          </p>
          <p>
            If you are using the Platform under a separate enterprise or data processing agreement with {COMPANY}, the terms
            of that agreement take precedence over this Policy where they conflict.
          </p>
        </Section>

        {/* 3 */}
        <Section id="p3" n="3" title="Information We Collect">
          <H3>3.1 Account & Identity Information</H3>
          <p>
            When you register for an Account via Privy, we receive the following information from the authentication flow:
          </p>
          <ul>
            <li><strong>Email address</strong> (if you sign in via email or Google).</li>
            <li><strong>OAuth profile data</strong> (name, profile picture URL) from Google or GitHub, if selected.</li>
            <li><strong>Wallet address</strong> (if you authenticate with a Web3 wallet). No private keys are ever transmitted.</li>
            <li><strong>Privy user ID</strong> — a stable identifier used to associate your Account with Activity data.</li>
          </ul>
          <p>
            We do not store passwords. Authentication credentials are managed exclusively by Privy.
          </p>

          <H3>3.2 Tool Call & API Data (User Data)</H3>
          <p>
            When your AI agents interact with the {COMPANY} API, we process and store:
          </p>
          <ul>
            <li><strong>Action name</strong> — the label describing the operation the agent intends to perform.</li>
            <li><strong>Tool name</strong> — the identifier of the tool or system the agent is calling.</li>
            <li><strong>Tool Call arguments</strong> — the structured payload submitted for security evaluation. <strong className="text-[#FFC400]">You are responsible for ensuring this data does not contain raw personal data, private keys, or payment credentials unnecessarily.</strong></li>
            <li><strong>Agent ID</strong> — an identifier you assign to the agent submitting the request.</li>
            <li><strong>Source type</strong> — the trust tier of the request origin (e.g., user, system, web, external).</li>
            <li><strong>Risk score</strong> — the computed 0–1 risk score generated by our risk engine.</li>
            <li><strong>Decision</strong> — the policy enforcement outcome (allow, deny, sandbox, require confirmation).</li>
            <li><strong>Guardrail findings</strong> — any detected threats (prompt injection patterns, credential patterns, PII indicators) and their severity.</li>
            <li><strong>Timestamp</strong> — UTC timestamp of the evaluation.</li>
            <li><strong>Request latency</strong> — processing time in milliseconds.</li>
          </ul>

          <H3>3.3 Policy & Configuration Data</H3>
          <p>
            Data you enter when configuring your security policies in the dashboard, including:
          </p>
          <ul>
            <li>Tool allow-lists and blocked tool patterns.</li>
            <li>Trusted and blocked domain lists.</li>
            <li>Spend limits and risk thresholds.</li>
            <li>Custom action permission rules.</li>
          </ul>

          <H3>3.4 Technical & Usage Data</H3>
          <p>Automatically collected when you use the Platform:</p>
          <ul>
            <li><strong>IP address</strong> — used for rate limiting and fraud prevention.</li>
            <li><strong>Browser type and version</strong> — for compatibility and analytics.</li>
            <li><strong>Operating system</strong> — for compatibility.</li>
            <li><strong>Referring URL</strong> — to understand how users discover the Platform.</li>
            <li><strong>Pages visited and feature interactions</strong> — to improve dashboard usability.</li>
            <li><strong>API request metadata</strong> — endpoint, HTTP status codes, latency (not payload content).</li>
            <li><strong>Error logs</strong> — to diagnose and fix bugs.</li>
          </ul>

          <H3>3.5 Communications Data</H3>
          <p>
            If you contact us by email, live chat, or through a support channel, we retain the content of that
            communication and any contact details you provide, solely for the purpose of responding to you.
          </p>
        </Section>

        {/* 4 */}
        <Section id="p4" n="4" title="How We Use Your Information">
          <p>We use the information we collect for the following purposes:</p>
          <Table rows={[
            ["Provide the Services", "Process Tool Call evaluations, enforce Policies, render security decisions, and display Action Logs in the dashboard."],
            ["Account management", "Create and maintain your Account, authenticate your sessions, and manage API Keys."],
            ["Security & fraud prevention", "Detect and prevent abuse, rate-limit API access, identify suspicious usage patterns, and protect the integrity of the Platform."],
            ["Service improvement", "Analyze usage patterns, debug errors, and improve accuracy of risk scoring and guardrail detection models. Model training uses only anonymized, aggregated signals — never raw Tool Call payloads."],
            ["Communications", "Send transactional emails (account notices, API key alerts, policy violation warnings). We do not send unsolicited marketing without consent."],
            ["Legal compliance", "Comply with applicable laws, respond to lawful legal process, and enforce our Terms of Service."],
            ["Billing", "Process payments if you subscribe to a paid plan (via a third-party payment processor)."],
          ]} />
        </Section>

        {/* 5 */}
        <Section id="p5" n="5" title="Legal Bases for Processing (GDPR)">
          <p>
            If you are in the European Economic Area (EEA), United Kingdom, or Switzerland, our legal bases for processing
            your personal data are:
          </p>
          <Table rows={[
            ["Contract performance", "Processing necessary to provide the Services you have requested — evaluating Tool Calls, maintaining your Account, and enforcing Policies."],
            ["Legitimate interests", "Operating, securing, and improving the Platform; detecting fraud and abuse; analytics. We balance our interests against your rights and only rely on this basis where the impact on you is minimal."],
            ["Legal obligation", "Complying with applicable law, court orders, or regulatory requirements."],
            ["Consent", "Where you have specifically opted in (e.g., marketing communications). You may withdraw consent at any time."],
          ]} />
        </Section>

        {/* 6 */}
        <Section id="p6" n="6" title="Data Sharing & Disclosure">
          <p>
            We do not sell, rent, or trade your personal data or User Data to third parties. We disclose information only in
            the following circumstances:
          </p>
          <H3>6.1 Service Providers (Sub-Processors)</H3>
          <p>
            We share data with third-party sub-processors listed in Section 7 to the extent necessary for them to provide
            their services to us. All sub-processors are bound by data processing agreements.
          </p>
          <H3>6.2 Legal Requirements</H3>
          <p>
            We may disclose information if required to do so by law, subpoena, court order, or other governmental authority,
            or if we believe in good faith that disclosure is necessary to protect our rights, protect your safety or the
            safety of others, investigate fraud, or respond to a government request.
          </p>
          <H3>6.3 Business Transfers</H3>
          <p>
            In the event of a merger, acquisition, reorganization, bankruptcy, or sale of all or substantially all of our
            assets, your data may be transferred to the acquiring entity. We will notify you via email or a prominent notice
            on the Platform before data becomes subject to a different privacy policy.
          </p>
          <H3>6.4 With Your Consent</H3>
          <p>
            We may share your information with third parties when you explicitly direct us to do so.
          </p>
          <H3>6.5 Aggregated / Anonymized Data</H3>
          <p>
            We may share aggregated, de-identified data about Platform usage and security trends that cannot reasonably be
            used to identify any individual or organization.
          </p>
        </Section>

        {/* 7 */}
        <Section id="p7" n="7" title="Third-Party Sub-Processors">
          <p>
            The following sub-processors handle personal data on our behalf. We maintain data processing agreements with each.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-[13px] border-collapse">
              <thead>
                <tr className="border-b border-[#1a1a1a]">
                  <th className="text-left py-2.5 pr-4 text-[#555] font-semibold uppercase tracking-wider text-[10px]">Sub-processor</th>
                  <th className="text-left py-2.5 pr-4 text-[#555] font-semibold uppercase tracking-wider text-[10px]">Purpose</th>
                  <th className="text-left py-2.5 pr-4 text-[#555] font-semibold uppercase tracking-wider text-[10px]">Data</th>
                  <th className="text-left py-2.5 text-[#555] font-semibold uppercase tracking-wider text-[10px]">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#111]">
                {[
                  ["Privy (privy.io)", "Identity & authentication", "Email, OAuth profile, wallet address", "USA / EU"],
                  ["Supabase", "Database — policies, tools, action logs", "User Data, Action Logs, API Keys (hashed)", "USA"],
                  ["Upstash / Redis", "Policy caching & rate limiting", "Policy configs, rate limit counters (temporary)", "USA / EU"],
                  ["Vercel (if deployed)", "Platform hosting & CDN", "HTTP request metadata, IP address (ephemeral)", "Global CDN"],
                ].map(([sp, purpose, data, loc]) => (
                  <tr key={sp}>
                    <td className="py-3 pr-4 text-white font-medium">{sp}</td>
                    <td className="py-3 pr-4 text-[#777]">{purpose}</td>
                    <td className="py-3 pr-4 text-[#666]">{data}</td>
                    <td className="py-3 text-[#555]">{loc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4">
            To request our full sub-processor list or to object to a new sub-processor, contact{" "}
            <a href={`mailto:${DPA_EMAIL}`}>{DPA_EMAIL}</a>.
          </p>
        </Section>

        {/* 8 */}
        <Section id="p8" n="8" title="International Data Transfers">
          <p>
            {COMPANY} operates primarily from the United States. If you are located in the EEA, UK, or Switzerland, your
            personal data will be transferred to and processed in the United States and potentially other jurisdictions.
          </p>
          <p>
            We rely on the following mechanisms to ensure adequate protection for international transfers:
          </p>
          <ul>
            <li><strong>Standard Contractual Clauses (SCCs)</strong> approved by the European Commission, incorporated in our agreements with EU-based sub-processors.</li>
            <li><strong>UK International Data Transfer Agreements (IDTAs)</strong> for UK-to-third-country transfers where applicable.</li>
            <li><strong>Adequacy decisions</strong> where the European Commission has determined a country provides adequate protection.</li>
          </ul>
          <p>
            To request copies of the safeguards we rely on for international transfers, contact{" "}
            <a href={`mailto:${DPA_EMAIL}`}>{DPA_EMAIL}</a>.
          </p>
        </Section>

        {/* 9 */}
        <Section id="p9" n="9" title="Data Retention">
          <Table rows={[
            ["Account information", "Retained for the lifetime of your Account plus 30 days after deletion."],
            ["Action Logs", "Retained per your plan tier (configurable). Deleted upon account closure after a 30-day grace period."],
            ["Policy configurations", "Retained while your Account is active. Deleted with your Account."],
            ["API Keys (hashed)", "Retained until you revoke them or delete your Account."],
            ["Technical logs (IP, request metadata)", "Retained for up to 90 days for security and debugging purposes, then automatically purged."],
            ["Redis cache entries", "Ephemeral — TTL-based expiry between 5 minutes and 24 hours depending on entry type."],
            ["Communications", "Retained for up to 3 years to maintain a record of support interactions."],
          ]} />
          <p className="mt-4">
            You may request deletion of your data at any time (see Section 12). Certain data may be retained longer where
            required by applicable law or for legitimate fraud-prevention purposes, but only to the extent necessary.
          </p>
        </Section>

        {/* 10 */}
        <Section id="p10" n="10" title="Security Measures">
          <p>
            We implement a layered set of technical and organizational security controls to protect your data:
          </p>
          <ul>
            <li><strong>Encryption in transit:</strong> All data exchanged between clients and the {COMPANY} API is encrypted using TLS 1.2 or higher.</li>
            <li><strong>Encryption at rest:</strong> Database storage (Supabase) encrypts data at rest using AES-256.</li>
            <li><strong>API Key hashing:</strong> API Keys are stored as SHA-256 hashes. The plaintext key is only shown once at issuance.</li>
            <li><strong>Access controls:</strong> Production database access is restricted to authorized personnel via role-based access controls and audit logs.</li>
            <li><strong>Authentication:</strong> User authentication is handled by Privy, which supports MFA, phishing-resistant passkeys, and wallet authentication.</li>
            <li><strong>Dependency scanning:</strong> We perform regular scanning of SDK and platform dependencies for known vulnerabilities.</li>
            <li><strong>Incident response:</strong> We maintain an incident response process. In the event of a data breach affecting your personal data, we will notify you as required by applicable law.</li>
          </ul>
          <p>
            No system is completely immune to security threats. We encourage you to protect your API Keys, use strong
            authentication methods, and report any suspected security issues to{" "}
            <a href="mailto:security@moltwall.xyz">security@moltwall.xyz</a>.
          </p>
        </Section>

        {/* 11 */}
        <Section id="p11" n="11" title="Cookies & Tracking Technologies">
          <H3>11.1 Essential Cookies</H3>
          <p>
            We use strictly necessary cookies and session tokens to maintain your authenticated session in the dashboard.
            These cannot be disabled without breaking core functionality.
          </p>
          <H3>11.2 Analytics</H3>
          <p>
            We may use privacy-respecting analytics (collecting only anonymized, aggregated data) to understand how the
            dashboard is used and where to focus improvement efforts. No cross-site tracking identifiers or third-party
            advertising cookies are used.
          </p>
          <H3>11.3 Local Storage</H3>
          <p>
            The dashboard uses browser local storage to persist your session state, recent activity, and UI preferences
            (e.g., selected filters, playback settings). This data stays in your browser and is not transmitted to our
            servers except as part of normal API interactions.
          </p>
          <H3>11.4 Managing Cookies</H3>
          <p>
            You may manage cookies through your browser settings. Blocking essential cookies may prevent the dashboard
            from functioning correctly. For EU users, we will request consent for non-essential cookies if we introduce them.
          </p>
        </Section>

        {/* 12 */}
        <Section id="p12" n="12" title="Your Rights & Choices">
          <p>
            Depending on your location, you may have the following rights regarding your personal data:
          </p>
          <Table rows={[
            ["Access", "Request a copy of the personal data we hold about you."],
            ["Rectification", "Request correction of inaccurate or incomplete personal data."],
            ["Erasure (Right to be Forgotten)", "Request deletion of your personal data, subject to our legal retention obligations."],
            ["Restriction", "Request that we restrict processing of your data in certain circumstances."],
            ["Portability", "Request your data in a structured, machine-readable format (JSON) to transfer to another service."],
            ["Objection", "Object to processing based on legitimate interests or for direct marketing purposes."],
            ["Withdraw consent", "Withdraw consent at any time where processing is based on consent (e.g., marketing)."],
            ["Lodge a complaint", "File a complaint with your local data protection authority (e.g., ICO in the UK, your national DPA in the EEA)."],
          ]} />
          <p className="mt-4">
            To exercise any of these rights, submit a request to{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We will respond within 30 days (or the period
            required by applicable law). We may need to verify your identity before processing your request.
          </p>
          <H3>12.1 Account Deletion</H3>
          <p>
            You may delete your Account at any time through the dashboard settings. Deletion triggers a 30-day grace
            period during which you may export your data, after which all associated data is permanently purged from
            our systems (except where retention is legally required).
          </p>
          <H3>12.2 Opting Out of Communications</H3>
          <p>
            You may unsubscribe from non-essential communications using the unsubscribe link in any email, or by
            contacting <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Transactional communications
            (security alerts, account notices) cannot be opted out of while your Account is active.
          </p>
        </Section>

        {/* 13 */}
        <Section id="p13" n="13" title="Children's Privacy">
          <p>
            The Platform is not directed to individuals under the age of 16 (or the applicable minimum age in your
            jurisdiction). We do not knowingly collect personal data from children. If we become aware that we have
            inadvertently collected data from a child, we will promptly delete it. If you believe a child has provided
            us with personal data, please contact <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
        </Section>

        {/* 14 */}
        <Section id="p14" n="14" title="AI-Specific Data Practices">
          <p>
            Because {COMPANY} is a security platform for AI agents, we have specific practices around how AI-related
            data is handled:
          </p>
          <H3>14.1 Tool Call Payloads</H3>
          <p>
            Tool Call argument payloads are processed by our security evaluation engine in real-time. Payloads are stored
            as part of Action Logs for audit purposes. We do not use raw Tool Call argument content to train external
            AI models without your explicit consent.
          </p>
          <H3>14.2 Guardrail Findings</H3>
          <p>
            When our guardrail engine detects threats (e.g., prompt injection patterns, PII indicators), the finding
            type and severity are recorded in the Action Log. Detected PII is flagged but <strong>not extracted or
            stored in isolation</strong> — only the presence and category of the detection is logged.
          </p>
          <H3>14.3 Risk Scoring Models</H3>
          <p>
            Risk scores are computed by deterministic, rule-based scorers and do not involve training on your personal
            data. We may use aggregated, anonymized statistical signals to calibrate scorer weights over time.
          </p>
          <H3>14.4 Agent Identifiers</H3>
          <p>
            Agent IDs you assign are treated as operational data associated with your Account. They are not shared with
            third parties and are used solely for log attribution and policy scoping.
          </p>
          <H3>14.5 No Re-Training on User Data</H3>
          <p>
            {COMPANY} does not use your Tool Call payloads, Action Logs, or Policy configurations to train, fine-tune,
            or improve AI models operated by third parties without your explicit, opt-in consent.
          </p>
        </Section>

        {/* 15 */}
        <Section id="p15" n="15" title="California Privacy Rights (CCPA / CPRA)">
          <p>
            If you are a California resident, the California Consumer Privacy Act (CCPA) as amended by the California
            Privacy Rights Act (CPRA) grants you specific rights:
          </p>
          <H3>Right to Know</H3>
          <p>
            You have the right to request that we disclose the categories and specific pieces of personal information
            we have collected about you, the sources, our business purposes for collecting it, and the categories of
            third parties with whom we have shared it.
          </p>
          <H3>Right to Delete</H3>
          <p>
            You have the right to request deletion of personal information we have collected from you, subject to
            certain exceptions (e.g., information necessary to complete a transaction or comply with a legal obligation).
          </p>
          <H3>Right to Correct</H3>
          <p>
            You have the right to request correction of inaccurate personal information.
          </p>
          <H3>Right to Opt-Out of Sale / Sharing</H3>
          <p>
            {COMPANY} does not sell personal information and does not share personal information for cross-context
            behavioral advertising. No opt-out action is required, but you may contact us to confirm.
          </p>
          <H3>Right to Non-Discrimination</H3>
          <p>
            We will not discriminate against you for exercising any of your CCPA/CPRA rights.
          </p>
          <p className="mt-4">
            To submit a verifiable consumer request, contact{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We will respond within 45 days, with a possible
            45-day extension with notice.
          </p>
        </Section>

        {/* 16 */}
        <Section id="p16" n="16" title="Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. Material changes — those that affect your rights or how
            we process your personal data — will be communicated via:
          </p>
          <ul>
            <li>Email notification to your registered address at least 14 days in advance.</li>
            <li>A prominent banner or notice in the dashboard.</li>
            <li>An updated &ldquo;Effective Date&rdquo; at the top of this page.</li>
          </ul>
          <p>
            Non-material changes (e.g., clarifications, corrections) take effect upon posting. We encourage you to review
            this Policy periodically. Continued use of the Platform after the effective date of changes constitutes
            acceptance of the updated Policy.
          </p>
        </Section>

        {/* 17 */}
        <Section id="p17" n="17" title="Contact & Data Requests">
          <p>
            For any privacy-related questions, requests, or complaints, please contact our privacy team:
          </p>
          <div className="mt-4 p-5 bg-[#080808] border border-[#1a1a1a] rounded-xl space-y-2 text-sm">
            <p><span className="text-[#555]">Company:</span> <span className="text-white">{COMPANY}</span></p>
            <p><span className="text-[#555]">Website:</span> <span className="text-[#FFC400]">{DOMAIN}</span></p>
            <p>
              <span className="text-[#555]">Privacy inquiries:</span>{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#FFC400] hover:underline">{CONTACT_EMAIL}</a>
            </p>
            <p>
              <span className="text-[#555]">DPA / legal requests:</span>{" "}
              <a href={`mailto:${DPA_EMAIL}`} className="text-[#FFC400] hover:underline">{DPA_EMAIL}</a>
            </p>
            <p>
              <span className="text-[#555]">Security vulnerabilities:</span>{" "}
              <a href="mailto:security@moltwall.xyz" className="text-[#FFC400] hover:underline">security@moltwall.xyz</a>
            </p>
          </div>
          <p className="mt-4">
            If you are located in the EEA and are not satisfied with our response, you have the right to lodge a complaint
            with your local data protection supervisory authority.
          </p>
        </Section>

      </div>

      {/* Bottom nav */}
      <div className="mt-16 pt-8 border-t border-[#1a1a1a] flex flex-wrap items-center justify-between gap-4">
        <p className="text-[12px] text-[#444]">Last updated: {EFFECTIVE_DATE}</p>
        <Link href="/terms" className="text-[12px] text-[#FFC400] hover:underline">
          Read our Terms of Service →
        </Link>
      </div>

    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Section({ id, n, title, children }: { id: string; n: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-16">
      <div className="flex items-baseline gap-3 mb-5">
        <span className="font-display font-black text-[#FFC400]/40 text-lg leading-none">{n}</span>
        <h2 className="font-display font-black text-white text-xl uppercase tracking-wide">{title}</h2>
      </div>
      <div className="space-y-4 text-[#888] text-[14px] leading-relaxed [&_strong]:font-semibold [&_a]:text-[#FFC400] [&_a:hover]:underline [&_ul]:space-y-2 [&_ul]:mt-3 [&_ul]:pl-4 [&_ul>li]:relative [&_ul>li]:pl-3 [&_ul>li]:before:content-['—'] [&_ul>li]:before:absolute [&_ul>li]:before:left-0 [&_ul>li]:before:text-[#333] [&_code]:text-[#FFC400] [&_code]:bg-[#0d0d0d] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[12px]">
        {children}
      </div>
    </section>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[#ccc] font-bold text-[13px] uppercase tracking-wider mt-6 mb-2">{children}</h3>;
}

function Table({ rows }: { rows: [string, string][] }) {
  return (
    <div className="mt-3 overflow-x-auto">
      <table className="w-full text-[13px] border-collapse">
        <tbody className="divide-y divide-[#111]">
          {rows.map(([label, desc]) => (
            <tr key={label}>
              <td className="py-3 pr-6 text-white font-semibold align-top w-48 shrink-0">{label}</td>
              <td className="py-3 text-[#777] leading-relaxed">{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
