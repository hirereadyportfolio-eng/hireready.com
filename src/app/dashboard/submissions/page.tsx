"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, setDoc, serverTimestamp, query, where } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { 
  Send, 
  Github, 
  Link as LinkIcon, 
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  Loader2,
  ArrowRight
} from "lucide-react";
import { toast } from "react-hot-toast";

interface Registration {
  id: string;
  hackathonId: string;
  hackathonTitle: string;
}

interface Submission {
  hackathonId: string;
  repoLink: string;
  demoLink: string;
  pptLink: string;
  description: string;
  submittedAt: any;
  status?: string;
}

export default function SubmissionsPage() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [submissions, setSubmissions] = useState<Record<string, Submission>>({});
  const [loading, setLoading] = useState(true);
  const [selectedHack, setSelectedHack] = useState<Registration | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const regSnap = await getDocs(collection(db, "users", user!.uid, "registrations"));
      const regData = regSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Registration[];
      setRegistrations(regData);

      const subSnap = await getDocs(query(collection(db, "submissions"), where("userId", "==", user!.uid)));
      const subData: Record<string, Submission> = {};
      subSnap.docs.forEach(doc => {
        const data = doc.data() as Submission;
        subData[data.hackathonId] = data;
      });
      setSubmissions(subData);
    } catch (error) {
      console.error("Error fetching submissions", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !selectedHack) return;

    const formData = new FormData(e.currentTarget);
    const file = (e.currentTarget.elements.namedItem("pptFile") as HTMLInputElement).files?.[0];
    
    let pptLink = formData.get("pptLink") as string;
    
    setUploading(true);

    try {
      if (file) {
        const storageRef = ref(storage, `submissions/${user.uid}/${selectedHack.hackathonId}/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        pptLink = await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (error) => reject(error),
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            }
          );
        });
      }

      const data = {
        userId: user.uid,
        userName: user.displayName,
        userEmail: user.email,
        hackathonId: selectedHack.hackathonId,
        hackathonTitle: selectedHack.hackathonTitle,
        repoLink: formData.get("repoLink") as string,
        demoLink: formData.get("demoLink") as string,
        pptLink: pptLink,
        description: formData.get("description") as string,
        submittedAt: serverTimestamp(),
        status: "pending"
      };

      await setDoc(doc(db, "submissions", `${user.uid}_${selectedHack.hackathonId}`), data);
      toast.success("Submission successful!");
      
      // Update local state
      setSubmissions({ ...submissions, [selectedHack.hackathonId]: data as any });
      setSelectedHack(null);
    } catch (error: any) {
      toast.error(error.message || "Submission failed");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  if (loading) return <div className="text-center py-20 text-white/50 italic animate-pulse">Checking records...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold italic tracking-tight">Project Submissions</h2>
          <p className="text-white/60">Finalize your craft and submit for elite review.</p>
        </div>
      </div>

      {registrations.length === 0 ? (
        <Card className="p-16 text-center border-dashed border-white/20">
           <AlertCircle className="h-16 w-16 text-white/10 mx-auto mb-6" />
           <h3 className="text-2xl font-bold italic tracking-tight">No registrations found</h3>
           <p className="text-white/50 mt-2 mb-8 max-w-sm mx-auto">
             You haven't joined any hackathons yet. Explore the tracks and register to start building.
           </p>
           <Button variant="secondary" onClick={() => window.location.href='/dashboard/hackathons'} className="px-8 rounded-2xl">
             Launch Discovery <ArrowRight className="h-4 w-4 ml-2" />
           </Button>
        </Card>
      ) : (
        <div className="grid gap-6">
          {registrations.map((reg) => {
            const submission = submissions[reg.hackathonId];
            return (
              <Card key={reg.id} className="p-8 group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className={cn(
                      "h-16 w-16 rounded-3xl flex items-center justify-center border-2 transition-all duration-500",
                      submission 
                        ? "bg-green-500/10 border-green-500/20 text-green-400" 
                        : "bg-white/5 border-white/10 text-white/20"
                    )}>
                      {submission ? <CheckCircle2 className="h-8 w-8" /> : <Clock className="h-8 w-8" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-xl italic tracking-tight">{reg.hackathonTitle}</h3>
                        {submission && (
                          <Badge variant="success" className="h-5">Submitted</Badge>
                        )}
                      </div>
                      <p className="text-sm text-white/40 mt-1">
                        {submission ? `Final entry on ${new Date(submission.submittedAt?.seconds * 1000).toLocaleDateString()}` : "Awaiting your masterpiece"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    {submission ? (
                      <Button variant="secondary" onClick={() => setSelectedHack(reg)} className="rounded-2xl border-white/10 hover:bg-white/10">
                        Update Submission
                      </Button>
                    ) : (
                      <Button onClick={() => setSelectedHack(reg)} className="gap-2 rounded-2xl shadow-xl shadow-blue-600/20">
                        <Send className="h-4 w-4" />
                        Submit Entry
                      </Button>
                    )}
                  </div>
                </div>

                {submission && (
                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/5 pt-8">
                    <a href={submission.repoLink} target="_blank" className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-xs hover:bg-white/[0.06] transition-all group/link">
                      <div className="flex items-center gap-3">
                         <Github className="h-5 w-5 text-white/40 group-hover/link:text-white" />
                         <span className="font-medium">Repository</span>
                      </div>
                      <LinkIcon className="h-3 w-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                    </a>
                    <a href={submission.demoLink} target="_blank" className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-xs hover:bg-white/[0.06] transition-all group/link">
                      <div className="flex items-center gap-3">
                         <LinkIcon className="h-5 w-5 text-white/40 group-hover/link:text-white" />
                         <span className="font-medium">Live Demo</span>
                      </div>
                      <Plus className="h-3 w-3 rotate-45 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                    </a>
                    <a href={submission.pptLink} target="_blank" className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-xs hover:bg-white/[0.06] transition-all group/link">
                      <div className="flex items-center gap-3">
                         <FileText className="h-5 w-5 text-white/40 group-hover/link:text-white" />
                         <span className="font-medium">Presentation</span>
                      </div>
                      <CheckCircle2 className="h-3 w-3 opacity-0 group-hover/link:opacity-100 transition-opacity text-green-400" />
                    </a>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {selectedHack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4">
           <Card className="w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto shadow-2xl shadow-black">
              <div className="flex justify-between items-start mb-6">
                 <div>
                    <h3 className="text-2xl font-bold italic tracking-tight">Project Submission</h3>
                    <p className="text-white/40 text-sm mt-1">{selectedHack.hackathonTitle}</p>
                 </div>
                 <button onClick={() => setSelectedHack(null)} className="p-2 text-white/20 hover:text-white">
                    <Plus className="h-6 w-6 rotate-45" />
                 </button>
              </div>
              
              <form onSubmit={handleSubmission} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 mb-2 block">GitHub Repository</label>
                      <Input name="repoLink" required defaultValue={submissions[selectedHack.hackathonId]?.repoLink} placeholder="https://github.com/profile/repo" className="bg-white/5" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 mb-2 block">Demo URL</label>
                      <Input name="demoLink" required defaultValue={submissions[selectedHack.hackathonId]?.demoLink} placeholder="Loom/YouTube or Vercel link" className="bg-white/5" />
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 mb-2 block">PPT/PDF File Upload</label>
                      <div className="relative group/upload">
                         <input 
                           type="file" 
                           name="pptFile" 
                           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                           accept=".pdf,.ppt,.pptx"
                         />
                         <div className="h-12 border-2 border-dashed border-white/10 rounded-2xl bg-white/5 flex items-center justify-center gap-2 group-hover/upload:border-white/20 transition-all">
                            <Upload className="h-4 w-4 text-white/40" />
                            <span className="text-xs text-white/40">Choose file or drag here</span>
                         </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 mb-2 block">Or Presentation Link</label>
                      <Input name="pptLink" defaultValue={submissions[selectedHack.hackathonId]?.pptLink} placeholder="Canva/G-Drive link" className="bg-white/5" />
                    </div>
                 </div>

                 <div>
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 mb-2 block">Brief Synopsis</label>
                    <textarea 
                      name="description"
                      className="w-full rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                      rows={4} 
                      required
                      defaultValue={submissions[selectedHack.hackathonId]?.description}
                      placeholder="Explain your technical architecture, the problem solved, and key unique selling points."
                    />
                 </div>

                 {uploading && (
                   <div className="space-y-2">
                     <div className="flex justify-between text-xs font-bold text-[color:var(--color-accent)]">
                       <span>Uploading files...</span>
                       <span>{Math.round(uploadProgress)}%</span>
                     </div>
                     <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                     </div>
                   </div>
                 )}

                 <div className="flex gap-4 pt-4">
                    <Button type="button" variant="secondary" onClick={() => setSelectedHack(null)} className="flex-1 rounded-2xl h-12">Cancel</Button>
                    <Button type="submit" disabled={uploading} className="flex-1 h-12 rounded-2xl gap-2 font-bold italic tracking-tight">
                       {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                       {uploading ? "Uploading..." : submissions[selectedHack.hackathonId] ? "Sync Updates" : "Confirm Submission"}
                    </Button>
                 </div>
              </form>
           </Card>
        </div>
      )}
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
