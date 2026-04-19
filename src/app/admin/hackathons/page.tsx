"use client";

import React, { useState, useEffect } from "react";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp, 
  orderBy, 
  query 
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar, 
  Trophy, 
  Users, 
  Edit2, 
  Trash2, 
  X, 
  Image as ImageIcon,
  Loader2,
  Clock
} from "lucide-react";
import { toast } from "react-hot-toast";

interface Hackathon {
  id: string;
  title: string;
  description: string;
  prize: string;
  startDate: string;
  endDate: string;
  status: "draft" | "upcoming" | "ongoing" | "completed";
  registrations: number;
  banner?: string;
  teamSize?: number;
  rules?: string;
}

export default function ManageHackathons() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHackathon, setSelectedHackathon] = useState<Hackathon | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    try {
      const q = query(collection(db, "hackathons"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Hackathon[];
      setHackathons(data);
    } catch (error) {
      console.error("Error fetching hackathons", error);
      toast.error("Failed to load hackathons");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will delete all registrations for this hackathon too.")) return;
    try {
      await deleteDoc(doc(db, "hackathons", id));
      setHackathons(hackathons.filter(h => h.id !== id));
      toast.success("Hackathon deleted");
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const openEditModal = (hack: Hackathon) => {
    setSelectedHackathon(hack);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setSelectedHackathon(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold italic tracking-tight">Manage Hackathons</h2>
          <p className="text-white/60 text-sm">Design, launch, and monitor elite competitions.</p>
        </div>
        <Button onClick={openCreateModal} className="gap-2 h-12 px-6 rounded-2xl shadow-xl shadow-purple-600/10">
          <Plus className="h-5 w-5" />
          Create Hackathon
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <Input className="pl-12 h-12 rounded-2xl bg-white/5 border-white/5" placeholder="Search competitions..." />
        </div>
        <Button variant="secondary" className="gap-2 h-12 px-5 rounded-2xl">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
           {[1,2,3].map(i => (
             <Card key={i} className="h-64 animate-pulse p-0" glass={false} />
           ))}
        </div>
      ) : hackathons.length === 0 ? (
        <Card className="p-20 flex flex-col items-center justify-center text-center border-dashed border-white/10">
            <div className="h-20 w-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
               <Trophy className="h-10 w-10 text-white/10" />
            </div>
            <h3 className="text-2xl font-bold italic tracking-tight underline underline-offset-8 decoration-purple-500/30">No competitions found</h3>
            <p className="text-white/40 max-w-xs mt-4 text-sm leading-relaxed">
               You haven't designed any hackathons yet. Start by defining your first track.
            </p>
            <Button onClick={openCreateModal} variant="secondary" className="mt-10 px-8 rounded-2xl border-white/10">
               Launch Creator
            </Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {hackathons.map((h) => (
            <Card key={h.id} className="group p-0 overflow-hidden hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/5 transition-all duration-500">
              <div className="relative h-32 bg-white/5">
                 {h.banner ? (
                   <img src={h.banner} alt={h.title} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
                 ) : (
                   <div className="w-full h-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-white/10" />
                   </div>
                 )}
                 <div className="absolute top-4 right-4">
                    <Badge variant={h.status === "ongoing" ? "success" : h.status === "completed" ? "secondary" : "accent"}>
                       {h.status}
                    </Badge>
                 </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-bold italic tracking-tight truncate">{h.title}</h3>
                <p className="text-xs text-white/40 mt-1 line-clamp-2 leading-relaxed">{h.description}</p>
                
                <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-6">
                   <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                         <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">Registrations</span>
                         <span className="text-sm font-bold flex items-center gap-1.5 mt-0.5">
                            <Users className="h-3.5 w-3.5 text-blue-400" />
                            {h.registrations || 0}
                         </span>
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">Prize Pool</span>
                         <span className="text-sm font-bold flex items-center gap-1.5 mt-0.5 text-purple-400">
                            <Trophy className="h-3.5 w-3.5" />
                            {h.prize}
                         </span>
                      </div>
                   </div>
                </div>

                <div className="mt-8 flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => openEditModal(h)} className="flex-1 rounded-xl h-10 gap-2 text-xs border-white/5 hover:border-white/20">
                    <Edit2 className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(h.id)} className="w-10 rounded-xl h-10 p-0 hover:bg-red-500/10 hover:text-red-400">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {isModalOpen && (
        <HackathonModal 
          hackathon={selectedHackathon} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false);
            fetchHackathons();
          }} 
        />
      )}
    </div>
  );
}

function HackathonModal({ hackathon, onClose, onSuccess }: any) {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: hackathon?.title || "",
    description: hackathon?.description || "",
    prize: hackathon?.prize || "",
    startDate: hackathon?.startDate || "",
    endDate: hackathon?.endDate || "",
    status: hackathon?.status || "upcoming",
    teamSize: hackathon?.teamSize || 4,
    rules: hackathon?.rules || ""
  });
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let bannerUrl = hackathon?.banner || "";
      
      if (bannerFile) {
        const storageRef = ref(storage, `banners/${Date.now()}_${bannerFile.name}`);
        const uploadResult = await uploadBytes(storageRef, bannerFile);
        bannerUrl = await getDownloadURL(uploadResult.ref);
      }

      const data = {
        ...formData,
        banner: bannerUrl,
        updatedAt: serverTimestamp()
      };

      if (hackathon) {
        await updateDoc(doc(db, "hackathons", hackathon.id), data);
        toast.success("Updated successfully");
      } else {
        await addDoc(collection(db, "hackathons"), {
          ...data,
          registrations: 0,
          createdAt: serverTimestamp()
        });
        toast.success("Created successfully");
      }
      onSuccess();
    } catch (error) {
      toast.error("Process failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 overflow-y-auto">
      <Card className="w-full max-w-2xl p-8 my-8 relative shadow-2xl">
        <div className="flex justify-between items-start mb-8">
           <h3 className="text-2xl font-bold italic tracking-tight">
             {hackathon ? "Edit Competition" : "Design New Track"}
           </h3>
           <button onClick={onClose} className="p-2 text-white/20 hover:text-white">
              <X className="h-6 w-6" />
           </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
               <div>
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 mb-2 block">Track Title</label>
                  <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. GenAI Global Summit" className="bg-white/5" />
               </div>
               <div>
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 mb-2 block">Prize Pool</label>
                  <Input required value={formData.prize} onChange={e => setFormData({...formData, prize: e.target.value})} placeholder="$10,000 + Funding" className="bg-white/5" />
               </div>
            </div>
            
            <div className="space-y-4">
               <div>
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 mb-2 block">Track Banner</label>
                  <div className="relative h-12 w-full">
                     <input type="file" onChange={e => setBannerFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                     <div className="h-full border border-dashed border-white/10 rounded-2xl bg-white/5 flex items-center justify-center gap-2">
                        <ImageIcon className="h-4 w-4 text-white/30" />
                        <span className="text-xs text-white/30">{bannerFile ? bannerFile.name : "Choose Banner Image"}</span>
                     </div>
                  </div>
               </div>
               <div>
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 mb-2 block">Status</label>
                  <select 
                    value={formData.status} 
                    onChange={e => setFormData({...formData, status: e.target.value as any})}
                    className="w-full h-12 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="draft">Draft</option>
                  </select>
               </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 mb-2 block">Description</label>
            <textarea 
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500" 
              rows={3} 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="What makes this competition unique?"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 mb-2 block">Start Date</label>
              <Input type="date" required value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="bg-white/5" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 mb-2 block">End Date</label>
              <Input type="date" required value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="bg-white/5" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 mb-2 block">Max Team Size</label>
              <Input type="number" required value={formData.teamSize} onChange={e => setFormData({...formData, teamSize: parseInt(e.target.value)})} className="bg-white/5" />
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1 h-12 rounded-2xl border-white/10">Discard</Button>
            <Button type="submit" disabled={submitting} className="flex-1 h-12 rounded-2xl gap-2 shadow-2xl shadow-purple-600/20">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Clock className="h-4 w-4" />}
              {submitting ? "Processing..." : hackathon ? "Save Changes" : "Publish Competition"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
