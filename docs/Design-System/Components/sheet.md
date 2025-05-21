# Sheet Component

The Sheet component is a slide-out panel that appears from the edge of the screen. It's commonly used for side navigation, filters, or forms that don't require the full context of the page.

## Usage

```tsx
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        {/* Sheet content goes here */}
      </SheetContent>
    </Sheet>
  );
}
```

## Components

The Sheet is composed of multiple components:

| Component        | Description                                             |
| ---------------- | ------------------------------------------------------- |
| `Sheet`          | The main container component                            |
| `SheetTrigger`   | The button that opens the sheet                         |
| `SheetContent`   | The content container for the sheet                     |
| `SheetHeader`    | Optional header section                                 |
| `SheetTitle`     | Title component for the sheet                           |
| `SheetDescription` | Description text for the sheet                        |
| `SheetFooter`    | Optional footer section                                 |
| `SheetClose`     | Button to close the sheet                               |

## Props

### SheetContent Props

| Prop      | Type                                         | Default   | Description                         |
| --------- | -------------------------------------------- | --------- | ----------------------------------- |
| side      | `top` \| `right` \| `bottom` \| `left`       | `right`   | The side the sheet appears from     |
| className | `string`                                     | `undefined` | Additional CSS classes             |

## Accessibility

- Traps focus within the sheet when open
- Supports keyboard navigation and escape key to close
- Includes ARIA attributes for screen readers
- Adds an overlay to indicate the rest of the page is inert

## Customization

The Sheet component can be customized by modifying `/components/ui/sheet.tsx` and `/components/ui/sheet/index.tsx`. The styles are defined using Tailwind CSS classes.

## Examples

### Side Navigation Sheet

```tsx
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";

export default function NavSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <MenuIcon className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <nav className="mt-8 flex flex-col gap-2">
          <a href="#" className="px-2 py-1 hover:underline">Home</a>
          <a href="#" className="px-2 py-1 hover:underline">Products</a>
          <a href="#" className="px-2 py-1 hover:underline">About</a>
          <a href="#" className="px-2 py-1 hover:underline">Contact</a>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
```