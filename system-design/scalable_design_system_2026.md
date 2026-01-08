---
date: 2026-01-07
description: Master frontend system design interviews with this comprehensive 2026 guide. Learn to design scalable design systems handling 1M+ users with modern tools like design tokens, OKLCH colors, React Server Components, and WCAG 3.0.
premium: false
---

# 🎨 Frontend System Design Interview Guide for 2026: How to Design a Scalable Design System That Handles 1M+ Users

**Target Level:** Senior Frontend Engineer / Staff Engineer  
**Duration:** 45-60 minutes  
**Interview Focus:** Component Architecture, Design Tokens, Theming, Scalability, Performance, Accessibility

> **Interview Importance:** 🔴 Critical — Frontend system design rounds are now standard at FAANG and product-focused companies. Unlike algorithm interviews, this evaluates your ability to build real production systems. Design systems directly impact developer productivity, user experience, and business velocity — making this one of the highest-leverage skills for senior engineers.

---

## Interview Approach & What Interviewers Look For

When asked to design a scalable design system in a frontend interview, interviewers are evaluating:

1. **Requirements Gathering:** Can you ask the right questions to scope the problem effectively?
2. **Architectural Thinking:** Do you understand the layers of a design system (tokens → primitives → composites)?
3. **Modern Best Practices:** Are you current with 2026 technologies (design tokens, OKLCH, React Server Components, WCAG 3.0)?
4. **Performance at Scale:** Can you optimize for 1M+ users with code-splitting, tree-shaking, and edge caching?
5. **Developer Experience:** Can you design APIs that teams actually want to use?
6. **Trade-off Analysis:** Do you understand when to prioritize flexibility vs constraints, performance vs DX?

**Pro Tip:** Interviewers want to see you think like a product engineer, not just a coder. Start by understanding the business constraints (team size, deployment frequency, user base) before diving into technical solutions.

---

## 1️⃣ Why Frontend System Design Matters Now (2025–2026 Trends)

### The Modern Frontend Landscape

The frontend ecosystem has evolved dramatically:

**Component Explosion:**
- Average enterprise React app: 500-2000 components
- Without a design system: 40% code duplication, inconsistent UX
- With a design system: 15% duplication, unified brand identity

**Design System Fatigue:**
- Teams are tired of maintaining custom design systems
- Rise of headless UI libraries (Radix, Headless UI, shadcn/ui)
- Trend: Build on top of primitives instead of from scratch

**AI-Generated UI Pressure:**
- AI tools (v0.dev, ChatGPT) generate UI code instantly
- Challenge: Ensuring AI-generated code follows design system patterns
- Solution: Well-documented component APIs that AI can learn

**Business Impact Table:**

| Challenge | Without Design System | With Design System | ROI |
|-----------|----------------------|-------------------|-----|
| **Time to Ship Feature** | 2-3 weeks (design → dev → review) | 3-5 days (reuse components) | 70% faster |
| **Design Consistency** | 60% brand adherence | 95% brand adherence | Better UX, higher conversion |
| **Onboarding New Devs** | 4-6 weeks to productivity | 1-2 weeks to productivity | 3x faster ramp-up |
| **Accessibility Bugs** | 40% of components fail WCAG | 5% failure rate | Legal compliance, inclusive UX |
| **Bundle Size** | 500KB+ per page | 150KB per page | Faster loads = better Core Web Vitals |

---

## 2️⃣ Core Requirements Breakdown

Before designing anything, clarify requirements with your interviewer:

### Functional Requirements

**Component Scope:**
- How many components? (10 primitives? 50 composites? 200 patterns?)
- Which components are highest priority? (Button, Input, Modal, Table?)
- Do we need form components with validation?

**Theming Requirements:**
- Light/dark mode support?
- Multi-brand support (white-label)?
- Regional variants (different colors per market)?
- User-customizable themes?

**Platform Support:**
- Web only? Mobile web? React Native?
- SSR (Server-Side Rendering) required?
- Framework-agnostic or React-specific?

**Developer Experience:**
- TypeScript support?
- Auto-completion in IDEs?
- Documentation site (Storybook)?

