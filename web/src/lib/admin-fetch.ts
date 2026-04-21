const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

/**
 * Universal fetch wrapper for admin routes that works in both 
 * Server Components and Client Components.
 */
export async function adminFetch(endpoint: string, options: RequestInit = {}) {
  let userId = '';

  if (typeof window === 'undefined') {
    // Server-side: Use next/headers to access cookies
    try {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      userId = cookieStore.get('auth_user_id')?.value || '';
    } catch (e) {
      console.error('Failed to read cookies on server:', e);
    }
  } else {
    // Client-side: Parse document.cookie
    const match = document.cookie.match(/(^|;)\s*auth_user_id\s*=\s*([^;]+)/);
    userId = match ? match[2] : '';
  }

  const res = await fetch(`${API}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId,
      ...options.headers,
    },
  });

  return res;
}
