export const dynamic = "force-dynamic";

import { eventsApi } from "@/lib/api";
import EventForm from "@/components/EventForm";
import Link from "next/link";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);
  let event = null;
  let error = null;

  try {
    event = await eventsApi.getById(id);
  } catch (err: any) {
    error = err.message || "Failed to load event";
  }

  if (error || !event) {
    return (
      <div className="container text-center py-16">
        <h2 className="text-danger mb-4">Event Not Found</h2>
        <Link href="/events" className="btn btn-secondary">Back to Events</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: "800px" }}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1>Edit Event</h1>
          <p className="text-muted">ID: {id}</p>
        </div>
        <Link href={`/events/${id}/qr`} className="btn btn-primary">
          View QR 🔗
        </Link>
      </div>
      
      <EventForm initialData={event} isEdit={true} />
    </div>
  );
}
