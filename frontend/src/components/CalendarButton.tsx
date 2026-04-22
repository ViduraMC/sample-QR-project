"use client";

import { createEvent, EventAttributes } from "ics";
import { EventResponse } from "@/lib/api";

export default function CalendarButton({ event }: { event: EventResponse }) {
  const handleDownloadIcs = () => {
    const d = new Date(event.dateTime);
    
    // ics expects [YYYY, MM, DD, HH, MM]
    const start: [number, number, number, number, number] = [
      d.getFullYear(),
      d.getMonth() + 1, // ics months are 1-indexed
      d.getDate(),
      d.getHours(),
      d.getMinutes(),
    ];

    const icsEvent: EventAttributes = {
      start,
      duration: { hours: 2, minutes: 0 }, // Assuming 2 hours for now
      title: event.title,
      description: event.description,
      location: event.location,
      status: "CONFIRMED",
      organizer: { name: event.organizer, email: "hello@event.com" },
    };

    createEvent(icsEvent, (error, value) => {
      if (error) {
        console.error(error);
        alert("Failed to generate calendar file.");
        return;
      }

      // Create a Blob and trigger download
      const blob = new Blob([value], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${event.title.replace(/\s+/g, "_")}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const handleGoogleCalendar = () => {
    const start = new Date(event.dateTime);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // Assume 2 hour duration

    const formatGoogleDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    };

    const googleUrl = new URL("https://calendar.google.com/calendar/render");
    googleUrl.searchParams.append("action", "TEMPLATE");
    googleUrl.searchParams.append("text", event.title);
    googleUrl.searchParams.append("dates", `${formatGoogleDate(start)}/${formatGoogleDate(end)}`);
    if (event.description) googleUrl.searchParams.append("details", event.description);
    if (event.location) googleUrl.searchParams.append("location", event.location);

    window.open(googleUrl.toString(), "_blank");
  };

  return (
    <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-white/10">
      <h3 className="text-center text-sm uppercase tracking-wider text-muted mb-2">Add to Calendar</h3>
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={handleGoogleCalendar} 
          className="btn flex flex-col justify-center items-center gap-1 p-3"
          style={{ background: 'rgba(66, 133, 244, 0.15)', border: '1px solid #4285F4', color: '#fff' }}
        >
          <span className="text-2xl mb-1">G</span> 
          <span className="text-xs">Google</span>
        </button>
        <button 
          onClick={handleDownloadIcs} 
          className="btn btn-secondary flex flex-col justify-center items-center gap-1 p-3"
        >
          <span className="text-2xl mb-1">📅</span> 
          <span className="text-xs">Apple / Outlook</span>
        </button>
      </div>
    </div>
  );
}
