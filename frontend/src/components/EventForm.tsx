"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { eventsApi } from "@/lib/api";

interface EventFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export default function EventForm({ initialData, isEdit = false }: EventFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    dateTime: initialData?.dateTime ? formatDateTime(initialData.dateTime) : "",
    location: initialData?.location || "",
    organizer: initialData?.organizer || "",
    category: initialData?.category || "",
    ticketPrice: initialData?.ticketPrice?.toString() || "0",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        ticketPrice: parseFloat(formData.ticketPrice),
        dateTime: new Date(formData.dateTime).toISOString(),
      };

      if (isEdit && initialData?.id) {
        await eventsApi.update(initialData.id, payload);
      } else {
        await eventsApi.create(payload);
      }
      router.push("/events");
      router.refresh(); // Refresh Next.js cache
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card">
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-sm">
          {Array.isArray(error) ? (
            <ul className="list-disc pl-5">
              {error.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          ) : (
            <p>{error}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1-2 gap-4">
        <div className="form-group">
          <label className="form-label">Category</label>
          <input
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-control"
            placeholder="e.g. Conference"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-control"
            placeholder="Event Title"
            required
            minLength={3}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="form-control"
          rows={3}
          placeholder="Brief description of the event..."
          required
          minLength={10}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label">Date & Time</label>
          <input
            type="datetime-local"
            name="dateTime"
            value={formData.dateTime}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Ticket Price ($)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            name="ticketPrice"
            value={formData.ticketPrice}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label">Location (Venue)</label>
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="form-control"
            placeholder="Event location"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Organizer Name</label>
          <input
            name="organizer"
            value={formData.organizer}
            onChange={handleChange}
            className="form-control"
            placeholder="Organizer"
            required
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn btn-secondary"
          disabled={loading}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Update Event" : "Create Event"}
        </button>
      </div>
    </form>
  );
}
