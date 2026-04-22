import EventForm from "@/components/EventForm";

export default function CreateEventPage() {
  return (
    <div className="container" style={{ maxWidth: "800px" }}>
      <div className="mb-8">
        <h1>Create New Event</h1>
        <p className="text-muted">Fill in the details to generate a unique QR code.</p>
      </div>
      
      <EventForm />
    </div>
  );
}
