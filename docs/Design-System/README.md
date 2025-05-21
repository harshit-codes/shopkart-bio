# Design System Components

This directory contains documentation for the component library used in ShopKart.bio.

## Overview

ShopKart.bio uses [Shadcn UI](https://ui.shadcn.com/), a collection of reusable components built on top of Radix UI and Tailwind CSS. This approach provides:

- Accessible and customizable components
- Consistent design language across the application
- Type-safe components with TypeScript
- Easy integration with Next.js

## Core Components

The following components are currently used in the application:

- [Button](./components/button.md): For various actions across the application
- [Sheet](./components/sheet.md): For sidebar and modal interfaces
- [Scroll Area](./components/scroll-area.md): For scrollable content areas 

## Customization

All components can be customized by modifying their source files in `/components/ui/`. The design tokens are defined in Tailwind CSS configuration and can be adjusted in `tailwind.config.js`.

## Guidelines

When using or extending the design system:

1. Maintain accessibility standards (WCAG 2.1 AA)
2. Keep components consistent with the overall design language
3. Document any significant modifications
4. Test components across different screen sizes

## Adding New Components

To add a new Shadcn UI component:

1. Use the CLI: `npx shadcn-ui@latest add [component-name]`
2. Document the component with usage examples
3. Update this index with a link to the new component documentation

## Resources

- [Shadcn UI Documentation](https://ui.shadcn.com/docs)
- [Radix UI Primitives](https://radix-ui.com/primitives)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
