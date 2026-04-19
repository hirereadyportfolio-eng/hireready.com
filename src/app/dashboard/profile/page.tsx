"use client";

import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { 
  User, 
  Mail, 
  GraduationCap, 
  Code2, 
  Link as LinkIcon, 
  Plus,
  X,
  Camera
} from "lucide-react";
import { toast } from "react-hot-toast";

const SKILL_OPTIONS = ["Frontend", "Backend", "Fullstack", "AI/ML", "DevOps", "Mobile", "UI/UX", "Data Science", "Cybersecurity"];

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    college: "",
    skills: [] as string[],
    github: "",
    linkedin: "",
    bio: ""
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const docRef = doc(db, "users", user!.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile({
          name: data.name || user?.displayName || "",
          college: data.college || "",
          skills: data.skills || [],
          github: data.github || "",
          linkedin: data.linkedin || "",
          bio: data.bio || ""
        });
      }
    } catch (error) {
      console.error("Error fetching profile", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user!.uid), profile);
      toast.success("Profile updated!");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const toggleSkill = (skill: string) => {
    if (profile.skills.includes(skill)) {
      setProfile({ ...profile, skills: profile.skills.filter(s => s !== skill) });
    } else {
      setProfile({ ...profile, skills: [...profile.skills, skill] });
    }
  };

  if (loading) return <div className="text-center py-20 text-white/50">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Your Profile</h2>
        <p className="text-white/60">Manage your academic and professional information.</p>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6">
        <Card className="p-8">
           <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="relative group">
                 <div className="h-32 w-32 rounded-3xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-4xl font-bold border-4 border-white/5 overflow-hidden">
                    {profile.name?.[0] || user?.email?.[0]?.toUpperCase()}
                 </div>
                 <button type="button" className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl">
                    <Camera className="h-6 w-6 text-white" />
                 </button>
              </div>
              
              <div className="flex-1 w-full space-y-4">
                 <div>
                    <label className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1 block">Full Name</label>
                    <div className="relative">
                       <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                       <Input 
                         value={profile.name} 
                         onChange={e => setProfile({...profile, name: e.target.value})} 
                         className="pl-10"
                       />
                    </div>
                 </div>
                 
                 <div>
                    <label className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1 block">College / University</label>
                    <div className="relative">
                       <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                       <Input 
                         value={profile.college} 
                         onChange={e => setProfile({...profile, college: e.target.value})} 
                         className="pl-10"
                         placeholder="e.g. Stanford University"
                       />
                    </div>
                 </div>
              </div>
           </div>
        </Card>

        <Card className="p-8 space-y-6">
           <div>
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3 block">Skills & Expertise</label>
              <div className="flex flex-wrap gap-2">
                 {SKILL_OPTIONS.map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-medium transition-all border",
                        profile.skills.includes(skill) 
                          ? "bg-blue-500/20 border-blue-500/50 text-blue-400" 
                          : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
                      )}
                    >
                       {skill}
                    </button>
                 ))}
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                 <label className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1 block">GitHub Profile</label>
                 <div className="relative">
                    <Code2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                    <Input 
                      value={profile.github} 
                      onChange={e => setProfile({...profile, github: e.target.value})} 
                      className="pl-10"
                      placeholder="github.com/username"
                    />
                 </div>
              </div>
              <div>
                 <label className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1 block">LinkedIn Profile</label>
                 <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                    <Input 
                      value={profile.linkedin} 
                      onChange={e => setProfile({...profile, linkedin: e.target.value})} 
                      className="pl-10"
                      placeholder="linkedin.com/in/username"
                    />
                 </div>
              </div>
           </div>

           <div>
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1 block">Bio</label>
              <textarea 
                value={profile.bio} 
                onChange={e => setProfile({...profile, bio: e.target.value})} 
                className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                rows={4}
                placeholder="Tell us about yourself..."
              />
           </div>
        </Card>

        <div className="flex justify-end">
           <Button type="submit" disabled={saving} className="px-12">
              {saving ? "Saving Changes..." : "Save Profile"}
           </Button>
        </div>
      </form>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
