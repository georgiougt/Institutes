import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const postsDirectory = path.join(process.cwd(), 'content/blog');

export interface BlogPostMeta {
  title: string;
  date: string;
  summary: string;
  author: string;
  category: string;
  coverImage: string;
  country: string;
  slug: string;
}

export interface BlogPost extends BlogPostMeta {
  contentHtml: string;
}

/**
 * Fetch and return metadata for all blog posts, sorted by date (newest first).
 * Optionally filters by country (or includes 'all').
 */
export function getBlogPosts(country?: string): BlogPostMeta[] {
  try {
    if (!fs.existsSync(postsDirectory)) {
      return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => {
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);
        return data as BlogPostMeta;
      });

    // Filter by country if provided
    const filteredPosts = country
      ? allPostsData.filter(
          (post) =>
            post.country?.toLowerCase() === 'all' ||
            post.country?.toLowerCase() === country.toLowerCase()
        )
      : allPostsData;

    // Sort posts by date descending
    return filteredPosts.sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

/**
 * Fetch a single blog post by its slug, parsing frontmatter and converting markdown to HTML.
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Convert markdown content to HTML
    const contentHtml = await marked.parse(content);

    return {
      ...(data as BlogPostMeta),
      contentHtml,
    };
  } catch (error) {
    console.error(`Error parsing blog post with slug ${slug}:`, error);
    return null;
  }
}
