import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tofrontistirio.com';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api/v1';

  // 1. Core public pages
  const routes: MetadataRoute.Sitemap = [
    '',
    '/search',
    '/contact',
    '/login',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.8,
  }));

  try {
    // 2. Fetch metadata (cities and services)
    const metaRes = await fetch(`${apiUrl}/institutes/metadata/lists`, { next: { revalidate: 3600 } });
    if (!metaRes.ok) throw new Error('Failed to fetch metadata');
    const metaData = await metaRes.json();
    const cities: any[] = metaData.cities || [];
    const services: any[] = metaData.services || [];

    // 3. Fetch all active institutes
    const instRes = await fetch(`${apiUrl}/institutes/sitemap`, { next: { revalidate: 3600 } });
    if (!instRes.ok) throw new Error('Failed to fetch institutes');
    const institutes: any[] = await instRes.json();

    // 4. Generate Institute URLs
    const instituteRoutes: MetadataRoute.Sitemap = institutes.map((inst: any) => ({
      url: `${baseUrl}/institute/${inst.id}`,
      lastModified: new Date(inst.updatedAt),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    // 5. Generate City Landing Pages
    const cityRoutes: MetadataRoute.Sitemap = cities.map((city: any) => ({
      url: `${baseUrl}/search?cityId=${city.id}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    }));

    // 6. Generate Subject Category Pages
    const serviceRoutes: MetadataRoute.Sitemap = services.map((service: any) => ({
      url: `${baseUrl}/search?serviceId=${service.id}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    }));

    // 7. Generate Subject-City Combination Pages
    const comboRoutes: MetadataRoute.Sitemap = [];
    cities.forEach((city: any) => {
      services.forEach((service: any) => {
        comboRoutes.push({
          url: `${baseUrl}/search?cityId=${city.id}&serviceId=${service.id}`,
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: 0.6,
        });
      });
    });

    return [...routes, ...instituteRoutes, ...cityRoutes, ...serviceRoutes, ...comboRoutes];
  } catch (error) {
    console.error('[Sitemap] Failed to generate dynamic sitemap:', error);
    return routes; // Fallback to static routes if API fails
  }
}
