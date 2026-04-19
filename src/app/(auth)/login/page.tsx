"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
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

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { signInWithGoogle, user, isConfigured } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    if (!isConfigured || !auth) {
      toast.error("Authentication setup pending. Check Firebase configuration.");
      return;
    }

    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast.success("Logged in successfully!");
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.code === "auth/configuration-not-found") {
        toast.error("Firebase Authentication not configured yet. Check Firebase Console.");
      } else {
        toast.error(error.message || "Failed to login");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isConfigured) {
      toast.error("Authentication setup pending. Check Firebase configuration.");
      return;
    }

    try {
      await signInWithGoogle();
      toast.success("Logged in with Google!");
    } catch (error: any) {
      console.error("Google login error:", error);
      // AuthContext handles most error messaging now
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
          title="Welcome Back"
          description={isConfigured ? "Login to access your hackathons and dashboard." : "Authentication setup pending."}
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

            <Button type="submit" className="w-full" disabled={isSubmitting || !isConfigured}>
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#111] px-2 text-white/50">Or continue with</span>
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
            Don't have an account?{" "}
            <Link href="/register" className="text-white hover:underline">
              Register here
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
