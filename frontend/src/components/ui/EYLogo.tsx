/**
 * EY Logo Component
 * 
 * Displays the EY logo in the assessment results header.
 * Currently a placeholder that imports from /assets/logos/ey-logo.svg
 * 
 * To replace with actual logo:
 * 1. Place your EY logo SVG at: src/assets/logos/ey-logo.svg
 * 2. The component will automatically display it
 * 
 * Alternatively, to use a different format:
 * - Replace the import statement below
 * - Or replace the img src in the return statement
 */

export default function EYLogo() {
  return (
    <div className="flex items-center">
      <img
        src="/assets/logos/ey-logo.svg"
        alt="EY Logo"
        className="h-10 w-auto md:h-12"
      />
    </div>
  );
}
