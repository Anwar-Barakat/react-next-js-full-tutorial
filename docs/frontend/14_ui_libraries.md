# UI Libraries Guide

A guide to shadcn/ui and Aceternity UI for building modern React interfaces.

---

## shadcn/ui Overview and Setup

- Copy-paste React components built on Radix UI primitives and styled with Tailwind CSS.
- Not an npm dependency — the CLI copies component source into your project so you own and can edit the code.
- Accessible by default (Radix UI), TypeScript-first, integrates with React Hook Form + Zod.
- Each component installs: `@radix-ui/react-*`, `class-variance-authority`, `clsx`, `tailwind-merge`.

```bash
# Initialize in an existing Next.js + Tailwind project
npx shadcn-ui@latest init

# Add components individually
npx shadcn-ui@latest add button input dialog form table toast card
```

The `init` command creates:
- `components.json` — shadcn config
- `lib/utils.ts` — the `cn()` helper
- `app/globals.css` — CSS variable theming

```typescript
// lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
```

---

## Using shadcn/ui Components

**Button:**

```tsx
import { Button } from '@/components/ui/button';

<Button>Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button size="sm" disabled>Small Disabled</Button>
```

**Dialog:**

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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

**Toast:**

```tsx
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

export default function SaveButton() {
    const { toast } = useToast();
    return (
        <Button onClick={() => toast({ title: 'Saved!', description: 'Changes saved.' })}>
            Save
        </Button>
    );
}
```

---

## Theming and Customization

shadcn/ui uses CSS variables in `globals.css` for light/dark theming:

```css
@layer base {
    :root {
        --background: 0 0% 100%;
        --foreground: 222.2 84% 4.9%;
        --primary: 222.2 47.4% 11.2%;
        --destructive: 0 72.2% 50.6%;
        --radius: 0.5rem;
    }
    .dark {
        --background: 222.2 84% 4.9%;
        --foreground: 210 40% 98%;
        --primary: 210 40% 98%;
    }
}
```

To customize a component, edit its source file directly. For example, add a new variant in `components/ui/button.tsx`:

```tsx
const buttonVariants = cva('inline-flex items-center justify-center rounded-md text-sm font-medium', {
    variants: {
        variant: {
            default: 'bg-primary text-primary-foreground hover:bg-primary/90',
            success: 'bg-green-600 text-white hover:bg-green-700', // new variant
        },
    },
});
```

Dark mode toggle using `next-themes`:

```tsx
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    return (
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun /> : <Moon />}
        </Button>
    );
}
```

---

## shadcn/ui with React Hook Form and Zod

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
    name:  z.string().min(2, 'At least 2 characters'),
    email: z.string().email('Invalid email'),
});

type FormValues = z.infer<typeof formSchema>;

export default function UserForm() {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: { name: '', email: '' },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(console.log)} className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl><Input placeholder="Your name" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Saving...' : 'Save'}
                </Button>
            </form>
        </Form>
    );
}
```

---

## Aceternity UI Overview and Setup

- Animated, visually rich React components built with Framer Motion and Tailwind CSS.
- Also copy-paste — browse [ui.aceternity.com](https://ui.aceternity.com/components) and copy the source.
- Best for landing pages, hero sections, and portfolios. Not optimised for dense functional UIs.

```bash
npm install framer-motion clsx tailwind-merge
```

Add animation keyframes to `tailwind.config.ts`:

```typescript
theme: {
    extend: {
        animation: {
            shimmer: 'shimmer 2s linear infinite',
            aurora:  'aurora 60s linear infinite',
        },
        keyframes: {
            shimmer: { from: { backgroundPosition: '0 0' }, to: { backgroundPosition: '-200% 0' } },
            aurora:  { from: { backgroundPosition: '50% 50%' }, to: { backgroundPosition: '350% 50%' } },
        },
    },
},
```

---

## Popular Aceternity Components

**Spotlight + Stars background:**

```tsx
import { StarsBackground } from '@/components/ui/stars-background';
import { ShootingStars }   from '@/components/ui/shooting-stars';
import { Spotlight }       from '@/components/ui/spotlight';

export default function Hero() {
    return (
        <div className="relative h-screen bg-black flex items-center justify-center">
            <Spotlight fill="white" className="-top-40 left-60" />
            <StarsBackground />
            <ShootingStars />
            <h1 className="text-white text-6xl font-bold z-10">Welcome</h1>
        </div>
    );
}
```

**Typewriter effect:**

```tsx
import { TypewriterEffect } from '@/components/ui/typewriter-effect';

const words = [{ text: 'Build' }, { text: 'awesome' }, { text: 'apps', className: 'text-blue-500' }];

export default function Hero() {
    return <TypewriterEffect words={words} />;
}
```

**Card hover effect:**

```tsx
import { HoverEffect } from '@/components/ui/card-hover-effect';

const projects = [
    { title: 'Laravel App',  description: 'Full-stack Laravel + React.', link: '#' },
    { title: 'Next.js Site', description: 'Modern SSR website.',         link: '#' },
];

export default function ProjectsSection() {
    return <HoverEffect items={projects} className="max-w-5xl mx-auto px-8" />;
}
```

---

## shadcn/ui vs Aceternity UI

- **Purpose** — shadcn/ui: functional UI (forms, tables, modals). Aceternity: animated showcases (heroes, effects).
- **Animation** — shadcn/ui: minimal. Aceternity: heavy Framer Motion.
- **Accessibility** — shadcn/ui: excellent (Radix UI). Aceternity: basic.
- **Performance** — shadcn/ui: lightweight. Aceternity: heavier due to animations.
- **Best for** — shadcn/ui: dashboards and apps. Aceternity: landing pages and portfolios.

Use them together: Aceternity for the visual hero, shadcn/ui for functional forms and navigation.
