'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface Service {
  id: string;
  name: string;
  slug: string;
  category: string;
}

interface ServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: Service | null;
  onSuccess?: () => void;
}

export function ServiceDialog({ open, onOpenChange, service, onSuccess }: ServiceDialogProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [slug, setSlug] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (service) {
      setName(service.name || '');
      setCategory(service.category || '');
      setSlug(service.slug || '');
    } else {
      setName('');
      setCategory('');
      setSlug('');
    }
  }, [service, open]);

  // Handle name change for auto-slug
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    if (!service) {
      // Auto-generate slug for new services
      const newSlug = newName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(newSlug);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Get user ID from cookies for authorization
      const userId = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_user_id='))
        ?.split('=')[1];

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
      const endpoint = service ? `/admin/services/${service.id}` : '/admin/services';
      const method = service ? 'PUT' : 'POST';

      const res = await fetch(`${apiUrl}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId || '',
        },
        body: JSON.stringify({ name, category, slug }),
      });

      if (!res.ok) throw new Error('Failed to save service');

      toast.success(`Service ${service ? 'updated' : 'created'} successfully`);
      onOpenChange(false);
      router.refresh();
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error('Error saving service');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSave}>
          <DialogHeader>
            <DialogTitle>{service ? 'Edit Service' : 'Add New Service'}</DialogTitle>
            <DialogDescription>
              {service 
                ? 'Update the details for this service taxonomy.' 
                : 'Create a new service that institutes can link to.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={handleNameChange}
                placeholder="e.g. Mathematics"
                disabled={isSaving}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Science"
                disabled={isSaving}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="mathematics"
                disabled={isSaving}
                required
              />
              <p className="text-[10px] text-slate-400">Used in search URLs and API keys.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Service'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
