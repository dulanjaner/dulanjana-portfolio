/** Shared validation helpers for admin forms. Empty optional URLs are allowed. */
export function validateRequired(value: string, label: string): string | null {
  return value.trim() ? null : `${label} is required.`;
}

export function validateUrl(value: string, options: { required?: boolean } = {}): string | null {
  const trimmed = value.trim();
  if (!trimmed) return options.required ? "This URL is required." : null;
  if (/\s/.test(trimmed) || !/^https?:\/\//i.test(trimmed)) {
    return "Enter a valid URL starting with https:// or http://.";
  }
  try {
    const url = new URL(trimmed);
    if (!["http:", "https:"].includes(url.protocol) || !url.hostname || !url.hostname.includes(".")) {
      return "Enter a valid URL, such as https://example.com.";
    }
    return null;
  } catch {
    return "Enter a valid URL, such as https://example.com.";
  }
}

export function validateGitHubUrl(value: string, options: { required?: boolean } = {}): string | null {
  const trimmed = value.trim();
  if (!trimmed) return options.required ? "GitHub repository URL is required." : null;
  const urlError = validateUrl(trimmed);
  if (urlError) return urlError;
  try {
    const url = new URL(trimmed);
    if (url.hostname.toLowerCase() !== "github.com" && url.hostname.toLowerCase() !== "www.github.com") {
      return "Enter a GitHub URL, such as https://github.com/username/project.";
    }
    if (url.pathname === "/" || url.pathname.split("/").filter(Boolean).length < 2) {
      return "Enter the full GitHub repository URL, including username and project name.";
    }
    return null;
  } catch {
    return "Enter a valid GitHub repository URL.";
  }
}
