import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    name: string
    href: string
    icon?: React.ReactNode
  }[]
}

export function Sidebar({ className, items, ...props }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile navigation */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[240px]">
          <div className="px-2 py-6">
            <Link href="/" className="text-xl font-bold">
              ShopKart.bio
            </Link>
          </div>
          <ScrollArea className="h-[calc(100vh-120px)]">
            <nav className="space-y-1 px-2">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </nav>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Desktop navigation */}
      <aside
        className={cn(
          "sticky top-24 hidden h-[calc(100vh-200px)] w-56 shrink-0 rounded-lg border bg-card p-4 shadow-sm md:block",
          className
        )}
        {...props}
      >
        <ScrollArea className="h-full w-full">
          <nav className="space-y-1">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
        </ScrollArea>
      </aside>
    </>
  )
}