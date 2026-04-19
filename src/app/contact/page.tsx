"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { contactSchema, type ContactInput } from "@/lib/contact";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-white/90">{label}</span>
      {children}
      {error ? <span className="text-xs text-red-300">{error}</span> : null}
    </label>
  );
}

function SuccessModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.18 }}
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="p-7">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5">
                  <CheckCircle2 className="h-5 w-5 text-[color:var(--color-accent-3)]" />
                </div>
                <div>
                  <div className="text-base font-semibold text-white">
                    Message sent
                  </div>
                  <div className="mt-1 text-sm text-[color:var(--color-muted)]">
                    We’ll get back within 24–48 hours. If it’s urgent, add a note
                    and we’ll prioritize.
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button variant="secondary" onClick={onClose}>
                  Close
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default function ContactPage() {
  const [successOpen, setSuccessOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      role: "Student",
    },
  });

  const onSubmit = async (values: ContactInput) => {
    // Basic rate limit check
    const lastSubmit = localStorage.getItem("last_contact_submit");
    if (lastSubmit && Date.now() - parseInt(lastSubmit) < 60000) {
      setSubmitError("Please wait a minute before sending another message.");
      return;
    }

    setSubmitError(null);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      setSubmitError("Something went wrong. Please try again in a moment.");
      return;
    }

    localStorage.setItem("last_contact_submit", Date.now().toString());
    reset();
    setSuccessOpen(true);
  };


  return (
    <div className="hr-container pt-14 sm:pt-18">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="Contact"
            title="Let’s build your next hiring-grade hackathon"
            description="Tell us who you are and what you want to achieve. We’ll reply with a clear plan and timeline."
          />

          <div className="mt-8 hr-glass rounded-2xl p-6">
            <div className="text-sm font-semibold text-white">
              What we’ll send back
            </div>
            <div className="mt-3 space-y-2 text-sm text-white/80">
              <div>• Suggested format (online/offline/hybrid)</div>
              <div>• Timeline and execution checklist</div>
              <div>• Optional recruiter + sponsor plan</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <Card className="p-7 sm:p-8">
            <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Name" error={errors.name?.message}>
                  <input
                    className={cn(
                      "h-11 rounded-2xl border px-4 bg-white/5 border-white/10 text-white placeholder:text-white/40 outline-none",
                      "focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)]"
                    )}
                    placeholder="Your full name"
                    {...register("name")}
                  />
                </Field>

                <Field label="Email" error={errors.email?.message}>
                  <input
                    className={cn(
                      "h-11 rounded-2xl border px-4 bg-white/5 border-white/10 text-white placeholder:text-white/40 outline-none",
                      "focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)]"
                    )}
                    placeholder="you@company.com"
                    {...register("email")}
                  />
                </Field>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Organization" error={errors.organization?.message}>
                  <input
                    className={cn(
                      "h-11 rounded-2xl border px-4 bg-white/5 border-white/10 text-white placeholder:text-white/40 outline-none",
                      "focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)]"
                    )}
                    placeholder="College / Company / Team"
                    {...register("organization")}
                  />
                </Field>

                <Field label="Role" error={errors.role?.message}>
                  <select
                    className={cn(
                      "h-11 rounded-2xl border px-4 bg-white/5 border-white/10 text-white outline-none",
                      "focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)]"
                    )}
                    {...register("role")}
                  >
                    <option value="Student">Student</option>
                    <option value="College">College</option>
                    <option value="Company">Company</option>
                  </select>
                </Field>
              </div>

              <Field label="Message" error={errors.message?.message}>
                <textarea
                  className={cn(
                    "min-h-[140px] rounded-2xl border px-4 py-3 bg-white/5 border-white/10 text-white placeholder:text-white/40 outline-none",
                    "focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)]"
                  )}
                  placeholder="What are you trying to achieve? (e.g., host a campus hackathon, hire interns, sponsor a track...)"
                  {...register("message")}
                />
              </Field>

              {/* Honeypot field - hidden from users */}
              <div className="hidden" aria-hidden="true">
                <input {...register("website_url")} tabIndex={-1} autoComplete="off" />
              </div>


              {submitError ? (
                <div className="text-sm text-red-300">{submitError}</div>
              ) : null}

              <div className="flex items-center justify-between gap-3">
                <div className="text-xs text-white/60">
                  We’ll never share your info.
                </div>
                <Button type="submit" disabled={isSubmitting} className="min-w-40">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Sending
                    </>
                  ) : (
                    <>
                      Send <Send className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>

      <SuccessModal open={successOpen} onClose={() => setSuccessOpen(false)} />
    </div>
  );
}

