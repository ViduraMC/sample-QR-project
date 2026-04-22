"use client";

import { createEvent, EventAttributes } from "ics";
import { EventResponse } from "@/lib/api";

export default function CalendarButton({ event }: { event: EventResponse }) {
  const handleDownload = () => {
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

  return (
    <button onClick={handleDownload} className="btn btn-primary w-full mt-4 flex justify-center items-center gap-2">
      <span className="text-xl">📅</span> Add to Calendar
    </button>
  );
}