### Non-Functional Requirements

**Scale:**
- How many users? (100K? 1M? 10M+?)
- How many teams consuming the design system? (5 teams? 50 teams?)
- How many deploys per day? (1? 10? 100?)

**Performance:**
- Bundle size budget? (<100KB? <200KB?)
- Time to Interactive target? (<2s? <3s?)
- Core Web Vitals targets? (LCP <2.5s, FID <100ms, CLS <0.1)

**Accessibility:**
- WCAG 2.1 AA compliance? WCAG 2.2? WCAG 3.0 preview?
- Keyboard navigation? Screen reader support?
- Internationalization (i18n)? Right-to-left (RTL) languages?

**Maintainability:**
- Versioning strategy? (Semantic versioning? Independent component versions?)
- Deprecation policy? (Support old versions for how long?)
- Breaking change process?

---

## 3️⃣ High-Level Architecture

### Layer-Based Design System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    DESIGN SYSTEM LAYERS                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  LAYER 1: DESIGN TOKENS (Single Source of Truth)                │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Colors (OKLCH color space for perceptual uniformity)     │ │
│  │  • --color-primary: oklch(0.65 0.25 260)                  │ │
│  │  • --color-neutral-50: oklch(0.98 0 0)                    │ │
│  │                                                             │ │
│  │  Typography (Type scale + font families)                  │ │
│  │  • --font-size-sm: 0.875rem (14px)                        │ │
│  │  • --line-height-tight: 1.25                              │ │
│  │                                                             │ │
│  │  Spacing (8px base grid)                                  │ │
│  │  • --space-1: 0.25rem (4px)                               │ │
│  │  • --space-4: 1rem (16px)                                 │ │
│  │                                                             │ │
│  │  Shadows, Radii, Z-index, Animations                      │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 2: PRIMITIVE COMPONENTS (Atoms)                          │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Button, Input, Text, Icon, Badge, Spinner, Avatar       │ │
│  │  • Directly consume design tokens                         │ │
│  │  • No business logic                                      │ │
│  │  • Fully accessible (ARIA attributes)                     │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 3: COMPOSITE COMPONENTS (Molecules)                      │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Card, Modal, Dropdown, Tabs, Tooltip, Alert             │ │
│  │  • Combine multiple primitives                            │ │
│  │  • Stateful logic (open/close, selection)                │ │
│  │  • Composable patterns                                    │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 4: PATTERN COMPONENTS (Organisms)                        │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  DataTable, Form, Navigation, SearchBar, FileUploader    │ │
│  │  • Complex business logic                                 │ │
│  │  • Domain-specific features                               │ │
│  │  • Highly configurable                                    │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 5: INFRASTRUCTURE                                        │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  • Theme Provider (CSS variables injection)              │ │
│  │  • i18n Provider (Translation context)                    │ │
│  │  • A11y Provider (Focus management, announcements)        │ │
│  │  • Performance (Code-splitting, tree-shaking)             │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack for 2026

**Design Tokens:**
- **Storage Format:** Style Dictionary (JSON/YAML) → compile to CSS, JS, iOS, Android
- **Color Space:** OKLCH (perceptually uniform, future-proof for HDR displays)
- **Why OKLCH?** Better than HSL for gradients, accessible contrast calculations, wide color gamut support

**Component Framework:**
- **Base:** React 19+ with Server Components support
- **Headless Primitives:** Radix UI or React Aria (accessibility built-in)
- **Styling:** CSS Modules + CSS Variables (or Tailwind with design tokens)

**Performance:**
- **Code Splitting:** Dynamic imports for heavy components (DataTable, RichTextEditor)
- **Tree Shaking:** ES modules, side-effect-free code
- **Partial Prerendering (PPR):** Static shell + dynamic islands (Next.js 15+)
- **Edge Caching:** CDN-cached component library assets

**Accessibility:**
- **WCAG 3.0 Preview:** Prepare for new contrast algorithms (APCA)
- **Automated Testing:** axe-core, Testing Library, Pa11y CI
- **Focus Management:** Roving tabindex for complex widgets

