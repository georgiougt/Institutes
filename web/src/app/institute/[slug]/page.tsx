export const dynamic = 'force-dynamic';

import { permanentRedirect } from 'next/navigation';

interface InstituteRedirectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function InstituteRedirectPage({
  params,
}: InstituteRedirectPageProps) {
  const { slug } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

  let country = 'cy'; // Default fallback for Cyprus
  let canonicalSlug = slug;

  try {
    const res = await fetch(`${apiUrl}/institutes/${slug}`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const inst = await res.json();
      const countryCode = inst.branches?.[0]?.city?.countryCode;
      if (countryCode) {
        country = countryCode.toLowerCase();
      }
      if (inst.slug) {
        canonicalSlug = inst.slug;
      }
    }
  } catch (error) {
    console.error('Failed to resolve institute country for redirect, defaulting to cy:', error);
  }

  permanentRedirect(`/${country}/institute/${canonicalSlug}`);
}

