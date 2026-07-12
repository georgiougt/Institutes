import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatWebsiteUrl(url: string | null | undefined): string {
  if (!url) return '#';
  let sanitized = url.trim();
  
  // Fix common typos like missing colon in https// or http//
  if (sanitized.startsWith('https//')) {
    sanitized = 'https://' + sanitized.substring(7);
  } else if (sanitized.startsWith('http//')) {
    sanitized = 'http://' + sanitized.substring(6);
  }
  
  if (sanitized.startsWith('http://') || sanitized.startsWith('https://')) {
    return sanitized;
  }
  return `https://${sanitized}`;
}