**Developer Experience:**
- **TypeScript:** Strict mode, discriminated unions for variants
- **Documentation:** Storybook 8+ with interactive examples
- **Version Control:** Changesets for semantic versioning

---

## 4️⃣ Step-by-Step Design Approach

### Step 1: Establish Design Tokens

Design tokens are the **single source of truth** for all design decisions.

**Token Structure:**

```json
{
  "color": {
    "primary": {
      "50": { "value": "oklch(0.95 0.05 260)" },
      "500": { "value": "oklch(0.65 0.25 260)" },
      "900": { "value": "oklch(0.25 0.15 260)" }
    },
    "semantic": {
      "success": { "value": "{color.green.500}" },
      "error": { "value": "{color.red.500}" },
      "warning": { "value": "{color.yellow.600}" }
    }
  },
  "spacing": {
    "1": { "value": "0.25rem" },
    "2": { "value": "0.5rem" },
    "4": { "value": "1rem" }
  },
  "typography": {
    "size": {
      "sm": { "value": "0.875rem" },
      "base": { "value": "1rem" },
      "lg": { "value": "1.125rem" }
    }
  }
}
```

**Compile to CSS Variables:**

```css
:root {
  /* Colors (OKLCH for wide gamut) */
  --color-primary-50: oklch(0.95 0.05 260);
  --color-primary-500: oklch(0.65 0.25 260);
  --color-primary-900: oklch(0.25 0.15 260);
  
  /* Semantic colors */
  --color-success: var(--color-green-500);
  --color-error: var(--color-red-500);
  
  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  
  /* Typography */
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
}

/* Dark mode override */
[data-theme="dark"] {
  --color-primary-50: oklch(0.15 0.05 260);
  --color-primary-900: oklch(0.90 0.15 260);
}
```

### Step 2: Create Primitive Components

**Example: Button Component**

```typescript
// button.tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  // Base styles using design tokens
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-[var(--color-primary-500)] text-white hover:bg-[var(--color-primary-600)]',
        secondary: 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-200)]',
        ghost: 'hover:bg-[var(--color-neutral-100)] hover:text-[var(--color-neutral-900)]',
        destructive: 'bg-[var(--color-error)] text-white hover:bg-[var(--color-error-dark)]',
      },
      size: {
        sm: 'h-9 px-3 text-[var(--font-size-sm)]',
        md: 'h-10 px-4 text-[var(--font-size-base)]',
        lg: 'h-11 px-8 text-[var(--font-size-lg)]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
```

**Why This Design?**
- **Variants:** CVA (class-variance-authority) provides type-safe variant props
- **Tokens:** All styles reference CSS variables from design tokens
- **Accessibility:** Inherits native button semantics (keyboard, focus, ARIA)
- **Composability:** `asChild` pattern allows rendering as different element

### Step 3: Build Composite Components

**Example: Modal Component (Accessible, Composable)**

```typescript
// modal.tsx
import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const Modal = ({ open, onOpenChange, title, description, children }: ModalProps) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Overlay with backdrop blur */}
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out" />
        
        {/* Modal content */}
        <Dialog.Content
          className="fixed left-[50%] top-[50%] z-50 max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out"
          aria-describedby={description ? 'modal-description' : undefined}
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <Dialog.Title className="text-lg font-semibold">
                {title}
              </Dialog.Title>
              {description && (
                <Dialog.Description id="modal-description" className="mt-1 text-sm text-[var(--color-neutral-600)]">
                  {description}
                </Dialog.Description>
              )}
            </div>
            
            {/* Close button */}
            <Dialog.Close className="rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Dialog.Close>
          </div>
          
          {/* Body */}
          <div className="mt-4">
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
```

**Key Features:**
- **Focus Trap:** Focus stays inside modal (Radix handles this)
- **Escape Key:** Closes modal automatically
- **Screen Reader:** Proper ARIA attributes (title, description, role="dialog")
- **Backdrop Click:** Closes modal (configurable via Radix props)
- **Animations:** Smooth open/close with Tailwind animations

---

## 5️⃣ Real-World Example: Design a Modal + Tooltip + Data Table System

Let's design three essential components that work together.

