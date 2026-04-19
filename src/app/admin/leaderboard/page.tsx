"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Trophy, Medal, Star, ShieldCheck, Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { toast } from "react-hot-toast";

interface ScoreEntry {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  hackathonTitle: string;
  score: number;
  isPublished?: boolean;
}

export default function LeaderboardAdmin() {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      const q = query(collection(db, "scores"), orderBy("score", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ScoreEntry[];
      setScores(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load scores");
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (id: string, current: boolean) => {
    try {
      await updateDoc(doc(db, "scores", id), {
        isPublished: !current
      });
      setScores(scores.map(s => s.id === id ? { ...s, isPublished: !current } : s));
      toast.success(current ? "Score hidden" : "Score published globally");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const publishAll = async () => {
    if (!confirm("Publish all scores to the global leaderboard?")) return;
    try {
      await Promise.all(
        scores.filter(s => !s.isPublished).map(s => 
          updateDoc(doc(db, "scores", s.id), { isPublished: true })
        )
      );
      setScores(scores.map(s => ({ ...s, isPublished: true })));
      toast.success("All scores published");
    } catch (error) {
      toast.error("Failed to publish all");
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold italic tracking-tighter">Leaderboard Control</h2>
          <p className="text-white/40 text-sm">Manage global rankings and verify score publications.</p>
        </div>
        <Button onClick={publishAll} className="gap-2 h-12 px-6 rounded-2xl font-bold italic shadow-xl shadow-purple-600/10">
          <ShieldCheck className="h-5 w-5" />
          Publish All Pending
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <Input className="pl-12 h-12 rounded-2xl bg-white/5 border-white/5" placeholder="Search talent..." />
        </div>
      </div>

      <Card className="p-0 overflow-hidden bg-white/[0.01] border-white/5">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-white/40">
               <th className="px-6 py-4">Rank</th>
               <th className="px-6 py-4">Participant</th>
               <th className="px-6 py-4">Track</th>
               <th className="px-6 py-4 text-center">Score</th>
               <th className="px-6 py-4">Visibility</th>
               <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
             {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-white/40">Loading rankings...</td></tr>
             ) : scores.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-white/40">No scores recorded yet.</td></tr>
             ) : scores.map((score, idx) => (
                <tr key={score.id} className="hover:bg-white/[0.02]">
                   <td className="px-6 py-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 font-black italic text-white/60">
                         {idx + 1}
                      </div>
                   </td>
                   <td className="px-6 py-4 font-bold">{score.userName}</td>
                   <td className="px-6 py-4 text-sm text-white/60">{score.hackathonTitle}</td>
                   <td className="px-6 py-4 text-center">
                      <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-blue-400 to-purple-500">
                         {score.score}
                      </span>
                   </td>
                   <td className="px-6 py-4">
                      <Badge variant={score.isPublished ? "success" : "secondary"}>
                         {score.isPublished ? "PUBLISHED" : "PENDING"}
                      </Badge>
                   </td>
                   <td className="px-6 py-4 text-right">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => togglePublish(score.id, !!score.isPublished)}
                        className={`text-xs font-bold ${score.isPublished ? "text-orange-400 hover:text-orange-300" : "text-green-400 hover:text-green-300"}`}
                      >
                         {score.isPublished ? "Hide" : "Publish"}
                      </Button>
                   </td>
                </tr>
             ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
