export const dynamic = "force-dynamic";

import { eventsApi } from "@/lib/api";
import Link from "next/link";
import CalendarButton from "@/components/CalendarButton";

export default async function ScanPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ hash: string }>,
  searchParams: Promise<{ sig: string }>
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const hash = resolvedParams.hash;
  const signature = resolvedSearchParams.sig;
  
  let event = null;
  let error = null;

  if (!signature) {
    error = "Invalid QR code signature";
  } else {
    try {
      event = await eventsApi.getByHash(hash, signature);
    } catch (err: any) {
      error = err.response?.data?.message || "Invalid or tampered QR code";
    }
  }

  if (error || !event) {
    return (
      <div className="container flex flex-col items-center justify-center min-vh-100 py-20 text-center">
        <div className="glass-card max-w-md p-8 border-danger">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-danger mb-2">Scan Failed</h2>
          <p className="text-muted mb-6">{error}</p>
          <Link href="/events" className="btn btn-secondary w-full">
            Go to Platform
          </Link>
        </div>
      </div>
    );
  }

  const date = new Date(event.dateTime).toLocaleString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="container" style={{ maxWidth: "600px", padding: "1rem" }}>
      <div className="glass-card overflow-hidden !p-0">
        <div className="bg-gradient-to-r from-primary to-secondary p-8 text-white text-center">
          <span className="inline-block px-3 py-1 bg-black/20 rounded-full text-sm font-semibold mb-3">
            {event.category}
          </span>
          <h1 className="mb-0 text-3xl">{event.title}</h1>
        </div>
        
        <div className="p-8">
          <div className="mb-8">
            <h3 className="text-muted text-sm uppercase tracking-wider mb-2">About Event</h3>
            <p className="leading-relaxed">{event.description}</p>
          </div>

          <div className="flex flex-col gap-4 mb-8">
            <div className="flex bg-[#1e293b] p-4 rounded-lg items-start gap-4 border border-white/5">
              <div className="text-2xl mt-1">📅</div>
              <div>
                <p className="text-sm text-muted mb-1">Date & Time</p>
                <p className="font-semibold">{date}</p>
              </div>
            </div>

            <div className="flex bg-[#1e293b] p-4 rounded-lg items-start gap-4 border border-white/5">
              <div className="text-2xl mt-1">📍</div>
              <div>
                <p className="text-sm text-muted mb-1">Location</p>
                <p className="font-semibold">{event.location}</p>
              </div>
            </div>

            <div className="flex justify-between items-center bg-[#1e293b] p-4 rounded-lg border border-white/5">
              <div className="flex gap-4 items-center">
                <div className="text-2xl mt-1">🎟️</div>
                <div>
                  <p className="text-sm text-muted mb-1">Ticket Price</p>
                  <p className="font-semibold">
                    {Number(event.ticketPrice) > 0 
                      ? `$${Number(event.ticketPrice).toFixed(2)}` 
                      : "Free"}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex bg-[#1e293b] p-4 rounded-lg items-center gap-4 border border-white/5">
              <div className="text-2xl mt-1">👤</div>
              <div>
                <p className="text-sm text-muted mb-1">Organizer</p>
                <p className="font-semibold">{event.organizer}</p>
              </div>
            </div>
          </div>

          <CalendarButton event={event} />
        </div>
      </div>
    </div>
  );
}
