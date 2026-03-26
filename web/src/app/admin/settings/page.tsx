import { AdminTopbar } from '@/components/admin/layout/AdminTopbar';
import { Settings as SettingsIcon, Globe, MessageSquare, Link as LinkIcon } from 'lucide-react';

export default function SettingsPage() {
  return (
    <>
      <AdminTopbar title="Settings" subtitle="Platform configuration" />
      <div className="p-6 max-w-[800px] mx-auto space-y-6">
        {/* SEO Defaults */}
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-4">
            <Globe className="h-4 w-4 text-indigo-500" /> SEO Defaults
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Default Page Title</label>
              <input type="text" defaultValue="EduTrack - Find Learning Centers" className="w-full h-9 px-3 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Meta Description</label>
              <textarea rows={3} defaultValue="Discover the best private institutes and tutoring centers near you." className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm resize-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-4">
            <MessageSquare className="h-4 w-4 text-indigo-500" /> Platform Contact
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Support Email</label>
              <input type="email" defaultValue="support@edutrack.cy" className="w-full h-9 px-3 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Support Phone</label>
              <input type="text" defaultValue="+357 22 123456" className="w-full h-9 px-3 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-4">
            <LinkIcon className="h-4 w-4 text-indigo-500" /> Social Links
          </h2>
          <div className="space-y-3">
            {['Facebook', 'Instagram', 'LinkedIn'].map(name => (
              <div key={name}>
                <label className="text-xs font-medium text-slate-500 mb-1 block">{name} URL</label>
                <input type="url" placeholder={`https://${name.toLowerCase()}.com/...`} className="w-full h-9 px-3 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" />
              </div>
            ))}
          </div>
        </div>

        <button className="w-full py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors">
          Save Settings
        </button>
      </div>
    </>
  );
}
