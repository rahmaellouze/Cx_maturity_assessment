# EY Logo Asset

## Setup Instructions

To display the EY logo in the Assessment Results page header, follow these steps:

### Option 1: Add SVG File (Recommended)
1. Place your EY logo SVG file in this directory as `ey-logo.svg`
2. The logo will automatically be displayed in the header
3. Current sizing: 40px height on mobile, 48px on larger screens

### Option 2: Use External URL
If hosting the logo externally, edit `src/components/ui/EYLogo.tsx` and update the image src:
```tsx
<img
  src="https://your-domain.com/ey-logo.svg"
  alt="EY Logo"
  className="h-10 w-auto md:h-12"
/>
```

### Option 3: Embedded SVG Component
Replace the image tag with inline SVG markup in `src/components/ui/EYLogo.tsx`

## Logo Display Location
- **Component:** `src/components/ui/EYLogo.tsx`
- **Used in:** Assessment Results Page header (left side)
- **Responsive Sizing:** 
  - Mobile: h-10 (40px)
  - Desktop: h-12 (48px)

## Notes
- The component maintains aspect ratio with `w-auto`
- The logo is positioned on the left side of the header, aligned with bottom content
- All styling uses Tailwind CSS classes for consistency
