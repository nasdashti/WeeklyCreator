import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseYouTubeHandle(input: string): string | null {
  const cleanInput = input.trim();
  
  if (cleanInput.startsWith('@')) {
    return cleanInput.slice(1);
  }
  
  try {
    const url = new URL(cleanInput);
    if (url.hostname.includes('youtube.com')) {
      const handleMatch = url.pathname.match(/@([^/]+)/);
      if (handleMatch) {
        return handleMatch[1];
      }
    }
  } catch {
    if (/^[\w-]+$/.test(cleanInput)) {
      return cleanInput;
    }
  }
  
  return null;
}

export function formatHandle(handle: string): string {
  return handle.startsWith('@') ? handle : `@${handle}`;
}