"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Settings as SettingsIcon, Save, ShieldAlert, Database } from "lucide-react";
import { toast } from "react-hot-toast";

export default function GlobalSettings() {
  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold italic tracking-tighter">Global Settings</h2>
          <p className="text-white/40 text-sm">Configure core platform behavior and security rules.</p>
        </div>
        <Button onClick={handleSave} className="gap-2 h-12 px-6 rounded-2xl shadow-xl font-bold italic">
          <Save className="h-5 w-5" />
          Save Configuration
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="p-8 space-y-6">
          <div className="flex items-center gap-3 mb-4">
             <SettingsIcon className="h-6 w-6 text-blue-400" />
             <h3 className="text-xl font-bold italic">General Configuration</h3>
          </div>
          
          <div>
             <label className="text-xs font-bold text-white/40 uppercase tracking-widest block mb-2">Platform Name</label>
             <Input defaultValue="HireReady" className="bg-white/5" />
          </div>
          <div>
             <label className="text-xs font-bold text-white/40 uppercase tracking-widest block mb-2">Support Email</label>
             <Input defaultValue="admin@hireready.com" className="bg-white/5" />
          </div>
          
          <div className="pt-6 border-t border-white/5 space-y-4">
             <div className="flex items-center justify-between">
                <div>
                   <h4 className="font-bold text-sm">Maintenance Mode</h4>
                   <p className="text-xs text-white/40">Disable public access temporarily.</p>
                </div>
                <div className="h-6 w-12 rounded-full bg-white/10 relative cursor-pointer">
                   <div className="h-5 w-5 rounded-full bg-white/40 absolute top-0.5 left-0.5 transition-all" />
                </div>
             </div>
          </div>
        </Card>

        <Card className="p-8 space-y-6 border-red-500/20 bg-gradient-to-tr from-red-500/5 to-transparent">
          <div className="flex items-center gap-3 mb-4">
             <ShieldAlert className="h-6 w-6 text-red-400" />
             <h3 className="text-xl font-bold italic text-red-100">Danger Zone</h3>
          </div>
          <p className="text-sm text-white/60">Operations here affect the entire database and cannot be undone easily.</p>
          
          <div className="space-y-4 pt-4 border-t border-red-500/10">
             <Button variant="ghost" className="w-full justify-between h-12 text-red-400 hover:bg-red-500/10 border border-red-500/20">
                Purge Inactive Users
                <Database className="h-4 w-4" />
             </Button>
             <Button variant="ghost" className="w-full justify-between h-12 text-red-500 hover:bg-red-600/20 hover:text-red-400 border border-red-500/20 font-bold">
                WIPE ALL LEADS (Hard Reset)
                <ShieldAlert className="h-4 w-4" />
             </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
