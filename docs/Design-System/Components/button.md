# Button Component

The Button component is a versatile interactive element used throughout the application for triggering actions.

## Usage

```tsx
import { Button } from "@/components/ui/button";

export default function Example() {
  return (
    <div className="flex gap-4">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  );
}
```

## Props

The Button component accepts all standard HTML button properties plus the following:

| Prop      | Type                                                                     | Default     | Description                                    |
| --------- | ------------------------------------------------------------------------ | ----------- | ---------------------------------------------- |
| variant   | `default` \| `destructive` \| `outline` \| `secondary` \| `ghost` \| `link` | `default`   | The visual style of the button                 |
| size      | `default` \| `sm` \| `lg` \| `icon`                                        | `default`   | The size of the button                         |
| asChild   | `boolean`                                                                | `false`     | Change the default rendered element            |
| className | `string`                                                                 | `undefined` | Additional CSS classes to apply to the button  |

## Variants

- **default**: Primary action, high emphasis
- **destructive**: For destructive actions like delete or remove
- **outline**: Medium emphasis, secondary actions
- **secondary**: Alternative styling for secondary actions
- **ghost**: Low emphasis, preserves space but with minimal visual presence
- **link**: Renders like a hyperlink

## Sizes

- **default**: Standard size for most contexts
- **sm**: Smaller size for compact UIs
- **lg**: Larger size for prominent actions
- **icon**: Square button optimized for icons

## Accessibility

- Includes proper focus states for keyboard navigation
- Uses appropriate ARIA attributes
- Maintains color contrast ratios

## Customization

The button component can be customized by modifying `/components/ui/button.tsx`. The styles are defined using the `class-variance-authority` package for variant management.

## Examples

### Icon Button

```tsx
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export default function IconButton() {
  return (
    <Button size="icon">
      <PlusIcon className="h-4 w-4" />
    </Button>
  );
}
```

### Button with Loading State

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";

export default function LoadingButton() {
  const [isLoading, setIsLoading] = useState(false);
  
  function handleClick() {
    setIsLoading(true);
    // Simulating an async action
    setTimeout(() => setIsLoading(false), 2000);
  }
  
  return (
    <Button disabled={isLoading} onClick={handleClick}>
      {isLoading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
      Save Changes
    </Button>
  );
}
```