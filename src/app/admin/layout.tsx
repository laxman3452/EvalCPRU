import Link from "next/link";
import { auth, signOut } from "../../../auth";
import MobileNav from "@/components/MobileNav";
import Image from "next/image";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/teachers", label: "Teachers" },
  { href: "/admin/students", label: "Students" },
  { href: "/admin/assign", label: "Assignments" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-white shadow-lg flex-col z-30 print:hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
            <img src="/logo.png" alt="CPRU" className="object-contain w-full h-full p-1" />
          </div>
          <div>
            <p className="text-sm font-bold text-blue-700 leading-tight">Admin Portal</p>
            <p className="text-xs text-gray-400 leading-tight">CPRU</p>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <form action={async () => { "use server"; await signOut(); }}>
            <button className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors">
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile nav */}
      <MobileNav
        title="Admin Portal"
        titleColor="text-blue-600"
        accentColor="blue"
        hoverBg="bg-blue-50"
        hoverText="text-blue-600"
        navItems={navItems}
        logoutAction={async () => { "use server"; await signOut(); }}
      />

      {/* Main content — offset for desktop sidebar, top padding for mobile bar */}
      <main className="lg:ml-64 min-h-screen p-4 pt-20 lg:pt-6 lg:p-8 print:p-0 print:ml-0">
        {children}
      </main>
    </div>
  );
}
