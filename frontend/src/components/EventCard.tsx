import Link from "next/link";
import { EventResponse } from "@/lib/api";

interface EventCardProps {
  event: EventResponse;
}

export default function EventCard({ event }: EventCardProps) {
  const date = new Date(event.dateTime).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="glass-card flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold px-2 py-1 bg-[#1e293b] rounded text-primary">
            {event.category}
          </span>
          <span className="text-sm font-medium text-success">
            ${Number(event.ticketPrice).toFixed(2)}
          </span>
        </div>
        
        <h3 className="mb-1">{event.title}</h3>
        <p className="text-muted text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="text-sm text-muted mb-6 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            📅 <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            📍 <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            👤 <span>{event.organizer}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-auto">
        <Link href={`/events/${event.id}`} className="btn btn-secondary w-full text-center">
          View / Edit
        </Link>
        <Link href={`/events/${event.id}/qr`} className="btn btn-primary w-full text-center">
          Generate QR 🔗
        </Link>
      </div>
    </div>
  );
}
