"use client";
import { useState } from "react";
import Link from "next/link";

interface NavItem {
  href: string;
  label: string;
}

interface MobileNavProps {
  title: string;
  titleColor: string;
  accentColor: string;
  hoverBg: string;
  hoverText: string;
  navItems: NavItem[];
  userName?: string;
  logoutAction: () => void;
}

export default function MobileNav({
  title,
  titleColor,
  accentColor,
  hoverBg,
  hoverText,
  navItems,
  userName,
  logoutAction,
}: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className={`lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-md flex items-center justify-between px-4 py-3 print:hidden`}>
        <span className={`text-lg font-bold ${titleColor}`}>{title}</span>
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
        >
          {open ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Slide-in drawer */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 flex flex-col transform transition-transform duration-300 print:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className={`p-4 text-xl font-bold ${titleColor} border-b flex items-center justify-between`}>
          {title}
          <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {userName && (
          <div className="px-4 py-3 text-sm font-medium text-gray-500 border-b">
            Welcome, {userName}
          </div>
        )}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center px-4 py-3 rounded-lg text-gray-700 font-medium hover:${hoverBg} hover:${hoverText} transition-colors`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <form action={logoutAction}>
            <button className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium">
              Logout
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
