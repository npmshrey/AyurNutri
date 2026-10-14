/**
 * Colours are CSS variables (see src/styles/tailwind.css) so dark mode can
 * swap them. Tailwind can't apply opacity modifiers like bg-primary/10 to a
 * plain var(), so every tint silently rendered as nothing. Wrapping each
 * token in color-mix() makes the modifiers work while keeping the variables.
 */
const token = (name) => ({ opacityValue }) =>
  opacityValue === undefined || opacityValue === "1"
    ? `var(${name})`
    : `color-mix(in srgb, var(${name}) calc(${opacityValue} * 100%), transparent)`;

/** @type {import('tailwindcss').Config} */
export default {
  // Follow the in-app theme toggle (html[data-theme="dark"]) rather than
  // the operating system setting, so dark: utilities match everything else.
  darkMode: ["selector", '[data-theme="dark"]'],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: token('--color-border'), /* warm-gray-200 */
        input: token('--color-input'), /* white */
        ring: token('--color-ring'), /* calming-sage */
        background: token('--color-background'), /* pure-canvas */
        foreground: token('--color-foreground'), /* gray-900 */
        primary: {
          DEFAULT: token('--color-primary'), /* deep-forest-green */
          foreground: token('--color-primary-foreground'), /* white */
        },
        secondary: {
          DEFAULT: token('--color-secondary'), /* warm-gold */
          foreground: token('--color-secondary-foreground'), /* gray-900 */
        },
        destructive: {
          DEFAULT: token('--color-destructive'), /* muted-red */
          foreground: token('--color-destructive-foreground'), /* white */
        },
        muted: {
          DEFAULT: token('--color-muted'), /* warm-cream */
          foreground: token('--color-muted-foreground'), /* gray-600 */
        },
        accent: {
          DEFAULT: token('--color-accent'), /* calming-sage */
          foreground: token('--color-accent-foreground'), /* gray-900 */
        },
        popover: {
          DEFAULT: token('--color-popover'), /* white */
          foreground: token('--color-popover-foreground'), /* gray-900 */
        },
        card: {
          DEFAULT: token('--color-card'), /* subtle-green-surface */
          foreground: token('--color-card-foreground'), /* gray-900 */
        },
        success: {
          DEFAULT: token('--color-success'), /* earthy-green */
          foreground: token('--color-success-foreground'), /* white */
        },
        warning: {
          DEFAULT: token('--color-warning'), /* warm-amber */
          foreground: token('--color-warning-foreground'), /* white */
        },
        error: {
          DEFAULT: token('--color-error'), /* muted-red */
          foreground: token('--color-error-foreground'), /* white */
        },
        /* Brand Specific Colors */
        'brand-gold': token('--color-brand-gold'), /* rich-gold */
        'brand-forest': token('--color-brand-forest'), /* deep-forest */
        'brand-sage': token('--color-brand-sage'), /* calming-sage */
        'brand-cream': token('--color-brand-cream'), /* warm-cream */
        'brand-ivory': token('--color-brand-ivory'), /* soft-ivory */
        'text-primary': token('--color-text-primary'), /* gray-900 */
        'text-secondary': token('--color-text-secondary'), /* gray-600 */
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
        'accent': ['Crimson Text', 'serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'lg': 'var(--radius)',
        'md': 'calc(var(--radius) - 2px)',
        'sm': 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'organic': 'var(--shadow-organic)',
        'elevated': 'var(--shadow-elevated)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'gentle-bounce': 'gentleBounce 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        gentleBounce: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
          '40%, 43%': { transform: 'translate3d(0, -8px, 0)' },
          '70%': { transform: 'translate3d(0, -4px, 0)' },
          '90%': { transform: 'translate3d(0, -2px, 0)' },
        },
      },
      transitionTimingFunction: {
        'organic': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'gentle': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
  ],
}