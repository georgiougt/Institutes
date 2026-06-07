import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, User, ArrowLeft, BookOpen, Share2, Facebook, Twitter } from 'lucide-react';
import { getBlogPostBySlug, getBlogPosts } from '@/lib/blog';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { BlogCard } from '@/components/blog-card';
import { Button } from '@/components/ui/button';
import { ShareButton } from '@/components/contact-buttons';

interface BlogPostPageProps {
  params: Promise<{ slug: string; country: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getBlogPostBySlug(resolvedParams.slug);
  if (!post) return {};

  const country = resolvedParams.country || 'cy';

  return {
    title: `${post.title} — ToFrontistirio Blog`,
    description: post.summary,
    alternates: {
      canonical: `https://tofrontistirio.com/${country}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: [
        {
          url: post.coverImage,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: [post.coverImage],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const country = resolvedParams.country || 'cy';
  const post = await getBlogPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  // Fetch recommended posts (excluding the current one)
  const allPosts = getBlogPosts(country);
  const recommendedPosts = allPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  // Greek date format helper
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('el-GR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Structured Data (JSON-LD) for BlogPosting
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': post.title,
    'description': post.summary,
    'image': post.coverImage,
    'datePublished': post.date,
    'author': {
      '@type': 'Person',
      'name': post.author,
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'ToFrontistirio',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://tofrontistirio.com/images/logo.png',
      },
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://tofrontistirio.com/${country}/blog/${post.slug}`,
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />

      <Navbar />

      {/* Main Layout Grid */}
      <main className="flex-1 py-12 max-w-[850px] mx-auto px-6 space-y-8">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href={`/${country}/blog`}
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-red-600 transition-colors text-sm font-bold"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Όλα τα άρθρα</span>
          </Link>
          
          <div className="inline-flex text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-3 py-1 rounded-xl uppercase tracking-wider">
            {post.category}
          </div>
        </div>

        {/* Article Header */}
        <header className="space-y-4 text-left">
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 text-slate-400 text-sm font-semibold pt-2">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.date)}</span>
            </span>
            <span className="flex items-center gap-1.5 font-bold text-slate-600">
              <User className="h-4 w-4 text-slate-400" />
              <span>{post.author}</span>
            </span>
          </div>
        </header>

        {/* Cover Image */}
        <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-md border border-slate-100">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body */}
        <article 
          className="blog-post-content text-slate-800 text-lg leading-relaxed space-y-6 pt-4 pb-12 border-b border-slate-100
            [&>p]:text-slate-700 [&>p]:leading-relaxed [&>p]:mb-6
            [&>h2]:text-2xl [&>h2]:font-black [&>h2]:text-slate-900 [&>h2]:mt-10 [&>h2]:mb-4 [&>h2]:tracking-tight
            [&>h3]:text-xl [&>h3]:font-black [&>h3]:text-slate-900 [&>h3]:mt-8 [&>h3]:mb-3
            [&>ul]:list-disc [&>ul]:list-outside [&>ul]:mb-6 [&>ul]:pl-6 [&>ul]:space-y-2 [&>ul]:text-slate-700
            [&>ol]:list-decimal [&>ol]:list-outside [&>ol]:mb-6 [&>ol]:pl-6 [&>ol]:space-y-2 [&>ol]:text-slate-700
            [&>blockquote]:border-l-4 [&>blockquote]:border-red-600 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-6 [&>blockquote]:text-slate-600 [&>blockquote]:bg-slate-50 [&>blockquote]:py-3 [&>blockquote]:rounded-r-2xl"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        {/* Share Section */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6">
          <div className="space-y-1">
            <h4 className="font-bold text-slate-800">Μοιραστείτε αυτό το άρθρο</h4>
            <p className="text-xs text-slate-500">Βοηθήστε άλλους γονείς και μαθητές να το ανακαλύψουν</p>
          </div>
          <div className="flex items-center gap-2">
            <a 
              href={`https://www.facebook.com/sharer/sharer.php?u=https://tofrontistirio.com/${country}/blog/${post.slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="rounded-xl border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center gap-1.5">
                <Facebook className="h-4 w-4 fill-slate-500 stroke-none" />
                <span>Facebook</span>
              </Button>
            </a>
            <a 
              href={`https://twitter.com/intent/tweet?url=https://tofrontistirio.com/${country}/blog/${post.slug}&text=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="rounded-xl border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center gap-1.5">
                <Twitter className="h-4 w-4 fill-slate-500 stroke-none" />
                <span>Twitter</span>
              </Button>
            </a>
          </div>
        </section>

        {/* Recommended Posts Section */}
        {recommendedPosts.length > 0 && (
          <section className="pt-12 border-t border-slate-100 space-y-8">
            <div className="space-y-2 text-left">
              <h3 className="text-2xl font-black text-slate-950 tracking-tight">
                Σχετικά Άρθρα
              </h3>
              <p className="text-slate-500 text-sm">
                Διαβάστε περισσότερους χρήσιμους εκπαιδευτικούς οδηγούς.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {recommendedPosts.map((recPost) => (
                <div key={recPost.slug} className="group flex flex-col h-full bg-white rounded-2xl border border-slate-200/50 overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <Link href={`/${country}/blog/${recPost.slug}`} className="relative aspect-[16/10] overflow-hidden block">
                    <img 
                      src={recPost.coverImage} 
                      alt={recPost.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-lg uppercase tracking-wider">
                        {recPost.category}
                      </span>
                      <h4 className="font-bold text-slate-800 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
                        <Link href={`/${country}/blog/${recPost.slug}`}>
                          {recPost.title}
                        </Link>
                      </h4>
                    </div>
                    <Link 
                      href={`/${country}/blog/${recPost.slug}`}
                      className="text-xs font-bold text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1 pt-2 border-t border-slate-50"
                    >
                      <span>Διαβάστε</span>
                      <ArrowLeft className="h-3 w-3 rotate-180" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
