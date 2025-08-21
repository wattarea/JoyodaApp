"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Wrench, Workflow, HeadphonesIcon } from "lucide-react"

const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Tools",
    href: "/admin/metools",
    icon: Wrench,
  },
  {
    title: "n8n",
    href: "/admin/n8n",
    icon: Workflow,
  },
  {
    title: "Support",
    href: "/admin/support",
    icon: HeadphonesIcon,
  },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm mb-6">
      {adminNavItems.map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-purple-100 text-purple-700"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
            )}
          >
            <Icon className="h-4 w-4" />
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}
