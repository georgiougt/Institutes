'use client';

import { useState, useEffect } from 'react';
import { Loader2, MessageSquare, Check, X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Review {
  id: string;
  instituteId: string;
  rating: number;
  comment: string;
  guestName?: string;
  guestEmail?: string;
  createdAt: string;
  institute: {
    name: string;
  };
  user?: {
    firstName: string;
    lastName: string;
  };
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  const fetchPendingReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/reviews/pending`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      } else {
        toast.error('Αποτυχία φόρτωσης κριτικών');
      }
    } catch (error) {
      toast.error('Σφάλμα δικτύου');
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/reviews/${id}/moderate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        toast.success(`H κριτική ${status === 'APPROVED' ? 'εγκρίθηκε' : 'απορρίφθηκε'}.`);
        setReviews(prev => prev.filter(r => r.id !== id));
      } else {
        toast.error('Αποτυχία ενημέρωσης κριτικής.');
      }
    } catch (error) {
      toast.error('Σφάλμα δικτύου.');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <MessageSquare className="h-8 w-8 text-indigo-500" />
          Εκκρεμείς Κριτικές
        </h1>
        <p className="text-slate-500 mt-2">
          Διαχειριστείτε τις νέες κριτικές που υποβλήθηκαν πριν εμφανιστούν δημόσια.
        </p>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-slate-50/50">
            Δεν υπάρχουν εκκρεμείς κριτικές για έγκριση.
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Ημερομηνία</TableHead>
                <TableHead>Φροντιστήριο</TableHead>
                <TableHead>Χρήστης</TableHead>
                <TableHead>Βαθμολογία</TableHead>
                <TableHead className="max-w-[300px]">Σχόλιο</TableHead>
                <TableHead className="text-right">Ενέργειες</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((rev) => (
                <TableRow key={rev.id}>
                  <TableCell className="whitespace-nowrap text-slate-500 text-sm">
                    {new Date(rev.createdAt).toLocaleDateString('el-GR')}
                  </TableCell>
                  <TableCell className="font-medium text-slate-900">
                    {rev.institute?.name || 'Άγνωστο'}
                  </TableCell>
                  <TableCell>
                    {rev.user ? (
                      <Badge variant="secondary">{rev.user.firstName} {rev.user.lastName}</Badge>
                    ) : (
                      <div className="flex flex-col">
                        <span className="text-slate-600 font-medium">{rev.guestName || 'Ανώνυμος'}</span>
                        {rev.guestEmail && (
                          <span className="text-xs text-slate-400 font-normal">{rev.guestEmail}</span>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                          key={s} 
                          className={cn(
                            "h-4 w-4",
                            s <= rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                          )} 
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate text-slate-600" title={rev.comment}>
                    {rev.comment || <span className="italic text-slate-400">-</span>}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        className="bg-emerald-500 hover:bg-emerald-600 text-white"
                        onClick={() => handleModerate(rev.id, 'APPROVED')}
                      >
                        <Check className="h-4 w-4 mr-1" /> Έγκριση
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleModerate(rev.id, 'REJECTED')}
                      >
                        <X className="h-4 w-4 mr-1" /> Απόρριψη
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
