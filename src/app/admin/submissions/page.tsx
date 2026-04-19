"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, serverTimestamp, query, orderBy, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { 
  Github, 
  Link as LinkIcon, 
  FileText, 
  Search, 
  Filter, 
  CheckCircle2, 
  Star,
  MoreVertical,
  ChevronRight,
  ExternalLink,
  Award,
  X
} from "lucide-react";
import { toast } from "react-hot-toast";

interface Submission {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  hackathonId: string;
  hackathonTitle: string;
  repoLink: string;
  demoLink: string;
  pptLink: string;
  description: string;
  submittedAt: any;
  status: string;
  score?: number;
  scores?: {
    innovation: number;
    technical: number;
    uiux: number;
    completion: number;
    presentation: number;
  };
}

export default function ReviewSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const q = query(collection(db, "submissions"), orderBy("submittedAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Submission[];
      setSubmissions(data);
    } catch (error) {
      console.error("Error fetching submissions", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold italic tracking-tight">Project Review Panel</h2>
          <p className="text-white/60 text-sm">Evaluate technical craft and innovation signal.</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <Input className="pl-12 h-12 rounded-2xl bg-white/5" placeholder="Search by participant or track..." />
        </div>
        <Button variant="secondary" className="gap-2 h-12 rounded-2xl">
          <Filter className="h-4 w-4" />
          Pending First
        </Button>
      </div>

      <Card className="overflow-hidden p-0 border-white/5 bg-white/[0.01]">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-white/5 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-white/40">
                     <th className="px-6 py-4 font-bold">Participant</th>
                     <th className="px-6 py-4 font-bold">Hackathon</th>
                     <th className="px-6 py-4 font-bold">Submitted</th>
                     <th className="px-6 py-4 font-bold">Status</th>
                     <th className="px-6 py-4 font-bold text-center">Score</th>
                     <th className="px-6 py-4 font-bold"></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/[0.03]">
                  {loading ? (
                    [1,2,3,4,5].map(i => (
                       <tr key={i} className="animate-pulse">
                          <td colSpan={6} className="px-6 py-8"><div className="h-4 bg-white/5 rounded-full w-full"></div></td>
                       </tr>
                    ))
                  ) : submissions.map((sub) => (
                     <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-blue-600/20 to-purple-600/20 flex items-center justify-center border border-white/5 text-xs font-bold">
                                 {sub.userName[0]}
                              </div>
                              <div className="flex flex-col">
                                 <span className="font-semibold text-sm">{sub.userName}</span>
                                 <span className="text-[10px] text-white/40">{sub.userEmail}</span>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className="text-sm font-medium italic text-white/70">{sub.hackathonTitle}</span>
                        </td>
                        <td className="px-6 py-4 text-xs text-white/40">
                           {sub.submittedAt ? new Date(sub.submittedAt.seconds * 1000).toLocaleDateString() : "Recently"}
                        </td>
                        <td className="px-6 py-4">
                           <Badge variant={sub.status === "graded" ? "success" : "secondary"}>
                              {sub.status || "pending"}
                           </Badge>
                        </td>
                        <td className="px-6 py-4 text-center">
                           <span className="font-mono text-lg font-bold text-purple-400">
                              {sub.score || "--"}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <Button 
                             onClick={() => setSelectedSubmission(sub)}
                             variant="secondary" 
                             size="sm" 
                             className="h-9 px-4 rounded-xl text-xs gap-2 border-white/5 hover:border-white/20"
                           >
                              Review <ChevronRight className="h-3.5 w-3.5" />
                           </Button>
                        </td>
                     </tr>
                  ))}
                  {!loading && submissions.length === 0 && (
                    <tr>
                       <td colSpan={6} className="px-6 py-20 text-center text-white/20 italic">No submissions found to review.</td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </Card>

      {selectedSubmission && (
        <ScoreModal 
          submission={selectedSubmission} 
          onClose={() => setSelectedSubmission(null)} 
          onSuccess={() => {
            setSelectedSubmission(null);
            fetchSubmissions();
          }} 
        />
      )}
    </div>
  );
}

function ScoreModal({ submission, onClose, onSuccess }: any) {
  const [loading, setLoading] = useState(false);
  const [scores, setScores] = useState(submission.scores || {
    innovation: 0,
    technical: 0,
    uiux: 0,
    completion: 0,
    presentation: 0
  });

  const total: number = (Object.values(scores) as number[]).reduce((a: number, b: number) => a + b, 0);

  const handleScoreChange = (key: string, val: number) => {
    setScores({ ...scores, [key]: val });
  };

  const handlePublish = async () => {
    setLoading(true);
    try {
      // 1. Update submission status and score
      await updateDoc(doc(db, "submissions", submission.id), {
        status: "graded",
        score: total,
        scores: scores,
        gradedAt: serverTimestamp()
      });

      // 2. Add/Update global leaderboard score
      await setDoc(doc(db, "scores", `${submission.userId}_${submission.hackathonId}`), {
        userId: submission.userId,
        userName: submission.userName,
        userEmail: submission.userEmail,
        hackathonId: submission.hackathonId,
        hackathonTitle: submission.hackathonTitle,
        score: total,
        updatedAt: serverTimestamp()
      });

      toast.success("Score published to leaderboard!");
      onSuccess();
    } catch (error) {
      toast.error("Failed to publish score");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 overflow-y-auto">
      <Card className="w-full max-w-4xl p-0 shadow-2xl overflow-hidden border-white/10">
        <div className="grid md:grid-cols-12 h-full lg:max-h-[85vh]">
           {/* Left: Project Preview */}
           <div className="md:col-span-7 p-8 space-y-8 overflow-y-auto border-r border-white/5">
              <div className="flex justify-between items-start">
                 <div>
                    <h3 className="text-2xl font-bold italic tracking-tight">{submission.userName}</h3>
                    <p className="text-white/40 text-sm">{submission.hackathonTitle}</p>
                 </div>
                 <Badge variant="accent" className="h-6">PENDING REVIEW</Badge>
              </div>

              <div className="space-y-4">
                 <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Project Links</h4>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <a href={submission.repoLink} target="_blank" className="flex items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-bold hover:bg-white/10 transition-all group">
                       <Github className="h-3.5 w-3.5 text-white/30 group-hover:text-white" />
                       REPO
                    </a>
                    <a href={submission.demoLink} target="_blank" className="flex items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-bold hover:bg-white/10 transition-all group">
                       <ExternalLink className="h-3.5 w-3.5 text-white/30 group-hover:text-white" />
                       DEMO
                    </a>
                    <a href={submission.pptLink} target="_blank" className="flex items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-bold hover:bg-white/10 transition-all group">
                       <FileText className="h-3.5 w-3.5 text-white/30 group-hover:text-white" />
                       DECK
                    </a>
                 </div>
              </div>

              <div className="space-y-4">
                 <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Synopsis</h4>
                 <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 text-sm leading-relaxed text-white/70 whitespace-pre-wrap">
                    {submission.description}
                 </div>
              </div>
           </div>

           {/* Right: Scoring Controls */}
           <div className="md:col-span-5 p-8 bg-white/[0.01] flex flex-col h-full">
              <div className="flex justify-between items-center mb-8">
                 <h4 className="text-sm font-bold italic tracking-tight uppercase">Technical Rubric</h4>
                 <button onClick={onClose} className="p-1 text-white/20 hover:text-white"><X className="h-5 w-5" /></button>
              </div>

              <div className="flex-1 space-y-6">
                 {[
                   { id: "innovation", label: "Innovation", desc: "Novelty & creativity of solution" },
                   { id: "technical", label: "Technical Quality", desc: "Complexity & performance" },
                   { id: "uiux", label: "UI / UX", desc: "Design & flow polish" },
                   { id: "completion", label: "Completion", desc: "How functional is the MVP?" },
                   { id: "presentation", label: "Presentation", desc: "Clarity of video & deck" },
                 ].map((item) => (
                    <div key={item.id} className="space-y-2">
                       <div className="flex justify-between items-center text-xs font-bold">
                          <span>{item.label}</span>
                          <span className="text-purple-400 font-mono">{scores[item.id as keyof typeof scores]}/20</span>
                       </div>
                       <input 
                         type="range" min="0" max="20" step="1" 
                         value={scores[item.id as keyof typeof scores]} 
                         onChange={(e) => handleScoreChange(item.id, parseInt(e.target.value))}
                         className="w-full h-1.5 bg-white/10 rounded-full appearance-none accent-purple-500 cursor-pointer"
                       />
                       <p className="text-[9px] text-white/30 uppercase tracking-widest">{item.desc}</p>
                    </div>
                 ))}
              </div>

              <div className="mt-12 pt-8 border-t border-white/5">
                 <div className="flex items-center justify-between mb-8">
                    <span className="text-sm font-bold uppercase tracking-widest text-white/40 italic">Aggregated Signal</span>
                    <div className="flex flex-col items-end">
                       <span className="text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-tr from-blue-400 to-purple-500">
                          {total}/100
                       </span>
                    </div>
                 </div>
                 <Button onClick={handlePublish} disabled={loading} className="w-full h-14 rounded-2xl gap-2 text-sm font-bold italic shadow-2xl shadow-purple-600/20">
                    <Award className="h-5 w-5" />
                    Publish to Leaderboard
                 </Button>
              </div>
           </div>
        </div>
      </Card>
    </div>
  );
}


