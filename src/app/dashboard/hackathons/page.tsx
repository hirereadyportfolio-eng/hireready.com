"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, setDoc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  Calendar, 
  Trophy, 
  Rocket, 
  CheckCircle2,
  Users,
  Search
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/Input";

interface Hackathon {
  id: string;
  title: string;
  description: string;
  prize: string;
  startDate: string;
  endDate: string;
  status: string;
  registrations: number;
}

export default function JoinHackathons() {
  const { user } = useAuth();
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [registeredIds, setRegisteredIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch all hackathons
      const querySnapshot = await getDocs(collection(db, "hackathons"));
      const hacks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Hackathon[];
      setHackathons(hacks);

      // Fetch user's registrations
      if (user) {
        const regSnap = await getDocs(collection(db, "users", user.uid, "registrations"));
        setRegisteredIds(regSnap.docs.map(doc => doc.id));
      }
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (hack: Hackathon) => {
    if (!user) return;
    try {
      // Add to user's registrations subcollection
      await setDoc(doc(db, "users", user.uid, "registrations", hack.id), {
        hackathonId: hack.id,
        hackathonTitle: hack.title,
        registeredAt: new Date().toISOString()
      });

      // Add to global registrations collection
      await setDoc(doc(db, "registrations", `${user.uid}_${hack.id}`), {
        userId: user.uid,
        userName: user.displayName,
        userEmail: user.email,
        hackathonId: hack.id,
        hackathonTitle: hack.title,
        status: "registered",
        registeredAt: new Date().toISOString()
      });

      // Update hackathon registration count
      await updateDoc(doc(db, "hackathons", hack.id), {
        registrations: increment(1)
      });

      setRegisteredIds([...registeredIds, hack.id]);
      toast.success(`Registered for ${hack.title}!`);
    } catch (error) {
      toast.error("Registration failed");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Available Hackathons</h2>
        <p className="text-white/60">Discover and join the best competitions to build your career.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        <Input className="pl-10" placeholder="Search by title, technology or company..." />
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map(i => (
            <div key={i} className="h-64 animate-pulse rounded-3xl bg-white/5 border border-white/10" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {hackathons.map((h) => (
            <Card key={h.id} className="relative overflow-hidden p-0 border-white/10">
              <div className="h-32 bg-gradient-to-br from-blue-600/30 via-purple-600/20 to-transparent p-6 flex items-end">
                 <h3 className="text-2xl font-bold text-white">{h.title}</h3>
              </div>
              
              <div className="p-6">
                <p className="text-white/70 line-clamp-3 mb-6">
                  {h.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-500/10 p-2 text-blue-400">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-white/40 font-bold">Starts</p>
                      <p className="text-sm">{h.startDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-purple-500/10 p-2 text-purple-400">
                      <Trophy className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-white/40 font-bold">Prize</p>
                      <p className="text-sm font-semibold">{h.prize}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-6">
                   <div className="flex items-center gap-2 text-white/50 text-sm">
                      <Users className="h-4 w-4" />
                      <span>{h.registrations || 0} participants</span>
                   </div>
                   
                   {registeredIds.includes(h.id) ? (
                     <div className="flex items-center gap-2 text-green-400 font-medium">
                        <CheckCircle2 className="h-5 w-5" />
                        Registered
                     </div>
                   ) : (
                     <Button onClick={() => handleRegister(h)} className="gap-2">
                       <Rocket className="h-4 w-4" />
                       Register Now
                     </Button>
                   )}
                </div>
              </div>
            </Card>
          ))}
          
          {hackathons.length === 0 && (
             <div className="col-span-2 text-center py-20">
                <p className="text-white/40">No hackathons available at the moment. Check back later!</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
}
