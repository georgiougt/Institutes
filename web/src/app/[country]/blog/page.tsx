import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, User, ArrowRight, BookOpen, Tag } from 'lucide-react';
import { getBlogPosts } from '@/lib/blog';
import { BlogCard } from '@/components/blog-card';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { cn } from '@/lib/utils';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const country = resolvedParams.country || 'cy';
  const isGreece = country.toLowerCase() === 'gr';

  return {
    title: isGreece
      ? 'Blog Εκπαίδευσης & Νέα — ToFrontistirio'
      : 'Blog Εκπαίδευσης & Νέα — ToFrontistirio',
    description: isGreece
      ? 'Διαβάστε χρήσιμους οδηγούς, συμβουλές μελέτης και εκπαιδευτικά νέα για φροντιστήρια στην Ελλάδα.'
      : 'Διαβάστε χρήσιμους οδηγούς, συμβουλές μελέτης και εκπαιδευτικά νέα για φροντιστήρια στην Κύπρο.',
    alternates: {
      canonical: `https://tofrontistirio.com/${country}/blog`,
    },
  };
}

export default async function BlogFeedPage({
  params,
  searchParams,
}: {
  params: Promise<{ country: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const resolvedParams = await params;
  const country = resolvedParams.country || 'cy';
  const resolvedSearchParams = await searchParams;
  const activeCategory = resolvedSearchParams.category;

  const allPosts = getBlogPosts(country);

  // Extract unique categories for filter bar
  const categories = Array.from(new Set(allPosts.map((post) => post.category)));

  // Filter posts if category query parameter is active
  const filteredPosts = activeCategory
    ? allPosts.filter((post) => post.category.toLowerCase() === activeCategory.toLowerCase())
    : allPosts;

  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
  const gridPosts = filteredPosts.slice(1);

  // Format date helper
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

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 text-slate-900 font-sans">
      <Navbar />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-slate-900 py-16 sm:py-20 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute -left-1/4 -top-1/2 w-96 h-96 rounded-full bg-red-600/20 blur-3xl" />
        <div className="absolute -right-1/4 -bottom-1/2 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl" />

        <div className="container relative z-10 mx-auto px-6 max-w-[1100px] text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="h-3.5 w-3.5" />
            <span>ToFrontistirio Blog</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            Εκπαιδευτικά Νέα & Οδηγοί
          </h1>
          <p className="text-slate-300 text-lg max-w-[600px] mx-auto leading-relaxed">
            Βρείτε χρήσιμες συμβουλές για το διάβασμα, οδηγούς επιλογής μαθημάτων και όλα τα τελευταία νέα της εκπαίδευσης.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <main className="flex-1 py-12 sm:py-16 container mx-auto max-w-[1100px] px-6 space-y-12">
        
        {/* Category Filters */}
        {categories.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-200 pb-6">
            <Link
              href={`/${country}/blog`}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-bold border transition-all duration-300",
                !activeCategory
                  ? "bg-red-600 border-red-600 text-white shadow-md shadow-red-500/20"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
              )}
            >
              Όλα τα άρθρα
            </Link>
            {categories.map((category) => {
              const isSelected = activeCategory?.toLowerCase() === category.toLowerCase();
              return (
                <Link
                  key={category}
                  href={`/${country}/blog?category=${encodeURIComponent(category.toLowerCase())}`}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-bold border transition-all duration-300",
                    isSelected
                      ? "bg-red-600 border-red-600 text-white shadow-md shadow-red-500/20"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
                  )}
                >
                  {category}
                </Link>
              );
            })}
          </div>
        )}

        {allPosts.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-slate-200/60 p-12 text-center max-w-[500px] mx-auto space-y-6 shadow-sm">
            <div className="h-16 w-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto border border-slate-100">
              <Tag className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-800">Δεν υπάρχουν ακόμη άρθρα</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Σύντομα θα προστεθούν οδηγοί και άρθρα σχετικά με την εκπαίδευση. Μείνετε συντονισμένοι!
              </p>
            </div>
            <Link href={`/${country}`}>
              <button className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl transition-colors shadow-md shadow-red-500/10">
                Επιστροφή στην Αρχική
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* Featured Post (Only displayed on main feed or if posts are available) */}
            {featuredPost && !activeCategory && (
              <section className="bg-white rounded-3xl border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 group">
                <Link
                  href={`/${country}/blog/${featuredPost.slug}`}
                  className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto overflow-hidden block"
                >
                  <img
                    src={featuredPost.coverImage}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                  />
                  <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm uppercase tracking-wider">
                    Featured
                  </div>
                </Link>

                <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <span className="inline-flex text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-xl uppercase tracking-wider">
                      {featuredPost.category}
                    </span>
                    
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight group-hover:text-red-600 transition-colors">
                      <Link href={`/${country}/blog/${featuredPost.slug}`}>
                        {featuredPost.title}
                      </Link>
                    </h2>

                    <p className="text-slate-500 text-base leading-relaxed line-clamp-4">
                      {featuredPost.summary}
                    </p>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-4 text-slate-400 text-xs font-semibold">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDate(featuredPost.date)}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        <span>{featuredPost.author}</span>
                      </span>
                    </div>

                    <Link
                      href={`/${country}/blog/${featuredPost.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-black text-slate-800 hover:text-red-600 transition-colors group/link"
                    >
                      <span>Διαβάστε το άρθρο</span>
                      <ArrowRight className="h-4 w-4 text-slate-400 group-hover/link:translate-x-1 group-hover:text-red-600 transition-all" />
                    </Link>
                  </div>
                </div>
              </section>
            )}

            {/* Post Grid (Includes all filtered posts, or remaining posts if featured is showing) */}
            <section className="space-y-6">
              {!activeCategory && gridPosts.length > 0 && (
                <h3 className="text-2xl font-black text-slate-950 tracking-tight mb-8">
                  Πρόσφατα Άρθρα
                </h3>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {activeCategory 
                  ? filteredPosts.map((post) => (
                      <BlogCard key={post.slug} post={post} country={country} />
                    ))
                  : gridPosts.map((post) => (
                      <BlogCard key={post.slug} post={post} country={country} />
                    ))
                }
              </div>
            </section>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