### Component API Design

**1. Modal API**

```typescript
// Usage
<Modal 
  open={isOpen} 
  onOpenChange={setIsOpen}
  title="Delete User"
  description="This action cannot be undone"
>
  <p>Are you sure you want to delete this user?</p>
  <div className="mt-4 flex gap-2">
    <Button variant="destructive" onClick={handleDelete}>Delete</Button>
    <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
  </div>
</Modal>
```

**2. Tooltip API**

```typescript
// tooltip.tsx
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  delayDuration?: number;
}

export const Tooltip = ({ content, children, side = 'top', delayDuration = 200 }: TooltipProps) => {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          {children}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            className="z-50 rounded-md bg-[var(--color-neutral-900)] px-3 py-1.5 text-sm text-white shadow-md animate-in fade-in-0 zoom-in-95"
            sideOffset={5}
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-[var(--color-neutral-900)]" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};

// Usage
<Tooltip content="Delete user permanently" side="top">
  <Button variant="destructive">Delete</Button>
</Tooltip>
```

**3. Data Table API (with virtualization for 1M+ rows)**

```typescript
// data-table.tsx
import * as React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

interface Column<T> {
  id: string;
  header: string;
  accessor: (row: T) => React.ReactNode;
  width?: number;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowHeight?: number;
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  rowHeight = 48,
  onRowClick,
}: DataTableProps<T>) {
  const parentRef = React.useRef<HTMLDivElement>(null);

  // Virtual scrolling for performance with large datasets
  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 10, // Render 10 extra rows for smooth scrolling
  });

  return (
    <div className="rounded-lg border border-[var(--color-neutral-200)] overflow-hidden">
      {/* Table Header */}
      <div className="bg-[var(--color-neutral-50)] border-b border-[var(--color-neutral-200)]">
        <div className="flex">
          {columns.map((column) => (
            <div
              key={column.id}
              className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-neutral-700)]"
              style={{ width: column.width || 'auto', flex: column.width ? 'none' : 1 }}
            >
              {column.header}
            </div>
          ))}
        </div>
      </div>

      {/* Table Body with Virtual Scrolling */}
      <div
        ref={parentRef}
        className="overflow-auto"
        style={{ height: '400px' }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = data[virtualRow.index];
            return (
              <div
                key={row.id}
                className="absolute top-0 left-0 w-full flex items-center border-b border-[var(--color-neutral-100)] hover:bg-[var(--color-neutral-50)] cursor-pointer"
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <div
                    key={column.id}
                    className="px-4 py-3 text-sm text-[var(--color-neutral-900)]"
                    style={{ width: column.width || 'auto', flex: column.width ? 'none' : 1 }}
                  >
                    {column.accessor(row)}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Usage
const users = [/* 1M user records */];

<DataTable
  data={users}
  columns={[
    { id: 'name', header: 'Name', accessor: (row) => row.name, width: 200 },
    { id: 'email', header: 'Email', accessor: (row) => row.email },
    { id: 'role', header: 'Role', accessor: (row) => <Badge>{row.role}</Badge>, width: 120 },
    { 
      id: 'actions', 
      header: 'Actions', 
      accessor: (row) => (
        <Tooltip content="Delete user">
          <Button variant="ghost" size="sm" onClick={(e) => {
            e.stopPropagation();
            handleDelete(row.id);
          }}>
            Delete
          </Button>
        </Tooltip>
      ),
      width: 100 
    },
  ]}
  onRowClick={(user) => navigate(`/users/${user.id}`)}
/>
```

**Performance Optimizations:**
- **Virtual Scrolling:** Only render visible rows (60fps with 1M rows)
- **Overscan:** Render 10 extra rows for smooth scrolling
- **Memoization:** Use `React.memo` for row components
- **Key Optimization:** Use stable `row.id` instead of index

---

## 6️⃣ Common Interview Questions

### Q1: How do you handle theming at scale across multiple brands?

**Answer:**

Use **design token layers** with brand-specific overrides:

