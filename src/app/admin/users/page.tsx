"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, where, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  ShieldCheck, 
  User as UserIcon,
  Mail,
  GraduationCap,
  LayoutDashboard,
  ShieldAlert
} from "lucide-react";
import { toast } from "react-hot-toast";

interface UserProfile {
  id: string;
  uid: string;
  name: string;
  email: string;
  role: "user" | "admin";
  college?: string;
  createdAt?: any;
}

export default function UsersManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserProfile[];
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAdmin = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    if (!confirm(`Switch user to ${newRole}?`)) return;
    try {
      await updateDoc(doc(db, "users", userId), { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole as any } : u));
      toast.success(`Role updated to ${newRole}`);
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold italic tracking-tight">Community Management</h2>
          <p className="text-white/60 text-sm">Oversee participants and administrative roles.</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <Input 
            className="pl-12 h-12 rounded-2xl bg-white/5" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="secondary" className="gap-2 h-12 rounded-2xl">
          <Filter className="h-4 w-4" />
          Role: Any
        </Button>
      </div>

      <Card className="overflow-hidden p-0 bg-white/[0.01] border-white/5">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-white/5 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-white/40">
                     <th className="px-6 py-4">User Details</th>
                     <th className="px-6 py-4">Academic Background</th>
                     <th className="px-6 py-4">Joined On</th>
                     <th className="px-6 py-4">Status / Role</th>
                     <th className="px-6 py-4 text-right">Access Control</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/[0.03]">
                  {loading ? (
                    [1,2,3,4,5].map(i => (
                       <tr key={i} className="animate-pulse">
                          <td colSpan={5} className="px-6 py-8"><div className="h-4 bg-white/5 rounded-full w-full"></div></td>
                       </tr>
                    ))
                  ) : filteredUsers.map((u) => (
                     <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-xs font-bold">
                                 {u.name?.[0] || u.email[0].toUpperCase()}
                              </div>
                              <div className="flex flex-col">
                                 <span className="font-semibold text-sm">{u.name || "Incomplete Profile"}</span>
                                 <span className="text-[10px] text-white/40 flex items-center gap-1">
                                    <Mail className="h-2.5 w-2.5" />
                                    {u.email}
                                 </span>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2 text-xs text-white/60 font-medium">
                              <GraduationCap className="h-3.5 w-3.5 text-blue-400" />
                              {u.college || "No college listed"}
                           </div>
                        </td>
                        <td className="px-6 py-4 text-[10px] font-mono text-white/30">
                           {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Historical"}
                        </td>
                        <td className="px-6 py-4">
                           <Badge variant={u.role === "admin" ? "accent" : "secondary"}>
                              {u.role === "admin" && <ShieldCheck className="h-3 w-3 mr-1" />}
                              {u.role}
                           </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <Button 
                             variant="ghost" 
                             size="sm" 
                             onClick={() => toggleAdmin(u.id, u.role)}
                             className={cn(
                               "h-9 px-3 rounded-xl text-[10px] font-bold gap-2",
                               u.role === "admin" ? "text-red-400 hover:bg-red-500/10" : "text-blue-400 hover:bg-blue-500/10"
                             )}
                           >
                              {u.role === "admin" ? <ShieldAlert className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                              {u.role === "admin" ? "REVOKE ADMIN" : "PROMOTE ADMIN"}
                           </Button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </Card>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
