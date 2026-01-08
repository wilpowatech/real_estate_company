import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, MessageCircle, Zap, ChevronRight } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Sticky Header Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg group-hover:shadow-lg transition-shadow">
              RE
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hidden sm:block">
              PropertyHub
            </span>
          </Link>

          <nav className="hidden md:flex gap-8 items-center text-sm">
            <Link href="/properties" className="font-medium text-foreground/80 hover:text-primary transition-colors">
              Discover
            </Link>
            <Link href="/agents" className="font-medium text-foreground/80 hover:text-primary transition-colors">
              Agents
            </Link>
            <Link href="/about" className="font-medium text-foreground/80 hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/contact" className="font-medium text-foreground/80 hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex gap-3 items-center">
            <Button asChild variant="ghost" size="sm" className="hidden sm:flex">
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-shadow"
            >
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-24 md:pb-32">
        <div className="absolute inset-0 -z-10">
          {/* Background gradient blobs - youthful feel */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-40"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                  🚀 The Future of Real Estate is Here
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-balance leading-tight">
                  <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                    Connect, Chat & Close Deals
                  </span>
                </h1>
                <p className="text-xl text-foreground/70 text-balance max-w-lg leading-relaxed">
                  Your trusted hub where verified agents and smart buyers meet. Secure transactions. Real conversations.
                  Real deals.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all"
                >
                  <Link href="/properties">
                    Browse Properties
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-2 bg-transparent">
                  <Link href="/auth/sign-up?type=agent">Become an Agent</Link>
                </Button>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 pt-4 text-sm text-foreground/60">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>Verified Agents</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-accent" />
                  <span>Live Chat Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  <span>Fast Deals</span>
                </div>
              </div>
            </div>

            {/* Hero Image Placeholder */}
            <div className="relative h-96 md:h-full rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 border border-border/50 shadow-2xl">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="text-6xl">🏠</div>
                  <p className="text-foreground/40">Hero Image</p>
                  <p className="text-sm text-foreground/30">Add your property showcase here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl font-bold">Why PropertyHub?</h2>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
              We're revolutionizing how real estate deals happen
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card className="border-border/50 bg-background hover:shadow-lg transition-shadow group cursor-pointer">
              <CardContent className="pt-8 space-y-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Shield className="w-7 h-7 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Verified Agents</h3>
                  <p className="text-foreground/60">
                    All agents verified with NIN, biometric scans & credentials. 100% secure.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-border/50 bg-background hover:shadow-lg transition-shadow group cursor-pointer">
              <CardContent className="pt-8 space-y-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-7 h-7 text-accent" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">In-House Chat</h3>
                  <p className="text-foreground/60">
                    Direct messaging with agents. Negotiate, discuss & close deals in real-time.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-border/50 bg-background hover:shadow-lg transition-shadow group cursor-pointer">
              <CardContent className="pt-8 space-y-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="w-7 h-7 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Fast & Easy</h3>
                  <p className="text-foreground/60">
                    Browse thousands of properties. Find & connect with agents in minutes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <p className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                5K+
              </p>
              <p className="text-foreground/60">Active Agents</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                50K+
              </p>
              <p className="text-foreground/60">Properties Listed</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                100K+
              </p>
              <p className="text-foreground/60">Happy Users</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                99.9%
              </p>
              <p className="text-foreground/60">Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">Ready to Make Your Move?</h2>
            <p className="text-xl text-foreground/60">
              Join thousands of users finding their perfect property or building their real estate business.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent hover:shadow-lg">
              <Link href="/auth/sign-up">Sign Up Free</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-2 bg-transparent">
              <Link href="/properties">Start Browsing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <h4 className="font-semibold">PropertyHub</h4>
              <p className="text-sm text-foreground/60">
                Connecting agents and buyers in the modern real estate space.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/properties" className="text-foreground/60 hover:text-primary">
                    Browse
                  </Link>
                </li>
                <li>
                  <Link href="/agents" className="text-foreground/60 hover:text-primary">
                    Agents
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/policies/terms-of-service" className="text-foreground/60 hover:text-primary">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/policies/privacy-policy" className="text-foreground/60 hover:text-primary">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Contact</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li>support@propertyhub.com</li>
                <li>+1 (555) 123-4567</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/50 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-foreground/60">
            <p>&copy; 2025 PropertyHub. All rights reserved.</p>
            <p>Made with love for real estate professionals and seekers.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
