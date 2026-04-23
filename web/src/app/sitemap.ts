import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tofrontistirio.com';

  // Core public pages
  const routes = [
    '',
    '/search',
    '/contact',
    '/login',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // In the future, we can fetch all institute IDs from the API:
  // try {
  //   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/institutes/all-ids`);
  //   const ids = await res.json();
  //   const instituteRoutes = ids.map((id: string) => ({
  //     url: `${baseUrl}/institute/${id}`,
  //     lastModified: new Date(),
  //     changeFrequency: 'weekly' as const,
  //     priority: 0.6,
  //   }));
  //   return [...routes, ...instituteRoutes];
  // } catch (e) {
  //   return routes;
  // }

  return routes;
}
