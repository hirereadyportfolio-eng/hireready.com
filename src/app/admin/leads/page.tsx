"use client";

import React, { useState, useEffect, useMemo } from "react";
import { collection, getDocs, doc, updateDoc, query, orderBy, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { 
  Mail, 
  User, 
  Building2, 
  Search, 
  Filter, 
  CheckCircle2, 
  X, 
  Clock,
  MessageSquare,
  TrendingUp,
  Download,
  ExternalLink,
  ChevronRight,
  Reply,
  AlertTriangle,
  History,
  TrendingDown
} from "lucide-react";
import { toast } from "react-hot-toast";

interface Lead {
  id: string;
  name: string;
  email: string;
  organization: string;
  role: "Student" | "College" | "Company";
  message: string;
  status: "new" | "contacted" | "qualified" | "closed" | "spam";
  createdAt: any;
  notes?: string;
  followUpDate?: string;
}

export default function LeadCRM() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 10;
  const [auditLogs, setAuditLogs] = useState<string[]>([]);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Lead[];
      setLeads(data);
    } catch (error) {
      console.error("Error fetching leads", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset page on search
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const logAction = (action: string) => {
    console.log(`[AUDIT] ${new Date().toISOString()}: ${action}`);
    setAuditLogs(prev => [`${new Date().toLocaleTimeString()} - ${action}`, ...prev].slice(0, 50));
  };

  const updateStatus = async (id: string, status: Lead["status"]) => {
    try {
      await updateDoc(doc(db, "leads", id), { status });
      setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
      if (selectedLead?.id === id) setSelectedLead({ ...selectedLead, status });
      logAction(`Updated lead ${id} to ${status}`);
      toast.success(`Pipeline updated: ${status}`);
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const updateLeadDetails = async (id: string, update: Partial<Lead>) => {
    try {
      await updateDoc(doc(db, "leads", id), update);
      setLeads(leads.map(l => l.id === id ? { ...l, ...update } : l));
      if (selectedLead?.id === id) setSelectedLead({ ...selectedLead, ...update } as Lead);
      logAction(`Updated lead ${id} details`);
      toast.success("Lead details updated");
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const deleteLead = async (id: string) => {
    const confirmationWord = "DELETE";
    if (window.prompt(`Type "${confirmationWord}" to permanently wipe this lead data.`) !== confirmationWord) return;
    try {
      await deleteDoc(doc(db, "leads", id));
      setLeads(leads.filter(l => l.id !== id));
      setSelectedLead(null);
      logAction(`Deleted lead ${id}`);
      toast.success("Lead removed");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const handleBulkStatus = async (status: Lead["status"]) => {
    if (!selectedLeads.size) return;
    if (!confirm(`Mark ${selectedLeads.size} leads as ${status}?`)) return;
    try {
      await Promise.all(Array.from(selectedLeads).map(id => updateDoc(doc(db, "leads", id), { status })));
      setLeads(leads.map(l => selectedLeads.has(l.id) ? { ...l, status } : l));
      logAction(`Bulk updated ${selectedLeads.size} leads to ${status}`);
      setSelectedLeads(new Set());
      toast.success("Bulk update complete");
    } catch (e) {
      toast.error("Bulk update failed partially");
    }
  };

  // Analytics
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayLeads = leads.filter(l => l.createdAt && (l.createdAt.seconds * 1000) > today.getTime());
    const qualifiedLeads = leads.filter(l => l.status === "qualified" || l.status === "closed");
    const convRate = leads.length > 0 ? (qualifiedLeads.length / leads.length) * 100 : 0;

    return {
      total: leads.length,
      today: todayLeads.length,
      convRate: convRate.toFixed(1),
      pending: leads.filter(l => l.status === "new").length
    };
  }, [leads]);

  const filteredLeads = leads.filter(l => {
    const matchesStatus = filterStatus === "all" || l.status === filterStatus;
    const matchesRole = filterRole === "all" || l.role === filterRole;
    const matchesSearch = l.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
                         l.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                         l.organization.toLowerCase().includes(debouncedSearch.toLowerCase());
    return matchesStatus && matchesRole && matchesSearch;
  });

  const paginatedLeads = filteredLeads.slice((currentPage - 1) * leadsPerPage, currentPage * leadsPerPage);
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

  const exportCSV = () => {
    const headers = ["Name", "Email", "Organization", "Role", "Status", "Date", "Message"];
    const rows = filteredLeads.map(l => [
      l.name, l.email, l.organization, l.role, l.status,
      new Date(l.createdAt?.seconds * 1000).toLocaleString(),
      l.message.replace(/,/g, " ")
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-tr from-white to-white/40">CRM Command Center</h2>
          <p className="text-white/40 text-sm mt-1">Manage conversion cycles and engage potential partners.</p>
        </div>
        <div className="flex gap-4">
           <Button onClick={exportCSV} variant="secondary" className="gap-2 rounded-2xl border-white/5 font-bold italic h-12">
              <Download className="h-4 w-4" /> Export CSV
           </Button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
         <StatCard label="Total Capture" value={stats.total} icon={Mail} color="text-blue-400" bg="bg-blue-500/10" />
         <StatCard label="Today Incoming" value={stats.today} icon={TrendingUp} color="text-green-400" bg="bg-green-500/10" />
         <StatCard label="Conversion %" value={`${stats.convRate}%`} icon={CheckCircle2} color="text-purple-400" bg="bg-purple-500/10" />
         <StatCard label="Pending High Ops" value={stats.pending} icon={Clock} color="text-orange-400" bg="bg-orange-500/10" />
      </div>

      {/* Controls */}
      <Card className="p-6 bg-white/[0.01] border-white/5">
         <div className="flex flex-col lg:flex-row gap-6">
            <div className="relative flex-1">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
               <input 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full h-12 rounded-2xl bg-white/5 border border-white/5 pl-12 pr-4 text-sm focus:border-white/20 outline-none transition-all" 
                 placeholder="Search by name, email, org..."
               />
            </div>
            <div className="flex flex-wrap gap-3">
               <select 
                 value={filterStatus} 
                 onChange={(e) => setFilterStatus(e.target.value)}
                 className="h-12 rounded-2xl bg-white/5 border border-white/5 px-4 text-xs font-bold uppercase tracking-widest text-white/60 outline-none hover:bg-white/10"
               >
                  <option value="all">Every Status</option>
                  <option value="new">New / Unread</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="closed">Closed Deal</option>
                  <option value="spam">Spam / Junk</option>
               </select>

               <select 
                 value={filterRole} 
                 onChange={(e) => setFilterRole(e.target.value)}
                 className="h-12 rounded-2xl bg-white/5 border border-white/5 px-4 text-xs font-bold uppercase tracking-widest text-white/60 outline-none hover:bg-white/10"
               >
                  <option value="all">All Roles</option>
                  <option value="Student">Students Only</option>
                  <option value="College">Colleges Only</option>
                  <option value="Company">Companies Only</option>
               </select>
            </div>
         </div>
      </Card>

      {/* Lead List */}
      <div className="grid gap-4">
         {loading ? (
            [1,2,3].map(i => <div key={i} className="h-24 animate-pulse bg-white/5 rounded-3xl" />)
         ) : paginatedLeads.length === 0 ? (
            <div className="py-20 text-center text-white/10 italic font-bold">No leads matching your current criteria.</div>
         ) : paginatedLeads.map((lead) => (
            <div 
              key={lead.id} 
              className="flex flex-col md:flex-row md:items-center gap-6 p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all cursor-pointer group"
            >
               <input 
                 type="checkbox" 
                 checked={selectedLeads.has(lead.id)}
                 onChange={(e) => {
                   const newSet = new Set(selectedLeads);
                   e.target.checked ? newSet.add(lead.id) : newSet.delete(lead.id);
                   setSelectedLeads(newSet);
                 }}
                 className="mt-1 md:mt-0"
               />
               <div className="flex items-center gap-6 min-w-0 flex-1" onClick={() => setSelectedLead(lead)}>
                  <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-blue-600/20 to-purple-600/20 flex items-center justify-center font-black italic text-white/20 group-hover:text-white transition-colors">
                     {lead.name[0]}
                  </div>
                  <div className="min-w-0">
                     <div className="flex items-center gap-3">
                        <span className="font-bold text-lg tracking-tight truncate">{lead.name}</span>
                        <StatusBadge status={lead.status} />
                     </div>
                     <div className="flex items-center gap-4 mt-1 text-[10px] uppercase font-bold tracking-widest text-white/30 group-hover:text-white/50">
                        <span className="flex items-center gap-1.5"><Building2 className="h-3 w-3" /> {lead.organization}</span>
                        <span className="flex items-center gap-1.5"><Mail className="h-3 w-3" /> {lead.email}</span>
                     </div>
                  </div>
               </div>
               
               <div className="md:w-64 text-sm text-white/40 truncate italic pr-10" onClick={() => setSelectedLead(lead)}>
                  {lead.message}
               </div>

               <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-white/5">
                  <div className="flex flex-col md:items-end">
                     <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Received</span>
                     <span className="text-xs font-medium text-white/60">
                        {lead.createdAt ? new Date(lead.createdAt.seconds * 1000).toLocaleDateString() : "Just now"}
                     </span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-white/10 group-hover:text-white transition-all transform group-hover:translate-x-1" onClick={() => setSelectedLead(lead)} />
               </div>
            </div>
         ))}
      </div>

      {/* Pagination & Bulk Actions */}
      {leads.length > 0 && (
         <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
            <div className="flex items-center gap-2">
               <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Selected {selectedLeads.size}</span>
               {selectedLeads.size > 0 && (
                 <select 
                   onChange={(e) => handleBulkStatus(e.target.value as any)}
                   className="h-10 rounded-xl bg-white/5 border border-white/5 px-4 text-xs font-bold text-white/60 outline-none"
                 >
                    <option value="">Bulk Action...</option>
                    <option value="qualified">Mark Qualified</option>
                    <option value="closed">Mark Closed</option>
                    <option value="spam">Mark Spam</option>
                 </select>
               )}
            </div>
            
            <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
               <Button variant="ghost" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Prev</Button>
               <span className="text-xs font-bold text-white/60">Page {currentPage} of {totalPages || 1}</span>
               <Button variant="ghost" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</Button>
            </div>
         </div>
      )}

      {/* Detail Modal */}
      {selectedLead && (
         <div className="fixed inset-0 z-[100] grid place-items-center bg-black/95 backdrop-blur-3xl p-4">
            <Card className="w-full max-w-3xl p-0 overflow-hidden shadow-2xl relative">
               <button 
                 onClick={() => setSelectedLead(null)}
                 className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 text-white/20 hover:text-white z-10"
               >
                  <X className="h-5 w-5" />
               </button>

               <div className="grid lg:grid-cols-12 max-h-[90vh]">
                  {/* Content */}
                  <div className="lg:col-span-8 p-10 space-y-10 overflow-y-auto">
                     <div>
                        <StatusBadge status={selectedLead.status} />
                        <h3 className="text-4xl font-black italic tracking-tighter mt-4 leading-none">{selectedLead.name}</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mt-2">{selectedLead.organization}</p>
                     </div>

                     <div className="grid grid-cols-2 gap-8 border-y border-white/5 py-8">
                        <div>
                           <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] block mb-2">Primary Email</span>
                           <a href={`mailto:${selectedLead.email}`} className="text-sm font-bold text-white flex items-center gap-2 hover:underline">
                              {selectedLead.email} <ExternalLink className="h-3 w-3" />
                           </a>
                        </div>
                        <div>
                           <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] block mb-2">Strategic Role</span>
                           <p className="text-sm font-bold text-white uppercase italic">{selectedLead.role}</p>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
                           <MessageSquare className="h-3 w-3" /> Transmitted Message
                        </span>
                        <div className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 text-base leading-relaxed text-white/70 italic relative">
                           {selectedLead.message}
                        </div>
                     </div>

                     <div className="grid grid-cols-1 gap-8 border-t border-white/5 py-8">
                        <div>
                           <label className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] block mb-2">Operator Notes</label>
                           <textarea 
                             className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:outline-none" 
                             rows={3}
                             placeholder="Internal sales notes..."
                             defaultValue={selectedLead.notes || ""}
                             onBlur={(e) => updateLeadDetails(selectedLead.id, { notes: e.target.value })}
                           />
                        </div>
                     </div>
                  </div>

                  {/* Sidebar Controls */}
                  <div className="lg:col-span-4 p-10 bg-white/[0.02] space-y-10 border-l border-white/5">
                     <div className="space-y-4">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">Move Stage</span>
                        <div className="grid gap-2">
                           <StageButton active={selectedLead.status === "contacted"} onClick={() => updateStatus(selectedLead.id, "contacted")} label="Mark Contacted" />
                           <StageButton active={selectedLead.status === "qualified"} onClick={() => updateStatus(selectedLead.id, "qualified")} label="Force Qualify" />
                           <StageButton active={selectedLead.status === "closed"} onClick={() => updateStatus(selectedLead.id, "closed")} label="Close Deal" />
                           <StageButton active={selectedLead.status === "spam"} onClick={() => updateStatus(selectedLead.id, "spam")} label="Flag Spam" />
                        </div>
                     </div>

                     <div className="space-y-4 pt-6 border-t border-white/5">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">Follow Up Date</span>
                        <input 
                          type="date"
                          className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white/70 focus:outline-none"
                          defaultValue={selectedLead.followUpDate || ""}
                          onChange={(e) => updateLeadDetails(selectedLead.id, { followUpDate: e.target.value })}
                        />
                     </div>

                     <div className="space-y-4 pt-6 border-t border-white/5">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">Engagement</span>
                        <a 
                          href={`mailto:${selectedLead.email}?subject=Regarding your HireReady request&body=Hi ${selectedLead.name.split(' ')[0]},`}
                          className="flex items-center justify-center gap-3 w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 text-sm font-black italic shadow-xl shadow-blue-600/20 transition-all"
                        >
                           <Reply className="h-4 w-4" /> REPLY DIRECTLY
                        </a>
                        <button 
                          onClick={() => deleteLead(selectedLead.id)}
                          className="flex items-center justify-center gap-3 w-full h-10 rounded-2xl text-xs font-bold text-white/20 hover:text-red-400 hover:bg-red-400/5 transition-all"
                        >
                           WIPE LEAD
                        </button>
                     </div>
                  </div>
               </div>
            </Card>
         </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, bg }: any) {
   return (
      <Card className="p-8 group hover:border-white/20 transition-all duration-500">
         <div className="flex items-center justify-between mb-6">
            <div className={`rounded-full p-4 transition-all duration-500 group-hover:scale-110 ${bg} ${color}`}>
               <Icon className="h-5 w-5" />
            </div>
            <History className="h-4 w-4 text-white/10 group-hover:text-white/40 transition-colors" />
         </div>
         <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">{label}</p>
            <p className="text-3xl font-black italic tracking-tighter text-white">
               {value}
            </p>
         </div>
      </Card>
   );
}

function StatusBadge({ status }: { status: Lead["status"] }) {
   const colors = {
      new: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      contacted: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      qualified: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      closed: "bg-green-500/10 text-green-400 border-green-500/20",
      spam: "bg-red-500/10 text-red-500 border-red-500/20",
   };
   return (
      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${colors[status]}`}>
         {status}
      </span>
   );
}

function StageButton({ label, onClick, active }: any) {
   return (
      <button 
        onClick={onClick}
        disabled={active}
        className={`w-full h-11 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
           active ? "bg-white/10 border-white/10 text-white/20" : "bg-white/5 border-white/5 text-white/60 hover:text-white hover:bg-white/10"
        }`}
      >
         {label}
      </button>
   );
}
