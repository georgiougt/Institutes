import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { BlogPostMeta } from '@/lib/blog';

interface BlogCardProps {
  post: BlogPostMeta;
  country: string;
}

export function BlogCard({ post, country }: BlogCardProps) {
  // Format the date to a readable Greek format (e.g., 5 Ιουνίου 2026)
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
    <article className="group bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Cover Image Wrapper */}
      <Link href={`/${country}/blog/${post.slug}`} className="relative aspect-[16/10] overflow-hidden block">
        <img
          src={post.coverImage || '/images/placeholder-blog.webp'}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        {/* Category Overlay Badge */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-white/20 shadow-sm uppercase tracking-wider">
          {post.category}
        </div>
      </Link>

      {/* Content Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* Metadata Block */}
          <div className="flex items-center gap-4 text-slate-400 text-xs font-semibold">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDate(post.date)}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              <span>{post.author}</span>
            </span>
          </div>

          {/* Post Title */}
          <h3 className="text-xl font-black text-slate-900 group-hover:text-red-600 transition-colors leading-snug line-clamp-2">
            <Link href={`/${country}/blog/${post.slug}`}>
              {post.title}
            </Link>
          </h3>

          {/* Post Summary */}
          <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
            {post.summary}
          </p>
        </div>

        {/* Read More Link CTA */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <Link
            href={`/${country}/blog/${post.slug}`}
            className="inline-flex items-center gap-1 text-sm font-bold text-slate-700 hover:text-red-600 transition-colors group/link"
          >
            <span>Διαβάστε περισσότερα</span>
            <ArrowRight className="h-4 w-4 text-slate-400 group-hover/link:translate-x-1 group-hover:text-red-600 transition-all" />
          </Link>
        </div>
      </div>
    </article>
  );
}
