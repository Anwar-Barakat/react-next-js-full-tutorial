# UI Libraries Guide

A comprehensive guide to shadcn/ui and Aceternity UI for building modern React interfaces.

## Table of Contents

1. [What is shadcn/ui?](#1-what-is-shadcnui)
2. [How does shadcn/ui work?](#2-how-does-shadcnui-work)
3. [Setting up shadcn/ui](#3-setting-up-shadcnui)
4. [Using shadcn/ui Components](#4-using-shadcnui-components)
5. [Theming and Customization](#5-theming-and-customization)
6. [shadcn/ui with React Hook Form and Zod](#6-shadcnui-with-react-hook-form-and-zod)
7. [What is Aceternity UI?](#7-what-is-aceternity-ui)
8. [Setting up Aceternity UI](#8-setting-up-aceternity-ui)
9. [Popular Aceternity Components](#9-popular-aceternity-components)
10. [shadcn/ui vs Aceternity UI](#10-shadcnui-vs-aceternity-ui)
11. [Combining shadcn/ui and Aceternity UI](#11-combining-shadcnui-and-aceternity-ui)

---

## 1. What is shadcn/ui?

- shadcn/ui is a collection of **copy-paste React components** built with Radix UI primitives and styled with Tailwind CSS.
- It is **not a component library you install as a dependency** — you copy the component source code directly into your project.
- This means you own the code and can customize every part of every component.
- Built on top of Radix UI (accessible, unstyled primitives) + Tailwind CSS (utility styling).

**Key philosophy:**
> "This is not a component library. It's a collection of re-usable components that you can copy and paste into your apps."

**Why developers love shadcn/ui:**
- You own the code — no version lock-in.
- Fully customizable — change styles, behavior, and markup freely.
- Accessible by default (Radix UI handles ARIA, keyboard nav, focus management).
- Works perfectly with TypeScript.
- Integrates directly with React Hook Form and Zod.

In short: shadcn/ui gives you beautiful, accessible components that live in your codebase — not inside a `node_modules` black box.

---

## 2. How does shadcn/ui work?

1. You run `npx shadcn-ui@latest add button` → the CLI copies `button.tsx` into `components/ui/button.tsx`.
2. You import and use it like any regular component.
3. You modify the file however you want — it's your code.

```
shadcn CLI → copies component source → your project/components/ui/
                                              ↓
                                     You edit it directly
```

**Dependencies installed with each component:**
- Radix UI primitive (`@radix-ui/react-dialog`, etc.)
- `class-variance-authority` (cva) — for variant-based styling.
- `clsx` + `tailwind-merge` — for conditional class merging.

---

## 3. Setting up shadcn/ui

```bash
# New Next.js project (includes shadcn setup)
npx create-next-app@latest my-app --typescript --tailwind

# Initialize shadcn/ui in existing project
npx shadcn-ui@latest init
```

The `init` command will ask:
- Which style? (Default / New York)
- Base color? (Slate, Gray, Zinc, Neutral, Stone)
- CSS variables for colors? (yes recommended)

**Files created:**
- `components.json` — shadcn configuration
- `lib/utils.ts` — the `cn()` helper function
- `app/globals.css` — CSS variables for theming

**`lib/utils.ts`:**

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
```

**Add components:**

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add form
npx shadcn-ui@latest add table
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add avatar
```

---

## 4. Using shadcn/ui Components

**Button:**

```tsx
import { Button } from '@/components/ui/button';

export default function Page() {
    return (
        <div>
            <Button>Default</Button>
            <Button variant="destructive">Delete</Button>
            <Button variant="outline">Cancel</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
            <Button disabled>Disabled</Button>
        </div>
    );
}
```

**Dialog (Modal):**

```tsx
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function ConfirmDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="destructive">Delete Post</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                </DialogHeader>
                <p>This action cannot be undone.</p>
                <Button variant="destructive">Yes, delete it</Button>
            </DialogContent>
        </Dialog>
    );
}
```

**Table:**

```tsx
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

export default function UsersTable({ users }: { users: User[] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map(user => (
                    <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
```

**Toast notifications:**

```tsx
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

export default function SaveButton() {
    const { toast } = useToast();

    function handleSave() {
        toast({
            title:       'Saved!',
            description: 'Your changes have been saved.',
        });
    }

    return <Button onClick={handleSave}>Save</Button>;
}
```

---

## 5. Theming and Customization

shadcn/ui uses CSS variables for theming — defined in `globals.css`:

```css
@layer base {
    :root {
        --background: 0 0% 100%;
        --foreground: 222.2 84% 4.9%;
        --primary: 222.2 47.4% 11.2%;
        --primary-foreground: 210 40% 98%;
        --secondary: 210 40% 96.1%;
        --destructive: 0 72.2% 50.6%;
        --border: 214.3 31.8% 91.4%;
        --radius: 0.5rem;
    }

    .dark {
        --background: 222.2 84% 4.9%;
        --foreground: 210 40% 98%;
        --primary: 210 40% 98%;
        --primary-foreground: 222.2 47.4% 11.2%;
    }
}
```

**Dark mode toggle:**

```tsx
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
            {theme === 'dark' ? <Sun /> : <Moon />}
        </Button>
    );
}
```

**Customizing a component** — just edit the file directly:

```tsx
// components/ui/button.tsx
// Change default variant colors, sizes, or add new variants
const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-md text-sm font-medium',
    {
        variants: {
            variant: {
                default:     'bg-primary text-primary-foreground hover:bg-primary/90',
                destructive: 'bg-red-600 text-white hover:bg-red-700',        // customized
                success:     'bg-green-600 text-white hover:bg-green-700',    // new variant
            },
        },
    }
);
```

---

## 6. shadcn/ui with React Hook Form and Zod

shadcn/ui has a dedicated `Form` component designed to work with React Hook Form + Zod:

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Form, FormControl, FormField, FormItem,
    FormLabel, FormMessage,
} from '@/components/ui/form';
import { Input }  from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
    name:  z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
});

type FormValues = z.infer<typeof formSchema>;

export default function UserForm() {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: { name: '', email: '' },
    });

    function onSubmit(values: FormValues) {
        console.log(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />  {/* shows Zod error */}
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Saving...' : 'Save'}
                </Button>
            </form>
        </Form>
    );
}
```

---

## 7. What is Aceternity UI?

- **Aceternity UI** is a collection of **animated, visually stunning React components** built with Framer Motion and Tailwind CSS.
- Focuses on modern design with smooth animations, glassmorphism, gradients, and 3D effects.
- Components are also copy-paste style — you copy the source into your project.
- Best used for landing pages, hero sections, portfolios, and marketing sites.

**What makes Aceternity different from shadcn/ui:**
- shadcn/ui → utility components (forms, tables, modals) — functional and clean.
- Aceternity UI → showcase components (animated cards, glowing effects, 3D) — visually impressive.

In short: Aceternity UI is for making your UI look visually stunning with animations and effects.

---

## 8. Setting up Aceternity UI

```bash
# Install dependencies
npm install framer-motion clsx tailwind-merge
```

Aceternity components are copied manually from [ui.aceternity.com](https://ui.aceternity.com/components). Each component page shows the full source code to copy.

**Required `tailwind.config.ts` additions** (for animations):

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
    content: ['./src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            animation: {
                'shimmer':        'shimmer 2s linear infinite',
                'spotlight':      'spotlight 2s ease .75s 1 forwards',
                'scroll':         'scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite',
                'aurora':         'aurora 60s linear infinite',
            },
            keyframes: {
                shimmer: {
                    from: { backgroundPosition: '0 0' },
                    to:   { backgroundPosition: '-200% 0' },
                },
                aurora: {
                    from: { backgroundPosition: '50% 50%, 50% 50%' },
                    to:   { backgroundPosition: '350% 50%, 350% 50%' },
                },
            },
        },
    },
};

export default config;
```

---

## 9. Popular Aceternity Components

**Spotlight Effect:**

```tsx
'use client';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const Spotlight = ({
    className,
    fill,
}: {
    className?: string;
    fill?: string;
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
                'absolute -top-40 -left-10 md:-left-32 md:-top-20 h-screen',
                className
            )}
        >
            <svg /* spotlight SVG */ />
        </motion.div>
    );
};

// Usage
export default function Hero() {
    return (
        <div className="relative h-screen bg-black">
            <Spotlight fill="white" className="-top-40 left-0 md:left-60" />
            <h1 className="text-white text-5xl font-bold">Hello World</h1>
        </div>
    );
}
```

**Infinite Moving Cards:**

```tsx
// Copy from ui.aceternity.com/components/infinite-moving-cards
import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards';

const testimonials = [
    { quote: 'Amazing product!', name: 'Anwar', title: 'Developer' },
    { quote: 'Incredible work.',  name: 'Sara',  title: 'Designer' },
];

export default function Testimonials() {
    return (
        <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="slow"
        />
    );
}
```

**Glowing Stars Background:**

```tsx
import { StarsBackground } from '@/components/ui/stars-background';
import { ShootingStars }   from '@/components/ui/shooting-stars';

export default function HeroSection() {
    return (
        <div className="relative h-screen bg-neutral-900 flex items-center justify-center">
            <StarsBackground />
            <ShootingStars />
            <h1 className="text-white text-6xl font-bold z-10">
                Welcome
            </h1>
        </div>
    );
}
```

**Animated Cards (Card Hover Effect):**

```tsx
import { HoverEffect } from '@/components/ui/card-hover-effect';

const projects = [
    { title: 'Laravel App',  description: 'Full-stack Laravel + React app.', link: '#' },
    { title: 'Next.js Site', description: 'Modern SSR website.',            link: '#' },
];

export default function ProjectsSection() {
    return (
        <div className="max-w-5xl mx-auto px-8">
            <HoverEffect items={projects} />
        </div>
    );
}
```

**Typewriter Effect:**

```tsx
import { TypewriterEffect } from '@/components/ui/typewriter-effect';

export default function Hero() {
    const words = [
        { text: 'Build' },
        { text: 'awesome' },
        { text: 'apps', className: 'text-blue-500' },
    ];

    return <TypewriterEffect words={words} />;
}
```

---

## 10. shadcn/ui vs Aceternity UI

| Feature | shadcn/ui | Aceternity UI |
|---------|-----------|---------------|
| **Purpose** | Functional UI components | Animated/visual showcase components |
| **Components** | Button, Form, Table, Dialog, Toast | Spotlight, Cards, Stars, Typewriter |
| **Animation** | Minimal | Heavy (Framer Motion) |
| **Performance** | Lightweight | Heavier (animations) |
| **Accessibility** | Excellent (Radix UI) | Basic |
| **Best for** | Apps, dashboards, forms | Landing pages, portfolios |
| **Theming** | CSS variables (dark/light) | Tailwind classes |
| **TypeScript** | First-class | Good |

In short: Use **shadcn/ui** for app UI (forms, tables, dialogs). Use **Aceternity UI** for marketing/landing pages where visual impact matters.

---

## 11. Combining shadcn/ui and Aceternity UI

They work well together — use each for what it does best:

```tsx
// Landing page — hero with Aceternity, form with shadcn/ui
export default function LandingPage() {
    return (
        <main>
            {/* Aceternity — visual hero section */}
            <section className="relative h-screen bg-black">
                <Spotlight fill="white" />
                <StarsBackground />
                <TypewriterEffect words={[{ text: 'Welcome' }]} />
            </section>

            {/* shadcn/ui — functional form */}
            <section className="max-w-md mx-auto py-20">
                <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <Button type="submit" className="w-full mt-4">Send</Button>
                    </form>
                </Form>
            </section>
        </main>
    );
}
```