```typescript
// Base tokens (shared)
const baseTokens = {
  spacing: { /* 8px grid */ },
  typography: { /* type scale */ },
};

// Brand A tokens
const brandATokens = {
  ...baseTokens,
  colors: {
    primary: 'oklch(0.65 0.25 260)', // Blue
    secondary: 'oklch(0.70 0.20 150)', // Green
  },
};

// Brand B tokens
const brandBTokens = {
  ...baseTokens,
  colors: {
    primary: 'oklch(0.60 0.25 30)', // Red
    secondary: 'oklch(0.68 0.22 90)', // Yellow
  },
};

// Theme Provider
<ThemeProvider brand={currentBrand}>
  <App />
</ThemeProvider>
```

**Key Points:**
- Shared foundation (spacing, typography) ensures consistency
- Brand-specific tokens override colors/logos
- Runtime theme switching without page reload
- CSS variables make switching instant (no re-render)

### Q2: How do you ensure accessibility (WCAG 2.1 AA) in your design system?

**Answer:**

**4-Layer Accessibility Strategy:**

1. **Built-in at the Primitive Level:**
   - Use headless UI libraries (Radix, React Aria) that handle ARIA, focus, keyboard
   - Every component has `aria-label`, `role`, `aria-describedby`

2. **Automated Testing:**
   ```typescript
   // Jest + Testing Library + axe-core
   test('Button is accessible', async () => {
     const { container } = render(<Button>Click me</Button>);
     const results = await axe(container);
     expect(results).toHaveNoViolations();
   });
   ```

3. **Contrast Validation:**
   - Use OKLCH color space for perceptually uniform colors
   - Automated contrast checker in design token build
   - WCAG 3.0 APCA algorithm for advanced contrast

4. **Documentation & Guidelines:**
   - Every component has accessibility checklist
   - Examples showing keyboard navigation patterns
   - Screen reader testing videos in Storybook

### Q3: How do you optimize bundle size for a design system with 200+ components?

**Answer:**

**5-Point Bundle Optimization Strategy:**

1. **Tree Shaking:**
   ```typescript
   // ❌ BAD: Barrel exports kill tree-shaking
   export * from './components';
   
   // ✅ GOOD: Direct imports
   import { Button } from '@design-system/button';
   import { Modal } from '@design-system/modal';
   ```

2. **Code Splitting:**
   ```typescript
   // Lazy load heavy components
   const DataTable = React.lazy(() => import('@design-system/data-table'));
   const RichTextEditor = React.lazy(() => import('@design-system/editor'));
   ```

3. **CSS Extraction:**
   - Extract critical CSS inline
   - Load component-specific CSS on demand
   - Use Tailwind's JIT mode for minimal CSS

4. **Icon Optimization:**
   ```typescript
   // ❌ BAD: Import entire icon library (500KB)
   import * as Icons from 'lucide-react';
   
   // ✅ GOOD: Import specific icons (2KB)
   import { ChevronDown, X } from 'lucide-react';
   ```

5. **Metrics:**
   - Primitive components: <5KB gzipped each
   - Composite components: <15KB gzipped each
   - Total bundle (50 components): <150KB gzipped

### Q4: How do you version and release changes without breaking existing apps?

**Answer:**

**Semantic Versioning + Changesets Workflow:**

```bash
# Developer makes changes
git checkout -b feat/add-button-loading-state

# Add changeset (describes change + impact)
npx changeset add
# → Select: "minor" (new feature, backward compatible)
# → Write: "Added loading state to Button component"

# Merge PR → CI auto-generates changelog + version bump
# → v2.3.0 → v2.4.0 (minor bump)

# Breaking changes
npx changeset add
# → Select: "major" (breaking change)
# → Write: "BREAKING: Renamed Button prop 'type' to 'variant'"
# → v2.4.0 → v3.0.0 (major bump)
```

**Deprecation Strategy:**
```typescript
// Step 1: Add deprecation warning (v2.5.0)
interface ButtonProps {
  /** @deprecated Use 'variant' instead */
  type?: 'primary' | 'secondary';
  variant?: 'primary' | 'secondary';
}

// Step 2: Support both for 6 months
const Button = ({ type, variant, ...props }) => {
  if (type) {
    console.warn('Button: prop "type" is deprecated, use "variant"');
  }
  const finalVariant = variant || type || 'primary';
  // ...
};

// Step 3: Remove old prop in next major (v3.0.0)
```

