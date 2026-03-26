'use client';

import { useEffect, useState, use } from 'react';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Trash2, 
  Mail, 
  CheckCircle2,
  MoreVertical,
  Briefcase
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function TeamAccessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: instituteId } = use(params);
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState<any[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'MANAGER' | 'STAFF'>('STAFF');

  useEffect(() => {
    fetchTeam();
  }, [instituteId]);

  const fetchTeam = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/owner/institutes/${instituteId}/team`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTeam(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inviteMember = async () => {
    if (!inviteEmail) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/owner/institutes/${instituteId}/team`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });
      if (res.ok) {
        setInviteEmail('');
        fetchTeam();
        alert('Team member added successfully!');
      } else if (res.status === 404) {
        alert('User with this email not found. They must have an account first.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const removeMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/owner/institutes/team/${memberId}`, { method: 'DELETE' });
      if (res.ok) {
        setTeam(prev => prev.filter(m => m.id !== memberId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-slate-400 font-medium animate-pulse">Loading team members...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Team Access</h2>
          <p className="text-slate-500">Manage who has access to your institute's dashboard and their roles.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Invitation Form */}
         <div className="space-y-6">
            <Card className="border-none shadow-sm bg-white overflow-hidden">
               <CardHeader className="bg-slate-50 border-b border-slate-100 pb-6">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-xl bg-red-600 flex items-center justify-center text-white">
                        <UserPlus className="h-5 w-5" />
                     </div>
                     <CardTitle className="text-lg">Invite Member</CardTitle>
                  </div>
               </CardHeader>
               <CardContent className="p-6 space-y-4">
                  <div className="space-y-1.5">
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                     <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                        <Input 
                           placeholder="staff@example.com" 
                           className="pl-10 rounded-xl border-slate-200"
                           value={inviteEmail}
                           onChange={(e) => setInviteEmail(e.target.value)}
                        />
                     </div>
                  </div>

                  <div className="space-y-1.5">
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Role</label>
                     <Select value={inviteRole} onValueChange={(val: any) => setInviteRole(val)}>
                        <SelectTrigger className="rounded-xl border-slate-200">
                           <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                           <SelectItem value="MANAGER">Manager (Full Access)</SelectItem>
                           <SelectItem value="STAFF">Staff (Listing Only)</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>

                  <Button 
                     onClick={inviteMember} 
                     className="w-full bg-slate-900 hover:bg-black text-white rounded-xl font-bold h-12 shadow-sm mt-4"
                  >
                     Send Access Request
                  </Button>
               </CardContent>
            </Card>

            <div className="p-6 bg-red-50 rounded-3xl border border-red-100 flex items-start gap-4">
               <Shield className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
               <p className="text-xs text-red-800 leading-relaxed font-medium">
                  <strong>Manager</strong> role can edit all institute details, branches, and manage other staff. 
                  <strong>Staff</strong> can view dashboard metrics and manage contact inquiries.
               </p>
            </div>
         </div>

         {/* Member List */}
         <div className="lg:col-span-2 space-y-4">
            {team.map((member) => (
              <Card key={member.id} className="border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-all">
                 <CardContent className="p-0 flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-4">
                       <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-400 text-xl font-black">
                          {member.user.firstName ? member.user.firstName[0] : (member.user.email[0].toUpperCase())}
                       </div>
                       <div>
                          <div className="font-bold text-slate-900 flex items-center gap-2">
                             {member.user.firstName || 'User'} {member.user.lastName || ''}
                             <Badge className={`border-none rounded-lg text-[10px] uppercase h-5 font-black flex items-center ${
                                member.role === 'OWNER' ? "bg-red-600 text-white" :
                                member.role === 'MANAGER' ? "bg-slate-900 text-white" :
                                "bg-slate-100 text-slate-600"
                             }`}>
                                {member.role}
                             </Badge>
                          </div>
                          <div className="text-sm text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                             <Mail className="h-3 w-3" />
                             {member.user.email}
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-2">
                       {member.role !== 'OWNER' && (
                          <Button 
                             variant="ghost" 
                             size="icon" 
                             onClick={() => removeMember(member.id)}
                             className="text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl"
                          >
                             <Trash2 className="h-4 w-4" />
                          </Button>
                       )}
                       <Button variant="ghost" size="icon" className="text-slate-300 rounded-xl">
                          <MoreVertical className="h-4 w-4" />
                       </Button>
                    </div>
                 </CardContent>
              </Card>
            ))}

            {team.length === 0 && (
               <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200">
                  <Briefcase className="h-16 w-16 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400 font-medium">No team members invited yet.</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
