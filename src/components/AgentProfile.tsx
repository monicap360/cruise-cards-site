import Link from "next/link";
import { type Agent } from "@/lib/agents";
import AgentStatusBadge from "@/components/AgentStatusBadge";

const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();

// "Meet your agent" — bio, specialties, schedule, and a book-time button.
export default function AgentProfile({ agent }: { agent: Agent }) {
  return (
    <div className="rounded-2xl border border-sky-400/25 bg-[#0b1020] overflow-hidden">
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-sky-500/20 border border-sky-400/30 flex items-center justify-center font-extrabold text-sky-200 text-xl shrink-0">
            {initials(agent.name)}
          </div>
          <div className="min-w-0">
            <div className="label-mono text-[10px] uppercase tracking-wider text-sky-400/70">Your Cruise Director of Sales</div>
            <div className="font-extrabold text-white text-xl">{agent.name}</div>
            <div className="text-sky-300/90 text-sm">{agent.tagline}</div>
            <div className="mt-2"><AgentStatusBadge slug={agent.slug} offDays={agent.offDays} /></div>
          </div>
        </div>

        <p className="text-white/65 text-sm mt-4 leading-relaxed">{agent.bio}</p>

        <div className="flex flex-wrap gap-1.5 mt-4">
          {agent.specialties.map((s) => (
            <span key={s} className="text-[11px] font-semibold bg-sky-400/10 text-sky-200/90 border border-sky-400/20 rounded-full px-2.5 py-1">{s}</span>
          ))}
        </div>
      </div>

      {/* Schedule */}
      <div className="border-t border-white/10 p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <div className="label-mono text-[10px] uppercase tracking-wider text-sky-400/70 mb-2">📅 My schedule</div>
          <div className="space-y-1">
            {agent.schedule.map((s) => (
              <div key={s.day} className="flex justify-between text-sm">
                <span className="text-white/70 font-semibold">{s.day}</span>
                <span className="text-white/50">{s.hours}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center gap-2">
          <Link href={agent.bookingUrl} className="bg-white text-black hover:bg-white/90 font-semibold uppercase tracking-wider text-xs px-5 py-3 rounded-full text-center transition-all">
            📞 Book time with {agent.name}
          </Link>
          <div className="text-white/45 text-xs text-center">
            or call <a href={`tel:${agent.phone.replace(/[^0-9+]/g, "")}`} className="text-sky-300 hover:text-sky-200">{agent.phone}</a>
          </div>
        </div>
      </div>
    </div>
  );
}