### Q5: How do you handle Server-Side Rendering (SSR) and React Server Components?

**Answer:**

**Hybrid Approach for 2026:**

```typescript
// Server Component (RSC) - renders on server, zero JS to client
// app/page.tsx
import { Button } from '@design-system/button'; // Server-compatible

export default function HomePage() {
  return (
    <div>
      <h1>Welcome</h1>
      {/* This button has NO interactivity, pure HTML */}
      <Button>Learn More</Button>
    </div>
  );
}

// Client Component - ships JS for interactivity
// app/modal-demo.tsx
'use client';
import { useState } from 'react';
import { Modal, Button } from '@design-system/react';

export function ModalDemo() {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <Modal open={open} onOpenChange={setOpen}>
        {/* Interactive content */}
      </Modal>
    </>
  );
}
```

**Strategy:**
- **Primitives:** Export both RSC and client versions
  - `@design-system/button` (RSC, zero JS)
  - `@design-system/button/client` (interactive)
- **Composites:** Client-only (modals, dropdowns require JS)
- **Tokens:** CSS variables work in both environments
- **Hydration:** Ensure no mismatches (use `suppressHydrationWarning` carefully)

### Q6: How do you integrate the design system with Tailwind/shadcn?

**Answer:**

**Design Tokens → Tailwind Config:**

```javascript
// tailwind.config.js
const tokens = require('./design-tokens.json');

module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--color-primary-50)',
          500: 'var(--color-primary-500)',
          900: 'var(--color-primary-900)',
        },
        // Auto-generate from tokens
        ...Object.fromEntries(
          Object.entries(tokens.colors).map(([name, value]) => [
            name,
            `var(--color-${name})`,
          ])
        ),
      },
      spacing: tokens.spacing,
      fontSize: tokens.typography.size,
    },
  },
};
```

**shadcn Integration:**
```bash
# Install shadcn with custom config
npx shadcn-ui@latest init

# Add components (uses your tokens)
npx shadcn-ui@latest add button
npx shadcn-ui@latest add modal

# Components are added to your repo (editable)
# src/components/ui/button.tsx
# → Already uses your CSS variables!
```

---

## 7️⃣ Common Pitfalls & Best Practices

### Pitfall 1: Tight Coupling Between Components

**❌ BAD:**
```typescript
// Modal component hardcodes Button
export const Modal = ({ onConfirm }) => {
  return (
    <dialog>
      {/* Can't customize button style */}
      <Button onClick={onConfirm}>Confirm</Button>
    </dialog>
  );
};
```

**✅ GOOD:**
```typescript
// Composable Modal accepts any children
export const Modal = ({ children }) => {
  return <dialog>{children}</dialog>;
};

// Usage - full flexibility
<Modal>
  <p>Are you sure?</p>
  <Button variant="destructive">Delete</Button>
  <Button variant="ghost">Cancel</Button>
</Modal>
```

**Why?** Composability > rigid APIs. Let developers combine primitives freely.

### Pitfall 2: Ignoring Internationalization (i18n)

**❌ BAD:**
```typescript
// Hardcoded English text
<Button>Submit</Button>
<Modal title="Confirm Action" />
```

**✅ GOOD:**
```typescript
// Use i18n library (react-i18next, next-intl)
import { useTranslation } from 'react-i18next';

const MyForm = () => {
  const { t } = useTranslation();
  return <Button>{t('common.submit')}</Button>;
};

// Components accept translated strings
<Modal title={t('modal.confirmAction')} />
```

**Why?** Global products need multi-language support from day 1.

### Pitfall 3: Poor Dark Mode Performance

**❌ BAD:**
```typescript
// Re-render entire app on theme change
const [theme, setTheme] = useState('light');

return (
  <ThemeContext.Provider value={theme}>
    <App /> {/* Everything re-renders! */}
  </ThemeContext.Provider>
);
```

