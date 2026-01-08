import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface PolicyPageProps {
  params: Promise<{
    slug: string
  }>
}

const policyContent = {
  "terms-of-service": {
    title: "Terms of Service",
    lastUpdated: "January 2025",
    content: `
      # Terms of Service

      Welcome to PropertyHub. These terms govern your use of our platform and services.

      ## 1. Acceptance of Terms
      By accessing and using PropertyHub, you accept and agree to be bound by these terms and conditions.

      ## 2. User Responsibilities
      You agree to use this platform only for lawful purposes and in a way that does not infringe upon the rights of others or restrict their use and enjoyment of the platform.

      ## 3. Agent Verification
      All agents must complete our verification process including NIN verification, biometric scans, and credential validation. Fraudulent submissions will result in immediate account termination.

      ## 4. Property Listings
      All property information must be accurate and truthful. Misrepresenting properties is strictly prohibited and may result in legal action.

      ## 5. User Conduct
      You agree not to:
      - Harass, abuse, or threaten other users
      - Post false or misleading information
      - Attempt to circumvent our security measures
      - Use the platform for unlawful activities

      ## 6. Limitation of Liability
      PropertyHub is provided "as is" without warranties of any kind. We are not liable for damages arising from your use or inability to use the platform.

      ## 7. Changes to Terms
      We reserve the right to modify these terms at any time. Your continued use constitutes acceptance of revised terms.

      ## 8. Governing Law
      These terms are governed by applicable local and national laws.
    `,
  },
  "privacy-policy": {
    title: "Privacy Policy",
    lastUpdated: "January 2025",
    content: `
      # Privacy Policy

      Your privacy is important to us. This policy explains how we collect and use your information.

      ## 1. Information We Collect
      - Account information (email, name, phone number)
      - Profile information (for agents: verification documents, biometric data)
      - Property browsing history
      - Chat conversations
      - Device and usage information

      ## 2. How We Use Your Information
      - To provide and improve our services
      - To verify agent credentials and prevent fraud
      - To facilitate communication between users
      - To send you updates and notifications
      - To comply with legal obligations

      ## 3. Data Protection
      We implement industry-standard security measures to protect your personal data. However, no method of transmission is 100% secure.

      ## 4. Biometric Data
      Agent biometric data is encrypted and stored securely. This data is used solely for verification purposes and is not shared with third parties.

      ## 5. Third-Party Sharing
      We do not sell your personal information. We may share data with:
      - Law enforcement (when legally required)
      - Service providers who assist in operations
      - Other parties with your explicit consent

      ## 6. Data Retention
      We retain your data as long as your account is active or as needed for legal obligations.

      ## 7. Your Rights
      You have the right to:
      - Access your personal data
      - Request corrections to inaccurate data
      - Request deletion of your data
      - Opt-out of marketing communications

      ## 8. Contact Us
      For privacy inquiries, contact privacy@propertyhub.com
    `,
  },
  "code-of-conduct": {
    title: "Code of Conduct",
    lastUpdated: "January 2025",
    content: `
      # Code of Conduct

      PropertyHub is committed to creating a safe, respectful, and professional environment for all users.

      ## 1. Professional Behavior
      All agents must maintain professional standards in their communications and dealings with clients and colleagues.

      ## 2. Honest Representation
      - Properties must be accurately described
      - Prices must be current and correct
      - Images must be of the actual property
      - No misleading claims about location or amenities

      ## 3. Fair Dealing
      - Respect negotiation processes
      - Honor agreed-upon terms
      - Communicate honestly about property conditions
      - Disclose all known issues with properties

      ## 4. Respect for Others
      - Treat all users with courtesy and respect
      - No discrimination based on protected characteristics
      - Respect user privacy and confidentiality
      - No harassment or abusive behavior

      ## 5. Fraud Prevention
      - Do not provide false verification documents
      - Do not misuse verification for unauthorized transactions
      - Report suspicious activity immediately
      - Do not impersonate other users or agents

      ## 6. Confidentiality
      Information shared in private chats and transactions must remain confidential and not be disclosed to unauthorized parties.

      ## 7. Compliance
      All users must comply with applicable laws, regulations, and this code of conduct.

      ## 8. Violations & Consequences
      Violations of this code may result in:
      - Warning notices
      - Account suspension
      - Permanent termination
      - Legal action (for serious violations)
    `,
  },
}

export default async function PolicyPage({ params }: PolicyPageProps) {
  const { slug } = await params
  const policy = policyContent[slug as keyof typeof policyContent]

  if (!policy) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-3xl mx-auto px-4 py-20">
        <Link href="/policies">
          <Button variant="ghost" className="gap-2 mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Policies
          </Button>
        </Link>

        <article className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">{policy.title}</h1>
            <p className="text-sm text-foreground/60">Last updated: {policy.lastUpdated}</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-foreground/80 leading-relaxed">
            {policy.content.split("\n").map((line, i) => {
              if (line.startsWith("# ")) {
                return (
                  <h2 key={i} className="text-2xl font-bold text-foreground mt-8 mb-4">
                    {line.slice(2)}
                  </h2>
                )
              }
              if (line.startsWith("## ")) {
                return (
                  <h3 key={i} className="text-xl font-semibold text-foreground mt-6 mb-3">
                    {line.slice(3)}
                  </h3>
                )
              }
              if (line.startsWith("- ")) {
                return (
                  <li key={i} className="ml-6 mb-2">
                    {line.slice(2)}
                  </li>
                )
              }
              if (line.trim()) {
                return (
                  <p key={i} className="mb-4">
                    {line}
                  </p>
                )
              }
              return null
            })}
          </div>
        </article>
      </div>
    </div>
  )
}
