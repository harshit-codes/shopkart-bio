"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  // Navigation links
  const navLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Brands", href: "/dashboard/brands" },
    { name: "Products", href: "/dashboard/products" },
    { name: "Orders", href: "/dashboard/orders" },
    { name: "Analytics", href: "/dashboard/analytics" },
    { name: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            ShopKart.bio
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm">Welcome, {user.name}</span>
            <Button variant="outline" size="sm" onClick={signOut}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="container flex gap-8 py-8">
        {/* Sidebar Navigation */}
        <aside className="sticky top-24 hidden h-fit w-56 shrink-0 rounded-lg border bg-card p-4 shadow-sm md:block">
          <nav className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex rounded-md px-3 py-2 text-sm font-medium ${
                  pathname === link.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}