**✅ GOOD:**
```typescript
// Use CSS variables - zero re-renders
const setTheme = (newTheme) => {
  document.documentElement.setAttribute('data-theme', newTheme);
  // CSS automatically updates via:
  // [data-theme="dark"] { --color-bg: black; }
};

// No context needed!
<App />
```

**Why?** CSS variable changes don't trigger React re-renders. Instant theme switch.

### Pitfall 4: Missing Focus Management in Modals

**❌ BAD:**
```typescript
// Focus can escape modal, keyboard users get lost
<dialog>
  <button>Close</button>
</dialog>
```

**✅ GOOD:**
```typescript
// Use Radix/Headless UI for built-in focus management
import * as Dialog from '@radix-ui/react-dialog';

<Dialog.Root>
  <Dialog.Content>
    {/* Focus trapped inside */}
    {/* Escape key closes */}
    {/* Returns focus to trigger */}
  </Dialog.Content>
</Dialog.Root>
```

**Why?** WCAG 2.1 requires focus trapping in modals. Don't reinvent this wheel.

---

## 8️⃣ Performance Considerations for 1M+ Users

### Edge Caching Strategy

```typescript
// Design system assets on CDN
// Cache-Control: public, max-age=31536000, immutable
https://cdn.example.com/design-system@2.4.0/button.js
https://cdn.example.com/design-system@2.4.0/modal.js

// Token CSS cached separately
https://cdn.example.com/tokens/theme-light.css
https://cdn.example.com/tokens/theme-dark.css
```

**Benefits:**
- Component JS cached for 1 year (immutable)
- CDN edge servers in 200+ locations
- Users download once, reuse forever (until version bump)

### Code Splitting per Route

```typescript
// Next.js App Router example
// app/dashboard/page.tsx
const HeavyDataTable = dynamic(() => import('@design-system/data-table'), {
  loading: () => <Skeleton />,
  ssr: false, // Don't need this on server
});

export default function DashboardPage() {
  return (
    <div>
      <Header /> {/* Small, always loaded */}
      <HeavyDataTable data={data} /> {/* Lazy loaded */}
    </div>
  );
}
```

**Metrics:**
- Initial load: 50KB (Header + primitives)
- Dashboard route: +80KB (DataTable)
- Total: 130KB vs 500KB (if all components eager-loaded)

### Web Vitals Optimization

| Metric | Target | Strategy |
|--------|--------|----------|
| **LCP (Largest Contentful Paint)** | <2.5s | Preload critical fonts, optimize images, use `priority` attribute |
| **FID (First Input Delay)** | <100ms | Code-split heavy components, use `requestIdleCallback` |
| **CLS (Cumulative Layout Shift)** | <0.1 | Set explicit width/height on images, avoid dynamic content injection |
| **INP (Interaction to Next Paint)** | <200ms | Debounce expensive operations, use Web Workers for heavy computation |

---

## 9️⃣ Summary & Key Takeaways

### Quick Reference Table

| Aspect | Solution | Tools |
|--------|----------|-------|
| **Design Tokens** | Single source of truth | Style Dictionary, OKLCH colors |
| **Component Architecture** | Atomic Design (atoms → molecules → organisms) | Radix UI, React Aria |
| **Theming** | CSS variables + runtime switching | CSS custom properties, `data-theme` |
| **Accessibility** | WCAG 2.1 AA + automated testing | axe-core, Testing Library, Pa11y |
| **Performance** | Code-splitting + tree-shaking + edge caching | Dynamic imports, Tailwind JIT, CDN |
| **Versioning** | Semantic versioning + changesets | Changesets, Conventional Commits |
| **Documentation** | Interactive examples + API docs | Storybook 8+, TypeDoc |
| **Internationalization** | i18n from day 1 | react-i18next, next-intl |

### 5 Key Takeaways

1. **Tokens First:** Design tokens are the foundation. Get them right, and everything else follows. Use OKLCH for future-proof colors.

2. **Composability > Complexity:** Build small, focused primitives that combine well. Avoid monolithic components with 50 props.

3. **Accessibility is Non-Negotiable:** Use headless UI libraries (Radix, React Aria) that handle ARIA, focus, keyboard. Don't reinvent accessibility.

