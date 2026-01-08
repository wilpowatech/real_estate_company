"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Building2, Users, LogOut, MessageSquare } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function AdminSidebar() {
  const pathname = usePathname()
  const supabase = createClient()
  const router = useRouter()

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/properties", label: "Properties", icon: Building2 },
    { href: "/admin/agents", label: "Agents", icon: Users },
    { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col">
      <Link href="/admin" className="mb-8">
        <h1 className="text-2xl font-bold">RealEstate Admin</h1>
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
