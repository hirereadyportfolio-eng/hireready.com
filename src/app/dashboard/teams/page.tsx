"use client";

import React, { useState, useEffect } from "react";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc, 
  arrayUnion, 
  getDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { 
  Users, 
  Plus, 
  Copy, 
  Check, 
  UserPlus, 
  Shield, 
  LogOut,
  Mail
} from "lucide-react";
import { toast } from "react-hot-toast";

interface TeamMember {
  uid: string;
  name: string;
  email: string;
  role: "leader" | "member";
}

interface Team {
  id: string;
  name: string;
  code: string;
  members: TeamMember[];
  hackathonId?: string;
}

export default function TeamManagement() {
  const { user } = useAuth();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserTeam();
    }
  }, [user]);

  const fetchUserTeam = async () => {
    try {
      const q = query(
        collection(db, "teams"), 
        where("memberIds", "array-contains", user!.uid)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const teamDoc = querySnapshot.docs[0];
        setTeam({ id: teamDoc.id, ...teamDoc.data() } as Team);
      } else {
        setTeam(null);
      }
    } catch (error) {
      console.error("Error fetching team", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    try {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      const teamData = {
        name,
        code,
        memberIds: [user!.uid],
        members: [{
          uid: user!.uid,
          name: user!.displayName,
          email: user!.email,
          role: "leader"
        }],
        createdAt: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, "teams"), teamData);
      setTeam({ id: docRef.id, ...teamData } as Team);
      toast.success("Team created successfully!");
    } catch (error) {
      toast.error("Failed to create team");
    } finally {
      setCreating(false);
    }
  };

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setLoading(true);
    try {
      const q = query(collection(db, "teams"), where("code", "==", joinCode.toUpperCase()));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        toast.error("Invalid team code");
        setLoading(false);
        return;
      }

      const teamDoc = querySnapshot.docs[0];
      const teamData = teamDoc.data();

      if (teamData.memberIds.length >= 4) {
        toast.error("Team is full (max 4 members)");
        setLoading(false);
        return;
      }

      await updateDoc(doc(db, "teams", teamDoc.id), {
        memberIds: arrayUnion(user!.uid),
        members: arrayUnion({
          uid: user!.uid,
          name: user!.displayName,
          email: user!.email,
          role: "member"
        })
      });

      toast.success("Joined team!");
      fetchUserTeam();
    } catch (error) {
      toast.error("Failed to join team");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    if (!team) return;
    navigator.clipboard.writeText(team.code);
    setCopied(true);
    toast.success("Code copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="text-center py-20 text-white/50 italic">Loading your team details...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold italic tracking-tight">Team Management</h2>
        <p className="text-white/60">Collaborate with fellow builders to compete and win.</p>
      </div>

      {!team ? (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-8 flex flex-col items-center text-center">
             <div className="h-16 w-16 rounded-3xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6">
                <Plus className="h-8 w-8" />
             </div>
             <h3 className="text-xl font-bold mb-2 tracking-tight">Create a Team</h3>
             <p className="text-sm text-white/50 mb-8 leading-relaxed">
                Be the leader. Create a team, share the code, and start building your flagship project.
             </p>
             <form onSubmit={handleCreateTeam} className="w-full space-y-4">
                <Input 
                  placeholder="Team Name" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="bg-black/50"
                  required
                />
                <Button type="submit" disabled={creating} className="w-full h-12 rounded-2xl">
                   {creating ? "Creating..." : "Start a Team"}
                </Button>
             </form>
          </Card>

          <Card className="p-8 flex flex-col items-center text-center border-dashed">
             <div className="h-16 w-16 rounded-3xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6">
                <UserPlus className="h-8 w-8" />
             </div>
             <h3 className="text-xl font-bold mb-2 tracking-tight">Join a Team</h3>
             <p className="text-sm text-white/50 mb-8 leading-relaxed">
                Got an invite? Enter the unique 6-digit code shared by your teammate.
             </p>
             <form onSubmit={handleJoinTeam} className="w-full space-y-4">
                <Input 
                  placeholder="Invite Code (e.g. X1Y2Z3)" 
                  value={joinCode}
                  onChange={e => setJoinCode(e.target.value)}
                  className="bg-black/50 uppercase tracking-widest text-center"
                  required
                />
                <Button type="submit" variant="secondary" className="w-full h-12 rounded-2xl">
                   Join via Code
                </Button>
             </form>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
           <Card className="p-8 bg-gradient-to-br from-white/[0.05] to-transparent">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                 <div className="flex items-center gap-6">
                    <div className="h-16 w-16 rounded-3xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-2xl font-bold border-4 border-white/5">
                       {team.name[0]}
                    </div>
                    <div>
                       <h3 className="text-2xl font-bold italic tracking-tight">{team.name}</h3>
                       <div className="flex items-center gap-2 mt-1">
                          <Users className="h-4 w-4 text-white/40" />
                          <span className="text-sm text-white/50">{team.members.length} Members</span>
                       </div>
                    </div>
                 </div>
                 
                 <div className="flex flex-col items-end gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Invite Code</span>
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-2">
                       <span className="font-mono text-lg font-bold tracking-widest text-blue-400">{team.code}</span>
                       <button onClick={copyCode} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                          {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 text-white/40" />}
                       </button>
                    </div>
                 </div>
              </div>
           </Card>

           <div className="grid gap-6 md:grid-cols-12 items-start">
              <div className="md:col-span-8 space-y-4">
                 <h4 className="text-sm font-bold uppercase tracking-widest text-white/40 ml-2">Team Roster</h4>
                 <div className="grid gap-3">
                    {team.members.map((member) => (
                       <Card key={member.uid} className="p-4 bg-white/1 overflow-visible border-white/5">
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-2xl bg-white/5 flex items-center justify-center text-xs font-bold border border-white/5">
                                   {member.name[0]}
                                </div>
                                <div>
                                   <div className="flex items-center gap-2">
                                      <span className="font-semibold">{member.name} {member.uid === user?.uid && "(You)"}</span>
                                      {member.role === "leader" && (
                                         <Badge variant="accent" className="h-5 px-1.5 flex items-center gap-1 normal-case text-[9px]">
                                            <Shield className="h-2.5 w-2.5" />
                                            Leader
                                         </Badge>
                                      )}
                                   </div>
                                   <div className="flex items-center gap-1.5 text-xs text-white/40 mt-0.5">
                                      <Mail className="h-3 w-3" />
                                      {member.email}
                                   </div>
                                </div>
                             </div>
                             {member.uid !== user?.uid && team.members.find(m => m.uid === user?.uid)?.role === "leader" && (
                                <button className="p-2 text-white/20 hover:text-red-400 transition-colors">
                                   <LogOut className="h-4 w-4" />
                                </button>
                             )}
                          </div>
                       </Card>
                    ))}
                    
                    {team.members.length < 4 && (
                       <div className="border border-dashed border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center opacity-60">
                          <UserPlus className="h-8 w-8 text-white/20 mb-3" />
                          <p className="text-sm text-white/40">Slot available. Share the code to invite.</p>
                       </div>
                    )}
                 </div>
              </div>

              <div className="md:col-span-4 space-y-6">
                 <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-white/40 ml-2 mb-4">Team Actions</h4>
                    <Card className="p-6 space-y-4">
                       <Button variant="secondary" className="w-full justify-start gap-3 bg-red-500/5 hover:bg-red-500/10 border-red-500/20 text-red-500">
                          <LogOut className="h-4 w-4" />
                          Leave Team
                       </Button>
                       <p className="text-[10px] text-white/30 text-center leading-relaxed">
                          Note: Leaders must transfer ownership or disband the team to leave.
                       </p>
                    </Card>
                 </div>

                 <Card className="p-6 bg-gradient-to-tr from-blue-600/10 to-transparent border-blue-500/20">
                    <h4 className="font-bold mb-2 italic">Ready to submit?</h4>
                    <p className="text-xs text-white/60 mb-4 leading-relaxed">
                       Once your team is ready, the leader can head to the Submissions page to upload the project files.
                    </p>
                    <Button onClick={() => window.location.href='/dashboard/submissions'} className="w-full text-xs h-10">
                       Go to Submissions
                    </Button>
                 </Card>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
