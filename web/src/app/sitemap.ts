import { MetadataRoute } from 'next';
import { getBlogPosts } from '@/lib/blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tofrontistirio.com';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api/v1';

  // 1. Core public pages
  const routes: MetadataRoute.Sitemap = [
    '/cy',
    '/cy/search',
    '/cy/contact',
    '/cy/faq',
    '/cy/blog',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '/cy' ? 1 : 0.8,
  }));

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    // 2. Fetch metadata (cities and services)
    const metaRes = await fetch(`${apiUrl}/institutes/metadata/lists`, { 
      next: { revalidate: 3600 },
      signal: controller.signal 
    });
    if (!metaRes.ok) throw new Error('Failed to fetch metadata');
    const metaData = await metaRes.json();
    const cities: any[] = metaData.cities || [];
    const services: any[] = metaData.services || [];

    // 3. Fetch all active institutes
    const instRes = await fetch(`${apiUrl}/institutes/sitemap`, { 
      next: { revalidate: 3600 },
      signal: controller.signal 
    });
    
    clearTimeout(timeoutId);
    
    if (!instRes.ok) throw new Error('Failed to fetch institutes');
    const institutes: any[] = await instRes.json();

    // 4. Generate Institute URLs
    const instituteRoutes: MetadataRoute.Sitemap = institutes.map((inst: any) => ({
      url: `${baseUrl}/cy/institute/${inst.slug || inst.id}`,
      lastModified: new Date(inst.updatedAt),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    // 5. Generate City Landing Pages
    const cityRoutes: MetadataRoute.Sitemap = cities.map((city: any) => ({
      url: `${baseUrl}/cy/search?cityId=${city.id}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    }));

    // 6. Generate Subject Category Pages
    const serviceRoutes: MetadataRoute.Sitemap = services.map((service: any) => ({
      url: `${baseUrl}/cy/search?serviceId=${service.id}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    }));

    // 7. Generate Subject-City Combination Pages
    const comboRoutes: MetadataRoute.Sitemap = [];
    cities.forEach((city: any) => {
      services.forEach((service: any) => {
        comboRoutes.push({
          url: `${baseUrl}/cy/search?cityId=${city.id}&serviceId=${service.id}`,
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: 0.6,
        });
      });
    });

    // 8. Generate Blog Post URLs
    const blogPosts = getBlogPosts('cy');
    const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
      url: `${baseUrl}/cy/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

    return [...routes, ...instituteRoutes, ...cityRoutes, ...serviceRoutes, ...comboRoutes, ...blogRoutes];
  } catch (error) {
    console.error('[Sitemap] Failed to generate dynamic sitemap:', error);
    return routes; // Fallback to static routes if API fails
  }
}
