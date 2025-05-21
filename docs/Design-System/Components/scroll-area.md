# Scroll Area Component

The Scroll Area component is a custom scrollable container that provides cross-browser styling while preserving native scrolling functionality.

## Usage

```tsx
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ScrollAreaDemo() {
  return (
    <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium">Content Title</h4>
        <p className="text-sm">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit...
          {/* Long content here */}
        </p>
      </div>
    </ScrollArea>
  );
}
```

## Props

| Prop      | Type                  | Default     | Description                                   |
| --------- | --------------------- | ----------- | --------------------------------------------- |
| type      | `auto` \| `always` \| `scroll` \| `hover` | `auto`     | When to show the scrollbar                   |
| dir       | `ltr` \| `rtl`        | `ltr`       | Text direction                                |
| scrollHideDelay | `number`        | `600`       | Delay before scrollbar hides (ms)             |
| className | `string`              | `undefined` | Additional CSS classes                        |

## Features

- Cross-browser consistent styling
- Native scrolling behavior for performance
- Customizable scrollbar appearance
- Support for both vertical and horizontal scrolling
- Automatic or always-visible scrollbar options

## Accessibility

- Preserves native scrolling keyboard interactions
- Maintains focus behavior of native scroll areas
- Properly communicates scrollable regions to assistive technology

## Customization

The Scroll Area component can be customized by modifying `/components/ui/scroll-area.tsx`. The component is built on top of Radix UI's Scroll Area primitive.

## Examples

### Scrollable List

```tsx
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ScrollableList() {
  const items = Array.from({ length: 50 }).map((_, i) => `Item ${i + 1}`);
  
  return (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 font-medium">Items</h4>
        {items.map((item) => (
          <div
            key={item}
            className="text-sm"
          >
            {item}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
```