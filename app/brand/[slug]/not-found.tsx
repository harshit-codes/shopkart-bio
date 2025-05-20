import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <h2 className="mb-2 text-3xl font-bold">Brand Not Found</h2>
      <p className="mb-8 text-muted-foreground">
        The brand you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <Button asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}