import { CalendarDays, Globe, Trophy } from "lucide-react";
import { hackathons } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata = {
  title: "Hackathons",
};

export default function HackathonsPage() {
  return (
    <div className="hr-container pt-14 sm:pt-18">
      <SectionHeading
        eyebrow="Hackathons"
        title="Upcoming competitions"
        description="Register for upcoming events or sponsor a track. Real challenges, real signal."
      />

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {hackathons.map((h) => (
          <Card key={h.title} className="p-6 flex flex-col">
            <div className="text-sm font-semibold text-white">{h.title}</div>
            <div className="mt-4 space-y-2 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-white/60" />
                <span>{h.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-white/60" />
                <span>{h.mode}</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-white/60" />
                <span>Prize: {h.prize}</span>
              </div>
            </div>

            <div className="mt-6 flex-1" />
            <ButtonLink href="/contact" size="lg" className="w-full justify-center">
              Register
            </ButtonLink>
          </Card>
        ))}
      </div>

      <div className="mt-14 rounded-3xl border border-white/10 bg-gradient-to-r from-white/6 via-white/4 to-white/6 p-8 sm:p-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-semibold text-white/80">
              Hosting with HireReady
            </div>
            <div className="mt-2 text-2xl font-semibold text-white">
              Want HireReady on your campus?
            </div>
            <div className="mt-2 text-sm text-[color:var(--color-muted)]">
              We’ll design the format, run execution, and bring hiring partners.
            </div>
          </div>
          <ButtonLink href="/contact" variant="secondary" size="lg">
            Host a Hackathon
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

