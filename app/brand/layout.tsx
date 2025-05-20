import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            ShopKart.bio
          </Link>
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t bg-muted/20 py-8">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex flex-col items-center gap-2 md:items-start">
              <Link href="/" className="text-xl font-bold">
                ShopKart.bio
              </Link>
              <p className="text-sm text-muted-foreground">
                Create your brand and sell products or services online
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 md:items-end">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} ShopKart.bio. All rights reserved.
              </p>
              <div className="flex gap-4">
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                  Terms
                </Link>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                  Privacy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}