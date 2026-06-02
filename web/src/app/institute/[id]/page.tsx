export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';

interface InstituteRedirectPageProps {
  params: Promise<{ id: string }>;
}

export default async function InstituteRedirectPage({
  params,
}: InstituteRedirectPageProps) {
  const { id } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

  let country = 'cy'; // Default fallback for Cyprus

  try {
    const res = await fetch(`${apiUrl}/institutes/${id}`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const inst = await res.json();
      const countryCode = inst.branches?.[0]?.city?.countryCode;
      if (countryCode) {
        country = countryCode.toLowerCase();
      }
    }
  } catch (error) {
    console.error('Failed to resolve institute country for redirect, defaulting to cy:', error);
  }

  redirect(`/${country}/institute/${id}`);
}
