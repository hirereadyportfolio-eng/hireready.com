"use client";

import React, { useState } from "react";
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { toast } from "react-hot-toast";
import { Shield, Server, AlertTriangle } from "lucide-react";

export default function SecurityTest() {
  const [logs, setLogs] = useState<{ time: string; msg: string; type: "success" | "error" | "info" }[]>([]);

  const addLog = (msg: string, type: "success" | "error" | "info") => {
    setLogs(prev => [{ time: new Date().toLocaleTimeString(), msg, type }, ...prev]);
    if (type === "success") toast.success(msg);
    if (type === "error") toast.error(msg);
  };

  const handleError = (action: string, error: any) => {
    if (error.code === "permission-denied") {
      addLog(`[DENIED] Security rule successfully blocked: ${action}`, "success");
    } else {
      addLog(`[ERROR] ${action}: ${error.message}`, "error");
    }
  };

  const testReadLeads = async () => {
    addLog("Attempting to read CRM leads...", "info");
    try {
      await getDocs(collection(db, "leads"));
      addLog("[VULNERABLE] Successfully read leads. Are you an Admin?", "error");
    } catch (e: any) {
      handleError("Read Leads", e);
    }
  };

  const testWriteHackathon = async () => {
    addLog("Attempting to create hackathon...", "info");
    try {
      await addDoc(collection(db, "hackathons"), { title: "Malicious Entry" });
      addLog("[VULNERABLE] Successfully created hackathon. Are you an Admin?", "error");
    } catch (e: any) {
      handleError("Create Hackathon", e);
    }
  };

  const testWriteSelfProfile = async () => {
    addLog("Attempting to update own profile...", "info");
    if (!auth.currentUser) return addLog("Please login first", "error");
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), { lastTest: Date.now() });
      addLog("Successfully updated own profile (Expected)", "success");
    } catch (e: any) {
      handleError("Update Profile", e);
    }
  };

  const testSelfPromoteAdmin = async () => {
    addLog("Attempting elevation of privilege (role: admin)...", "info");
    if (!auth.currentUser) return addLog("Please login first", "error");
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), { role: "admin" });
      addLog("[VULNERABLE] Successfully self-promoted to Admin! Rule not working.", "error");
    } catch (e: any) {
      handleError("Self Promote", e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8 min-h-screen pt-24 text-white">
      <div className="flex items-center gap-4">
        <Shield className="h-8 w-8 text-blue-400" />
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter">Security Posture Testing</h1>
          <p className="text-white/40">Verify Firestore Rule deployments live.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
         <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/30 border-b border-white/10 pb-2">Attack Scenarios</h3>
            <Button onClick={testReadLeads} variant="secondary" className="w-full justify-start border-white/5 bg-white/[0.02]">
               <Server className="h-4 w-4 mr-3" /> 1. Read CRM Data (Admin Only)
            </Button>
            <Button onClick={testWriteHackathon} variant="secondary" className="w-full justify-start border-white/5 bg-white/[0.02]">
               <Server className="h-4 w-4 mr-3" /> 2. Write Database Root (Admin Only)
            </Button>
            <Button onClick={testSelfPromoteAdmin} variant="secondary" className="w-full justify-start border-red-500/10 text-red-400 bg-red-500/5 hover:bg-red-500/10 hover:text-red-300">
               <AlertTriangle className="h-4 w-4 mr-3" /> 3. Privilege Escalation via Update
            </Button>
            <Button onClick={testWriteSelfProfile} variant="secondary" className="w-full justify-start border-green-500/10 text-green-400 bg-green-500/5 hover:bg-green-500/10 hover:text-green-300">
               <Server className="h-4 w-4 mr-3" /> 4. Standard Profile Update (Should Pass)
            </Button>
         </div>

         <Card className="p-0 border-white/5 bg-black/50 overflow-hidden flex flex-col h-96">
            <div className="bg-white/5 p-4 text-xs font-bold uppercase tracking-widest text-white/40 border-b border-white/5">
               Terminal Output
            </div>
            <div className="p-4 space-y-2 overflow-y-auto flex-1 font-mono text-[10px]">
               {logs.length === 0 && <div className="text-white/20 italic">Awaiting transmission...</div>}
               {logs.map((log, i) => (
                  <div key={i} className={`flex gap-3 leading-relaxed ${
                    log.type === "error" ? "text-red-400" : log.type === "success" ? "text-green-400" : "text-blue-400"
                  }`}>
                     <span className="opacity-50 min-w-16 whitespace-nowrap">{log.time}</span>
                     <span>{log.msg}</span>
                  </div>
               ))}
            </div>
         </Card>
      </div>
    </div>
  );
}
