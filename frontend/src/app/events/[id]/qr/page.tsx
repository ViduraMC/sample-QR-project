export const dynamic = "force-dynamic";

import { eventsApi } from "@/lib/api";
import QRCodeDisplay from "@/components/QRCodeDisplay";
import Link from "next/link";

export default async function QRPage({ params }: { params: Promise<{ id: string }> }) {
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
    <div className="container" style={{ maxWidth: "600px" }}>
      <div className="mb-6 flex justify-between items-center">
        <Link href={`/events/${id}`} className="text-muted hover:text-white transition-colors">
          ← Back to Event
        </Link>
      </div>
      
      <QRCodeDisplay 
        qrHash={event.qrHash!} 
        signature={event.signature!} 
        title={event.title} 
      />
    </div>
  );
}
