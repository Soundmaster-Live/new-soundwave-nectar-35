import { DesignPreferences } from "@/types/design";

export function generateCSS(preferences: DesignPreferences): string {
  const {
    primaryColor,
    backgroundColor,
    fontFamily,
    buttonStyle,
    layout,
    fontSize,
    spacing,
    animations,
  } = preferences;

  return `
    :root {
      --primary: ${primaryColor};
      --background: ${backgroundColor};
      --font-family: ${fontFamily};
      --font-size: ${fontSize};
      --spacing: ${spacing};
    }

    body {
      font-family: var(--font-family);
      font-size: var(--font-size);
      background-color: var(--background);
    }

    .button, .card {
      border-radius: ${buttonStyle === "rounded" ? "0.5rem" : "0"};
      transition: ${animations ? "all 0.3s ease" : "none"};
    }

    .container {
      padding: var(--spacing);
      display: ${layout === "single-column" ? "block" : "grid"};
      grid-template-columns: ${layout === "single-column" ? "1fr" : "repeat(auto-fit, minmax(300px, 1fr))"};
      gap: var(--spacing);
    }

    ${animations ? `
      .button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
    ` : ''}
  `;
}