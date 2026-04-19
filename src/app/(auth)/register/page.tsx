"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Chrome as Google } from "lucide-react";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { signInWithGoogle, user, isConfigured } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });


  const onSubmit = async (data: RegisterFormValues) => {
    if (!isConfigured || !auth || !db) {
      toast.error("Authentication setup pending. Check Firebase configuration.");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage("Creating account...");
    
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      
      const firebaseUser = userCredential.user;
      
      // Update profile in Auth
      setStatusMessage("Setting up profile...");
      await updateProfile(firebaseUser, {
        displayName: data.name
      });
      
      // Create firestore doc with small retry logic
      let profileCreated = false;
      let retries = 3;
      
      while (!profileCreated && retries > 0) {
        try {
          setStatusMessage("Finalizing profile setup...");
          await setDoc(doc(db, "users", firebaseUser.uid), {
            uid: firebaseUser.uid,
            name: data.name,
            email: data.email,
            role: "user",
            createdAt: new Date().toISOString()
          });
          profileCreated = true;
        } catch (dbError: any) {
          console.warn("Retrying profile creation...", dbError);
          retries--;
          if (retries === 0) throw dbError;
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      toast.success("Account created successfully!");
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.code === "auth/configuration-not-found") {
        toast.error("Firebase Authentication not configured yet.");
      } else if (error.message?.includes("client is offline")) {
        toast.error("Database connection failed. Are you online? Account was created but profile may be missing.");
      } else {
        toast.error(error.message || "Failed to register");
      }
    } finally {
      setIsSubmitting(false);
      setStatusMessage(null);
    }
  };


  const handleGoogleSignIn = async () => {
    if (!isConfigured) {
      toast.error("Authentication setup pending. Check Firebase configuration.");
      return;
    }

    try {
      await signInWithGoogle();
      toast.success("Signed in with Google!");
    } catch (error: any) {
      console.error("Google registration error:", error);
    }
  };

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  }, [user, router]);

  return (
    <div className="hr-container flex flex-col items-center justify-center pt-20 pb-12">
      <div className="w-full max-w-md">
        <SectionHeading
          title="Create Account"
          description={isConfigured ? "Join HireReady to participate in world-class hackathons." : "Authentication setup pending."}
          className="text-center mb-8"
        />

        <Card className="p-8">
          {!isConfigured && (
            <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-sm">
              <p className="font-semibold mb-1">Setup Required</p>
              <p>Firebase Authentication is not yet configured. Please check your environment variables (.env.local).</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Full Name</label>
              <Input
                placeholder="John Doe"
                {...register("name")}
                disabled={!isConfigured}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                disabled={!isConfigured}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                {...register("password")}
                disabled={!isConfigured}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Confirm Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                {...register("confirmPassword")}
                disabled={!isConfigured}
                className={errors.confirmPassword ? "border-red-500" : ""}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting || !isConfigured}>
              {isSubmitting ? "Processing..." : "Register"}
            </Button>
            
            {statusMessage && (
              <p className="mt-2 text-center text-xs text-amber-200/80 animate-pulse">
                {statusMessage}
              </p>
            )}
          </form>


          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#111] px-2 text-white/50">Or register with</span>
            </div>
          </div>

          <Button
            variant="secondary"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleGoogleSignIn}
            disabled={!isConfigured}
          >
            <Google className="h-4 w-4" />
            Google
          </Button>


          <p className="mt-6 text-center text-sm text-[color:var(--color-muted)]">
            Already have an account?{" "}
            <Link href="/login" className="text-white hover:underline">
              Login here
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
