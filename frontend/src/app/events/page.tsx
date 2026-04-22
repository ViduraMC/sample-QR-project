export const dynamic = "force-dynamic";

import { eventsApi } from "@/lib/api";
import EventCard from "@/components/EventCard";
import Link from "next/link";

export default async function EventsPage() {
  let events: any[] = [];
  try {
    events = await eventsApi.getAll();
  } catch (error) {
    console.error("Failed to fetch events:", error);
  }

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1>Events Dashboard</h1>
          <p className="text-muted">Manage your events and generate QR codes.</p>
        </div>
        <Link href="/events/create" className="btn btn-primary pl-8 pr-8 pb-3 pt-3">
          + New Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="glass-card text-center py-16">
          <h2 className="text-muted mb-4">No events found</h2>
          <Link href="/events/create" className="btn btn-secondary">
            Create your first event
          </Link>
        </div>
      ) : (
        <div className="event-grid">
          {events.map((event: any) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