4. **Performance at Scale:** With 1M+ users, every KB matters. Tree-shake, code-split, cache aggressively. Virtual scrolling for large lists.

5. **Developer Experience = Product Quality:** Great DX (TypeScript, docs, examples) leads to better adoption and fewer bugs. Invest heavily in DX.

---

## 🔟 Bonus: Interview Self-Evaluation Scorecard

Use this to assess your answer during practice:

| Criteria | Points | Did You Cover This? |
|----------|--------|---------------------|
| **Requirements Gathering** | 10 | Asked clarifying questions about scale, teams, performance? |
| **Design Tokens** | 10 | Discussed single source of truth, OKLCH colors, CSS variables? |
| **Component Architecture** | 15 | Explained atomic design, primitives vs composites? |
| **Accessibility** | 15 | Covered WCAG compliance, ARIA, keyboard navigation, screen readers? |
| **Performance** | 15 | Discussed code-splitting, tree-shaking, virtual scrolling, Web Vitals? |
| **Theming** | 10 | Explained light/dark mode, multi-brand support, runtime switching? |
| **Developer Experience** | 10 | TypeScript, documentation, versioning, deprecation strategy? |
| **Trade-offs** | 10 | Discussed when to prioritize flexibility vs constraints? |
| **Modern Stack (2026)** | 5 | Mentioned React Server Components, Partial Prerendering, WCAG 3.0? |
| **Total** | 100 | **Target: 75+** for strong performance |

**Scoring Guide:**
- **90-100:** Staff+ level answer (would get strong hire)
- **75-89:** Senior level answer (solid hire)
- **60-74:** Mid-level answer (acceptable, but missing depth)
- **<60:** Junior level (needs more preparation)

---

## 📚 Further Reading

- [Design Tokens W3C Community Group](https://www.w3.org/community/design-tokens/) - Official spec for design tokens
- [Radix UI Documentation](https://www.radix-ui.com/) - Headless UI primitives with built-in accessibility
- [OKLCH Color Space Explained](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl) - Why OKLCH is the future
- [Web Content Accessibility Guidelines (WCAG) 2.1](https://www.w3.org/WAI/WCAG21/quickref/) - Complete accessibility reference
- [React Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components) - Official React blog
- [Style Dictionary](https://amzn.github.io/style-dictionary/) - Design token transformation tool
- [shadcn/ui](https://ui.shadcn.com/) - Modern component library built on Radix + Tailwind

---

## Final Thoughts

Frontend system design interviews are about demonstrating **strategic thinking**, not just coding skills. Show that you can:

1. **Scope problems** by asking the right questions
2. **Think in systems** (tokens → primitives → composites → patterns)
3. **Balance trade-offs** (flexibility vs constraints, performance vs DX)
4. **Stay current** with 2026 technologies (OKLCH, RSC, WCAG 3.0)
5. **Focus on impact** (developer productivity, user experience, business velocity)

Remember: **The best design systems are invisible**. Developers should feel productive, designers should feel empowered, and users should experience consistent, accessible, fast interfaces. That's the goal.

---

<!-- quiz-start -->
### Q1: Why is OKLCH color space preferred over HSL for design systems in 2026?
- [ ] OKLCH produces smaller CSS file sizes
- [x] OKLCH is perceptually uniform, making it easier to create accessible color scales and gradients
- [ ] OKLCH is faster to render in browsers
- [ ] OKLCH is required by WCAG 3.0

### Q2: What is the primary benefit of using virtual scrolling (virtualization) in a DataTable component?
- [ ] It makes the table look better visually
- [ ] It automatically sorts and filters data
- [x] It only renders visible rows, enabling 60fps performance with millions of rows
- [ ] It reduces the bundle size of the component

### Q3: Which approach provides the best performance for dark mode theme switching?
- [ ] Re-render the entire React tree with new theme context
- [x] Use CSS variables and update `data-theme` attribute (zero React re-renders)
- [ ] Use inline styles on every component
- [ ] Duplicate all components with `-dark` suffix versions
<!-- quiz-end -->
