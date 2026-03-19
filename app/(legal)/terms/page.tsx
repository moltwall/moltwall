import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service · MoltWall",
  description: "MoltWall Terms of Service — the rules and conditions governing use of the MoltWall AI Agent Security Firewall platform.",
};

const EFFECTIVE_DATE = "March 19, 2026";
const COMPANY = "MoltWall";
const DOMAIN = "www.moltwall.xyz";
const CONTACT_EMAIL = "legal@moltwall.xyz";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">

      {/* Header */}
      <div className="mb-12 pb-8 border-b border-[#1a1a1a]">
        <p className="text-[11px] font-bold tracking-[0.25em] text-[#FFC400] uppercase font-display mb-3">Legal</p>
        <h1 className="font-display font-black text-white text-4xl uppercase mb-3">Terms of Service</h1>
        <p className="text-[#555] text-sm">Effective Date: <span className="text-[#888]">{EFFECTIVE_DATE}</span></p>
        <p className="text-[#555] text-sm mt-1">
          Please read these Terms carefully before using the {COMPANY} platform.
          By accessing or using our services you agree to be bound by these Terms.
        </p>
      </div>

      {/* Quick nav */}
      <nav className="mb-12 p-5 bg-[#080808] border border-[#1a1a1a] rounded-2xl">
        <p className="text-[10px] font-bold tracking-[0.2em] text-[#555] uppercase mb-3">Contents</p>
        <ol className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[12px] text-[#666] list-none">
          {[
            ["1", "Acceptance of Terms"],
            ["2", "Definitions"],
            ["3", "Description of Services"],
            ["4", "Account Registration & Security"],
            ["5", "Acceptable Use Policy"],
            ["6", "API & SDK License"],
            ["7", "Intellectual Property"],
            ["8", "Data Processing & Privacy"],
            ["9", "Third-Party Services"],
            ["10", "Fees & Payment"],
            ["11", "Disclaimer of Warranties"],
            ["12", "Limitation of Liability"],
            ["13", "Indemnification"],
            ["14", "Termination"],
            ["15", "Governing Law & Disputes"],
            ["16", "Modifications to Terms"],
            ["17", "Miscellaneous"],
            ["18", "Contact Information"],
          ].map(([n, title]) => (
            <li key={n}>
              <a href={`#s${n}`} className="hover:text-[#FFC400] transition-colors">
                <span className="text-[#333] mr-1.5">{n}.</span>{title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="prose-legal space-y-12">

        {/* 1 */}
        <Section id="s1" n="1" title="Acceptance of Terms">
          <p>
            These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you (&ldquo;User,&rdquo;
            &ldquo;you,&rdquo; or &ldquo;your&rdquo;) and {COMPANY} (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
            &ldquo;our&rdquo;), operator of the {COMPANY} AI Agent Security Firewall platform available at{" "}
            <span className="text-[#FFC400]">{DOMAIN}</span> (the &ldquo;Platform&rdquo;).
          </p>
          <p>
            By creating an account, accessing the dashboard, integrating the SDK, or otherwise using any portion of the Platform,
            you acknowledge that you have read, understood, and agree to be bound by these Terms and our{" "}
            <Link href="/privacy" className="text-[#FFC400] hover:underline">Privacy Policy</Link>, which is incorporated herein
            by reference.
          </p>
          <p>
            If you are using the Platform on behalf of an organization, you represent and warrant that you have authority to bind
            that organization to these Terms. In that case, &ldquo;you&rdquo; refers to both you and the organization.
          </p>
          <p>
            If you do not agree to these Terms, you must not access or use the Platform. Your continued use of the Platform
            following any modification to these Terms constitutes acceptance of those modifications.
          </p>
        </Section>

        {/* 2 */}
        <Section id="s2" n="2" title="Definitions">
          <Dl items={[
            ["Platform", `The ${COMPANY} website, dashboard, API, SDK, and all related services operated by ${COMPANY} at ${DOMAIN}.`],
            ["Services", "All features, functionality, and content provided through the Platform, including the security firewall engine, risk scoring, guardrail scanning, policy enforcement, audit logging, and the TypeScript SDK."],
            ["SDK", `The @moltwall/sdk TypeScript package and associated libraries published by ${COMPANY} on npm and available via the Platform.`],
            ["API", `The HTTP application programming interface exposed by ${COMPANY} that allows programmatic interaction with the Services.`],
            ["Agent", "Any AI agent, autonomous software system, language model application, or automated workflow that integrates with the Services via the API or SDK to evaluate tool calls."],
            ["Tool Call", "A request by an Agent to invoke a tool, execute an action, or interact with an external system, submitted to the Platform for security evaluation."],
            ["Policy", "A set of user-defined rules, configurations, allow-lists, deny-lists, spend limits, and thresholds stored in the Platform that govern how the firewall evaluates Tool Calls."],
            ["Action Log", "A persistent audit record generated by the Platform for each Tool Call evaluation, including the decision rendered (allow, deny, sandbox, or require confirmation) and associated risk metadata."],
            ["API Key", "A secret credential issued by the Platform to authenticate API requests from an Agent or integration."],
            ["User Data", "Data submitted to the Platform by you or your Agents, including Tool Call arguments, action identifiers, agent identifiers, and Policy configurations."],
            ["Account", "A registered user profile created through the authentication flow on the Platform."],
          ]} />
        </Section>

        {/* 3 */}
        <Section id="s3" n="3" title="Description of Services">
          <p>
            {COMPANY} provides a production-grade AI agent security firewall platform. The Services include:
          </p>
          <ul>
            <li><strong className="text-white">Security Evaluation Engine:</strong> Evaluates Tool Calls in real-time against user-defined Policies, computing risk scores and rendering access decisions (allow, deny, sandbox, require confirmation) with sub-10ms median latency.</li>
            <li><strong className="text-white">Guardrail Scanning:</strong> Performs recursive inspection of Tool Call arguments for prompt injection patterns, credential leakage, personally identifiable information (PII) exposure, and tool-poisoning indicators.</li>
            <li><strong className="text-white">Risk Scoring:</strong> Computes a weighted 0–1 risk score per Tool Call based on factors including source provenance, payload content, action intent, spend risk, and domain trust.</li>
            <li><strong className="text-white">Policy Engine:</strong> A rule-based system allowing users to define tool allow-lists, blocked action patterns, trusted domains, and spend limits, enforced with Redis-cached sub-millisecond lookup.</li>
            <li><strong className="text-white">Audit Logging:</strong> Persistent storage of every Tool Call evaluation decision with full metadata, queryable from the security dashboard.</li>
            <li><strong className="text-white">TypeScript SDK:</strong> An open-source SDK enabling drop-in integration with Claude MCP, LangChain, AutoGPT, LangGraph, CrewAI, and custom agent frameworks.</li>
            <li><strong className="text-white">Security Dashboard:</strong> A web interface for visualizing agent activity, reviewing Action Logs, managing Policies, and registering tools.</li>
          </ul>
          <p>
            The Services are provided on an as-is, as-available basis. We reserve the right to modify, suspend, or discontinue
            any feature at any time with reasonable notice where practicable.
          </p>
        </Section>

        {/* 4 */}
        <Section id="s4" n="4" title="Account Registration & Security">
          <H3>4.1 Registration</H3>
          <p>
            Access to the security dashboard and certain API features requires you to create an Account. Authentication is
            handled through Privy, our third-party identity provider, which supports email, Google, GitHub, and wallet-based
            sign-in. By creating an Account you agree to Privy&apos;s terms of service and privacy policy in addition to these Terms.
          </p>
          <H3>4.2 Account Accuracy</H3>
          <p>
            You agree to provide accurate, current, and complete information during registration and to keep that information
            updated. Providing false or misleading information is grounds for immediate account termination.
          </p>
          <H3>4.3 API Keys</H3>
          <p>
            Upon registration, API Keys may be issued to authenticate your Agents with the Platform. You are solely responsible
            for the security and confidentiality of all API Keys associated with your Account. API Keys must not be:
          </p>
          <ul>
            <li>Committed to public version control repositories.</li>
            <li>Shared with unauthorized third parties.</li>
            <li>Embedded in client-side code exposed to end users.</li>
            <li>Used by Agents not authorized by your organization.</li>
          </ul>
          <p>
            You must immediately notify us at <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#FFC400] hover:underline">{CONTACT_EMAIL}</a> if
            you suspect unauthorized use of an API Key. We are not liable for losses resulting from unauthorized use of your
            credentials prior to notification.
          </p>
          <H3>4.4 Account Responsibility</H3>
          <p>
            You are responsible for all activity that occurs under your Account and all Agents operating under your API Keys,
            whether or not authorized by you. We may hold you liable for misuse by Agents or third parties using your credentials.
          </p>
          <H3>4.5 One Account Per User</H3>
          <p>
            Unless you have entered into a separate enterprise agreement with {COMPANY}, each individual user may maintain only
            one active Account. Organization-level access should be managed under a single Account.
          </p>
        </Section>

        {/* 5 */}
        <Section id="s5" n="5" title="Acceptable Use Policy">
          <p>
            You may use the Services only for lawful purposes and in compliance with these Terms. You agree not to use the
            Services:
          </p>
          <H3>5.1 Prohibited Activities</H3>
          <ul>
            <li>To violate any applicable local, national, or international law or regulation, including data protection laws.</li>
            <li>To transmit or process data that infringes any third party&apos;s intellectual property rights.</li>
            <li>To transmit malware, viruses, trojans, or any malicious code through Tool Call arguments.</li>
            <li>To attempt to probe, scan, or test the vulnerability of the Platform or circumvent any security measures.</li>
            <li>To reverse engineer, disassemble, decompile, or otherwise attempt to derive the source code of proprietary Platform components.</li>
            <li>To access the Platform via automated means in excess of published rate limits.</li>
            <li>To submit synthetic Tool Calls designed to benchmark or stress-test our infrastructure without prior written consent.</li>
            <li>To collect or harvest user data or personal information of other Platform users.</li>
            <li>To use the Services to build a product or service that is substantially similar to or competes with the Platform without prior written authorization.</li>
            <li>To impersonate any person or entity or falsely claim an affiliation with any person or entity.</li>
            <li>To interfere with or disrupt the integrity or performance of the Services or the data contained therein.</li>
          </ul>
          <H3>5.2 Agent Conduct</H3>
          <p>
            You are responsible for the conduct of all Agents that interact with the Platform under your Account. You must ensure
            your Agents do not intentionally submit adversarial Tool Call payloads designed to subvert the Platform&apos;s security
            evaluation mechanisms, or submit payloads containing production credentials, passwords, or secret keys in plain text
            unless strictly necessary for your integration.
          </p>
          <H3>5.3 Consequences of Violations</H3>
          <p>
            Violation of this Acceptable Use Policy may result in immediate suspension or termination of your Account without
            notice, removal of Action Logs and associated data, and where applicable, referral to law enforcement.
          </p>
        </Section>

        {/* 6 */}
        <Section id="s6" n="6" title="API & SDK License">
          <H3>6.1 SDK License</H3>
          <p>
            The {COMPANY} SDK (<code className="text-[#FFC400] bg-[#0d0d0d] px-1.5 py-0.5 rounded text-[12px]">@moltwall/sdk</code>) is
            open-source software distributed under the MIT License. Subject to your compliance with these Terms, {COMPANY} grants
            you a worldwide, non-exclusive, royalty-free license to use, copy, modify, and distribute the SDK in your applications.
          </p>
          <H3>6.2 API License</H3>
          <p>
            Subject to your compliance with these Terms, {COMPANY} grants you a limited, non-exclusive, non-transferable,
            revocable license to access the API solely for the purpose of integrating your Agents with the Services for the
            evaluation of Tool Calls.
          </p>
          <H3>6.3 Restrictions</H3>
          <p>
            You may not sublicense, sell, resell, or transfer any API access rights to third parties. You may not use the API to
            create a security evaluation service that competes with {COMPANY} without prior written consent.
          </p>
          <H3>6.4 Rate Limits</H3>
          <p>
            The API is subject to rate limits as published in the documentation. Excessive API usage that degrades service quality
            for other users may result in throttling or temporary suspension. Contact us if your use case requires elevated limits.
          </p>
          <H3>6.5 Versioning & Deprecation</H3>
          <p>
            We may release new API versions and deprecate older versions. We will provide at least 60 days&apos; notice before
            deprecating a major API version, except in cases of critical security vulnerabilities where immediate action may be required.
          </p>
        </Section>

        {/* 7 */}
        <Section id="s7" n="7" title="Intellectual Property">
          <H3>7.1 Platform Ownership</H3>
          <p>
            The Platform, including all software, algorithms, models, designs, trademarks, logos, documentation, and content
            (excluding open-source components and User Data), is the exclusive property of {COMPANY} and is protected by
            applicable intellectual property laws. Nothing in these Terms transfers ownership of any {COMPANY} intellectual
            property to you.
          </p>
          <H3>7.2 User Data Ownership</H3>
          <p>
            You retain all rights, title, and interest in and to User Data. By submitting User Data to the Platform, you grant
            {COMPANY} a limited, non-exclusive, worldwide license to process, store, and use User Data solely for the purpose of
            providing and improving the Services.
          </p>
          <H3>7.3 Feedback</H3>
          <p>
            If you provide feedback, suggestions, or ideas regarding the Services (&ldquo;Feedback&rdquo;), you grant {COMPANY}
            a perpetual, irrevocable, worldwide, royalty-free license to use, incorporate, and commercialize that Feedback without
            any obligation to you.
          </p>
          <H3>7.4 Open-Source Components</H3>
          <p>
            Certain components of the Platform incorporate open-source software. Their respective licenses take precedence over
            these Terms for those components. A list of open-source dependencies is available in the SDK repository.
          </p>
        </Section>

        {/* 8 */}
        <Section id="s8" n="8" title="Data Processing & Privacy">
          <p>
            Our collection, use, and protection of your personal data and User Data is described in our{" "}
            <Link href="/privacy" className="text-[#FFC400] hover:underline">Privacy Policy</Link>, which is incorporated by
            reference into these Terms.
          </p>
          <H3>8.1 Tool Call Data</H3>
          <p>
            Tool Call payloads submitted via the API may contain sensitive information including action arguments, tool names,
            and agent identifiers. You are responsible for ensuring that Tool Call payloads comply with applicable data protection
            laws before submission to the Platform. You should not submit unencrypted production passwords, private keys, or
            payment card data in Tool Call arguments.
          </p>
          <H3>8.2 Data Retention</H3>
          <p>
            Action Logs are retained for a period specified in your plan tier. You may export or delete your logs at any time
            through the dashboard. Upon account termination, your data is retained for 30 days and then permanently deleted,
            except where retention is required by applicable law.
          </p>
          <H3>8.3 Security Measures</H3>
          <p>
            We implement industry-standard technical and organizational measures to protect your data, including encryption at
            rest and in transit, access controls, and regular security reviews. However, no system is completely secure and we
            cannot guarantee absolute security.
          </p>
          <H3>8.4 Data Processing Agreements</H3>
          <p>
            If you are subject to GDPR or other data protection frameworks that require a Data Processing Agreement (DPA),
            please contact us at <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#FFC400] hover:underline">{CONTACT_EMAIL}</a> to
            request an appropriate agreement before processing personal data through the Platform.
          </p>
        </Section>

        {/* 9 */}
        <Section id="s9" n="9" title="Third-Party Services">
          <p>
            The Platform integrates with and relies upon the following third-party services:
          </p>
          <ul>
            <li><strong className="text-white">Privy (privy.io):</strong> Authentication and identity management. Your use of Privy is subject to Privy&apos;s Terms of Service and Privacy Policy. {COMPANY} is not responsible for the availability or security of Privy&apos;s infrastructure.</li>
            <li><strong className="text-white">Supabase:</strong> Relational database storage for Policies, Tool registrations, and Action Logs. Data is stored in Supabase-managed infrastructure subject to Supabase&apos;s terms and data processing agreements.</li>
            <li><strong className="text-white">Upstash / Redis:</strong> In-memory caching for Policy enforcement and rate limiting. Tool Call evaluation metadata may temporarily reside in Redis cache.</li>
          </ul>
          <p>
            We are not responsible for the acts or omissions of third-party service providers. Any downtime, data loss, or
            security incidents attributable to third-party infrastructure are not within our control. We will make reasonable
            efforts to notify you of material third-party outages affecting the Services.
          </p>
          <p>
            Links to third-party websites or services from the Platform do not constitute endorsement. Interactions with
            third-party services are governed by their own terms and policies.
          </p>
        </Section>

        {/* 10 */}
        <Section id="s10" n="10" title="Fees & Payment">
          <H3>10.1 Free Tier</H3>
          <p>
            {COMPANY} currently offers a free-tier access plan. Features, limits, and availability of the free tier are subject
            to change at our discretion with reasonable advance notice.
          </p>
          <H3>10.2 Paid Plans</H3>
          <p>
            If and when paid plans are introduced, fees will be published on the Platform. By subscribing to a paid plan, you
            authorize us to charge your designated payment method on the billing cycle specified at the time of subscription.
            All fees are non-refundable except as required by applicable law or as explicitly stated in a separate agreement.
          </p>
          <H3>10.3 Taxes</H3>
          <p>
            All fees are exclusive of applicable taxes. You are responsible for all taxes, duties, and levies associated with
            your use of the Services.
          </p>
          <H3>10.4 Suspension for Non-Payment</H3>
          <p>
            If payment for a paid plan fails and is not remedied within 7 days of notice, we may suspend or terminate access
            to paid features.
          </p>
        </Section>

        {/* 11 */}
        <Section id="s11" n="11" title="Disclaimer of Warranties">
          <Callout>
            THE PLATFORM AND ALL SERVICES ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND,
            WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE.
          </Callout>
          <p>
            TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, {COMPANY.toUpperCase()} EXPRESSLY DISCLAIMS ALL WARRANTIES,
            INCLUDING BUT NOT LIMITED TO:
          </p>
          <ul>
            <li>WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</li>
            <li>THAT THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.</li>
            <li>THAT ALL THREATS, PROMPT INJECTIONS, CREDENTIAL LEAKS, OR MALICIOUS TOOL CALLS WILL BE DETECTED OR BLOCKED.</li>
            <li>THAT THE RISK SCORES AND SECURITY DECISIONS PRODUCED BY THE PLATFORM WILL BE ACCURATE OR APPROPRIATE FOR YOUR USE CASE.</li>
            <li>THAT THE PLATFORM IS FREE FROM VIRUSES, MALWARE, OR OTHER HARMFUL COMPONENTS.</li>
          </ul>
          <p>
            The Platform is a security assistance tool. It does not guarantee prevention of all security incidents related to
            AI agent activity. You remain solely responsible for the security posture of your AI systems.
          </p>
        </Section>

        {/* 12 */}
        <Section id="s12" n="12" title="Limitation of Liability">
          <Callout>
            TO THE FULLEST EXTENT PERMITTED BY LAW, {COMPANY.toUpperCase()}&apos;S TOTAL CUMULATIVE LIABILITY TO YOU ARISING OUT OF OR
            RELATED TO THESE TERMS OR THE SERVICES SHALL NOT EXCEED THE GREATER OF (A) THE AMOUNTS PAID BY YOU TO{" "}
            {COMPANY.toUpperCase()} IN THE TWELVE MONTHS PRECEDING THE CLAIM, OR (B) ONE HUNDRED US DOLLARS (USD $100).
          </Callout>
          <p>
            IN NO EVENT SHALL {COMPANY.toUpperCase()} BE LIABLE FOR ANY:
          </p>
          <ul>
            <li>INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES;</li>
            <li>LOSS OF PROFITS, REVENUE, DATA, GOODWILL, OR BUSINESS OPPORTUNITIES;</li>
            <li>DAMAGES ARISING FROM UNAUTHORIZED AGENT ACTIONS NOT DETECTED BY THE PLATFORM;</li>
            <li>DAMAGES ARISING FROM THIRD-PARTY SERVICE OUTAGES (PRIVY, SUPABASE, UPSTASH);</li>
            <li>DAMAGES ARISING FROM YOUR FAILURE TO IMPLEMENT RECOMMENDED SECURITY PRACTICES.</li>
          </ul>
          <p>
            These limitations apply regardless of the form of action, whether in contract, tort (including negligence), strict
            liability, or otherwise, and whether or not {COMPANY} has been advised of the possibility of such damages. Some
            jurisdictions do not allow the exclusion of certain warranties or limitation of liability, so some of the above may
            not apply to you.
          </p>
        </Section>

        {/* 13 */}
        <Section id="s13" n="13" title="Indemnification">
          <p>
            You agree to indemnify, defend, and hold harmless {COMPANY}, its officers, directors, employees, agents, licensors,
            and service providers from and against any claims, liabilities, damages, judgments, awards, losses, costs, or expenses
            (including reasonable attorneys&apos; fees) arising out of or relating to:
          </p>
          <ul>
            <li>Your violation of these Terms.</li>
            <li>Your use or misuse of the Services.</li>
            <li>User Data you submit to the Platform.</li>
            <li>Your Agents&apos; Tool Calls and the actions taken by those Agents.</li>
            <li>Your violation of any applicable law or regulation.</li>
            <li>Your infringement of any third-party intellectual property, privacy, or other rights.</li>
            <li>Any dispute between you and a third party that is connected to your use of the Services.</li>
          </ul>
        </Section>

        {/* 14 */}
        <Section id="s14" n="14" title="Termination">
          <H3>14.1 Termination by You</H3>
          <p>
            You may terminate your Account at any time by deleting it through the dashboard settings or by contacting us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#FFC400] hover:underline">{CONTACT_EMAIL}</a>. Upon termination,
            your right to use the Services ceases immediately.
          </p>
          <H3>14.2 Termination by Us</H3>
          <p>
            We may suspend or terminate your Account immediately and without notice if:
          </p>
          <ul>
            <li>You violate these Terms or the Acceptable Use Policy.</li>
            <li>We are required to do so by law or a court order.</li>
            <li>We reasonably believe your use poses a security risk to the Platform or other users.</li>
            <li>You provide false account information.</li>
          </ul>
          <p>
            We may also terminate the Platform or any portion thereof with 30 days&apos; notice to registered users.
          </p>
          <H3>14.3 Effect of Termination</H3>
          <p>
            Upon termination, all licenses granted under these Terms immediately terminate. Sections 7, 11, 12, 13, 15, and 17
            survive termination. Your User Data will be retained for 30 days after termination, during which you may request
            an export, then permanently deleted.
          </p>
        </Section>

        {/* 15 */}
        <Section id="s15" n="15" title="Governing Law & Disputes">
          <H3>15.1 Governing Law</H3>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which {COMPANY}
            is incorporated, without regard to conflict-of-law principles.
          </p>
          <H3>15.2 Informal Resolution</H3>
          <p>
            Before initiating formal legal proceedings, both parties agree to first attempt to resolve any dispute informally
            by contacting <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#FFC400] hover:underline">{CONTACT_EMAIL}</a> with
            a written notice describing the dispute. The parties will negotiate in good faith for at least 30 days.
          </p>
          <H3>15.3 Arbitration</H3>
          <p>
            If informal resolution fails, disputes will be resolved by binding arbitration under the rules of a recognized
            arbitration body. Class actions and class arbitrations are waived to the fullest extent permitted by law.
          </p>
          <H3>15.4 Exceptions</H3>
          <p>
            Notwithstanding the above, either party may seek injunctive or other equitable relief in a court of competent
            jurisdiction to prevent irreparable harm, particularly related to intellectual property infringement or unauthorized
            access to the Platform.
          </p>
        </Section>

        {/* 16 */}
        <Section id="s16" n="16" title="Modifications to Terms">
          <p>
            We reserve the right to modify these Terms at any time. Material changes will be communicated via:
          </p>
          <ul>
            <li>Email notification to your registered address.</li>
            <li>A prominent notice on the Platform dashboard.</li>
            <li>An updated &ldquo;Effective Date&rdquo; at the top of this page.</li>
          </ul>
          <p>
            Continued use of the Services 14 days after notification of material changes constitutes acceptance of the updated
            Terms. If you do not agree to the updated Terms, you must cease using the Services and may terminate your Account.
          </p>
        </Section>

        {/* 17 */}
        <Section id="s17" n="17" title="Miscellaneous">
          <H3>17.1 Entire Agreement</H3>
          <p>
            These Terms, together with the Privacy Policy and any separate enterprise agreements, constitute the entire agreement
            between you and {COMPANY} regarding the Services and supersede all prior agreements.
          </p>
          <H3>17.2 Severability</H3>
          <p>
            If any provision of these Terms is found invalid or unenforceable, that provision shall be modified to the minimum
            extent necessary to make it enforceable, and the remaining provisions shall remain in full force.
          </p>
          <H3>17.3 Waiver</H3>
          <p>
            Failure by {COMPANY} to enforce any right or provision of these Terms shall not constitute a waiver of that right
            or provision.
          </p>
          <H3>17.4 Assignment</H3>
          <p>
            You may not assign or transfer these Terms or your Account without our prior written consent. {COMPANY} may assign
            these Terms in connection with a merger, acquisition, or sale of all or substantially all of its assets.
          </p>
          <H3>17.5 Force Majeure</H3>
          <p>
            {COMPANY} shall not be liable for failure or delay in performing its obligations due to causes beyond its reasonable
            control, including acts of God, natural disasters, war, terrorism, labor disputes, or internet infrastructure failures.
          </p>
          <H3>17.6 Export Controls</H3>
          <p>
            You agree to comply with all applicable export control laws and regulations. You represent that you are not located
            in a jurisdiction subject to applicable trade sanctions.
          </p>
        </Section>

        {/* 18 */}
        <Section id="s18" n="18" title="Contact Information">
          <p>
            For questions about these Terms, please contact us:
          </p>
          <div className="mt-4 p-5 bg-[#080808] border border-[#1a1a1a] rounded-xl space-y-2 text-sm">
            <p><span className="text-[#555]">Company:</span> <span className="text-white">{COMPANY}</span></p>
            <p><span className="text-[#555]">Website:</span> <span className="text-[#FFC400]">{DOMAIN}</span></p>
            <p>
              <span className="text-[#555]">Legal inquiries:</span>{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#FFC400] hover:underline">{CONTACT_EMAIL}</a>
            </p>
          </div>
        </Section>

      </div>

      {/* Bottom nav */}
      <div className="mt-16 pt-8 border-t border-[#1a1a1a] flex flex-wrap items-center justify-between gap-4">
        <p className="text-[12px] text-[#444]">Last updated: {EFFECTIVE_DATE}</p>
        <Link href="/privacy" className="text-[12px] text-[#FFC400] hover:underline">
          Read our Privacy Policy →
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
      <div className="space-y-4 text-[#888] text-[14px] leading-relaxed [&_strong]:font-semibold [&_a]:text-[#FFC400] [&_a:hover]:underline [&_ul]:space-y-2 [&_ul]:mt-3 [&_ul]:pl-4 [&_ul>li]:relative [&_ul>li]:pl-3 [&_ul>li]:before:content-['—'] [&_ul>li]:before:absolute [&_ul>li]:before:left-0 [&_ul>li]:before:text-[#333]">
        {children}
      </div>
    </section>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[#ccc] font-bold text-[13px] uppercase tracking-wider mt-6 mb-2">{children}</h3>;
}

function Dl({ items }: { items: [string, string][] }) {
  return (
    <dl className="space-y-4 mt-3">
      {items.map(([term, def]) => (
        <div key={term} className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-1 sm:gap-4">
          <dt className="text-white font-semibold text-[13px] pt-px">&ldquo;{term}&rdquo;</dt>
          <dd className="text-[#777] text-[13px] leading-relaxed">{def}</dd>
        </div>
      ))}
    </dl>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 bg-[#0d0d0d] border border-[#222] rounded-xl text-[12px] text-[#666] leading-relaxed font-mono">
      {children}
    </div>
  );
}
