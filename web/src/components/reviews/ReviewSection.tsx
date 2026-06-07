'use client';

import { useState, useEffect } from 'react';
import { Star, MessageSquare, User, Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  guestName?: string;
  user?: {
    firstName: string;
    lastName: string;
  };
}

export function ReviewSection({ instituteId }: { instituteId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check local storage for user (sync with LoginPage logic)
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));

    fetchReviews();
  }, [instituteId]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/reviews/institute/${instituteId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      toast.error('Παρακαλώ εισάγετε ένα όνομα.');
      return;
    }
    if (!guestEmail.trim()) {
      toast.error('Παρακαλώ εισάγετε ένα email.');
      return;
    }
    if (!comment.trim()) {
      toast.error('Παρακαλώ γράψτε ένα σχόλιο/εξήγηση για την κριτική σας.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/reviews`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ instituteId, rating, comment, guestName, guestEmail }),
      });

      if (res.ok) {
        toast.success('Η κριτική σας υποβλήθηκε και εκκρεμεί έγκριση!');
        setComment('');
        setGuestName('');
        setGuestEmail('');
        setRating(5);
        // We don't add it to the list yet because it's PENDING
      } else {
        toast.error('Αποτυχία υποβολής κριτικής.');
      }
    } catch (error) {
      toast.error('Σφάλμα δικτύου.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-red-600" />
          Κριτικές ({reviews.length})
        </h2>
      </div>

      {/* Review Form */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="font-bold text-slate-800">Πώς θα βαθμολογούσατε αυτό το φροντιστήριο;</p>
          
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none transition-transform active:scale-90"
              >
                <Star 
                  className={cn(
                    "h-8 w-8 transition-colors",
                    star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"
                  )} 
                />
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <input 
              type="text"
              placeholder="Το όνομά σας..."
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm focus:border-red-500 focus:ring-red-500/10"
              required
            />
            <input 
              type="email"
              placeholder="Το email σας..."
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm focus:border-red-500 focus:ring-red-500/10"
              required
            />
            <Textarea 
              placeholder="Γράψτε την εμπειρία σας..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="rounded-xl border-slate-200 bg-white min-h-[100px]"
              required
            />
          </div>

          <Button 
            type="submit" 
            disabled={submitting}
            className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-8 font-bold"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4 mr-2" /> Υποβολή</>}
          </Button>
        </form>
      </div>

      {/* Review List */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((rev) => (
            <div key={rev.id} className="border-b border-slate-100 pb-6 last:border-0">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">
                      {rev.user ? `${rev.user.firstName} ${rev.user.lastName ? rev.user.lastName[0] + '.' : ''}` : rev.guestName}
                    </p>
                    <p className="text-xs text-slate-400">{new Date(rev.createdAt).toLocaleDateString('el-GR')}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star 
                      key={s} 
                      className={cn(
                        "h-3.5 w-3.5",
                        s <= rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                      )} 
                    />
                  ))}
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed pl-[52px]">
                {rev.comment || <span className="text-slate-300 italic">Δεν υπάρχει σχόλιο.</span>}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-400">Δεν υπάρχουν ακόμη κριτικές. Γίνετε ο πρώτος!</p>
          </div>
        )}
      </div>
    </div>
  );
}
