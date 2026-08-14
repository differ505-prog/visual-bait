import { ReactNode } from "react";
import Link from "next/link";
import { Home, Users, Megaphone, Settings } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const nav = [
    { href: "/admin", label: "民宿管理", icon: Home },
    { href: "/admin/leads", label: "客戶名單", icon: Users },
    { href: "/admin/campaigns", label: "廣告活動", icon: Megaphone },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="px-6 py-5 border-b border-gray-100">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">Visual Bait</p>
          <p className="text-sm font-semibold text-gray-800">管理後台</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <Icon size={16} strokeWidth={1.8} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-gray-100">
          <a
            href="/"
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Settings size={13} />
            回民宿網站
          </a>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
