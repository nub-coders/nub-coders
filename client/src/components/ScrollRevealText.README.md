# ScrollRevealText Component

A smooth, character-by-character text reveal animation component using Framer Motion, inspired by lightswind.com's scroll reveal pattern.

## Features

- Character-by-character animation with blur effect
- Triggers when element enters viewport
- Customizable delay and stagger timing
- Smooth easing transitions
- One-time or repeating animations

## Usage

```tsx
import ScrollRevealText from "@/components/ScrollRevealText";

// Basic usage
<ScrollRevealText text="Hello World" />

// With custom styling
<ScrollRevealText 
  text="Full Stack Developer" 
  className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
/>

// With custom timing
<ScrollRevealText 
  text="Building digital experiences" 
  delay={0.5}
  staggerDelay={0.05}
/>

// Repeating animation
<ScrollRevealText 
  text="Scroll down and up to replay" 
  once={false}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | required | The text to animate |
| `className` | `string` | `""` | Additional CSS classes |
| `delay` | `number` | `0` | Initial delay before animation starts (seconds) |
| `staggerDelay` | `number` | `0.03` | Delay between each character (seconds) |
| `once` | `boolean` | `true` | Whether animation plays once or on every scroll |

## Animation Details

- **Initial state**: Characters are invisible, blurred, and slightly below position
- **Animated state**: Characters become visible, blur removed, and move to normal position
- **Duration**: 0.4 seconds per character
- **Easing**: Cubic bezier [0.25, 0.4, 0.25, 1]
- **Blur effect**: 10px blur fades to 0px
- **Y-axis movement**: 10px upward movement

## Example in Context

```tsx
<section>
  <h1 className="text-5xl mb-4">
    <ScrollRevealText 
      text="Welcome to My Portfolio"
      className="font-bold"
    />
  </h1>
  
  <p className="text-xl">
    <ScrollRevealText 
      text="I create beautiful and functional web experiences"
      delay={0.3}
    />
  </p>
</section>
```

## Notes

- The component automatically detects viewport intersection
- Animation triggers when 50% of the element is visible (default `amount: 0.5`)
- Viewport margin is set to -100px to delay the trigger slightly
- Words are preserved with proper spacing
- The component uses `useInView` hook from Framer Motion for performance
