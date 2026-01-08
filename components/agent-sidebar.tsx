"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Building2, PlusCircle, BarChart3, LogOut, MessageSquare } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function AgentSidebar() {
  const pathname = usePathname()
  const supabase = createClient()
  const router = useRouter()

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/listings", label: "My Listings", icon: Building2 },
    { href: "/dashboard/add-property", label: "Add Property", icon: PlusCircle },
    { href: "/dashboard/inquiries", label: "Inquiries", icon: MessageSquare },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col">
      <Link href="/dashboard" className="mb-8">
        <h1 className="text-2xl font-bold">Agent Dashboard</h1>
      </Link>

      <nav className="flex-1 space-y-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/")
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors w-full"
      >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>
    </aside>
  )
}
