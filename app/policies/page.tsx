import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

const policies = [
  {
    slug: "terms-of-service",
    title: "Terms of Service",
    icon: "📋",
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    icon: "🔒",
  },
  {
    slug: "code-of-conduct",
    title: "Code of Conduct",
    icon: "✨",
  },
]

export default function PoliciesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold">Policies & Legal</h1>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">Important information about using PropertyHub</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {policies.map((policy) => (
            <Link key={policy.slug} href={`/policies/${policy.slug}`}>
              <Card className="h-full hover:shadow-lg transition-all cursor-pointer border-border/50 group">
                <CardContent className="pt-8 space-y-4">
                  <div className="text-5xl">{policy.icon}</div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{policy.title}</h3>
                    <p className="text-sm text-foreground/60">Click to read and understand</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
