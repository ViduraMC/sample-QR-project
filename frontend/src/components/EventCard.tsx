"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { eventsApi, EventResponse } from "@/lib/api";
import { useState, useEffect } from "react";
import QRCode from "qrcode";

interface EventCardProps {
  event: EventResponse;
}

export default function EventCard({ event }: EventCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [qrSrc, setQrSrc] = useState<string>("");

  useEffect(() => {
    if (!event.qrHash || !event.signature) return;
    
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const scanUrl = `${baseUrl}/scan/${event.qrHash}?sig=${event.signature}`;

    QRCode.toDataURL(scanUrl, {
      width: 150,
      margin: 1,
      color: {
        dark: "#8b5cf6",
        light: "#ffffff",
      },
    })
      .then((url) => setQrSrc(url))
      .catch((err) => console.error(err));
  }, [event]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    
    setIsDeleting(true);
    try {
      await eventsApi.delete(event.id);
      router.refresh(); // Refresh the server component to pull updated list
    } catch (err) {
      console.error(err);
      alert("Failed to delete event.");
      setIsDeleting(false);
    }
  };

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

        {qrSrc && (
          <div className="flex justify-center mb-6">
            <div className="bg-white p-2 rounded-lg shadow-md">
              <img src={qrSrc} alt={`QR Code for ${event.title}`} width={120} height={120} />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 mt-auto">
        <div className="flex gap-2">
          <Link href={`/events/${event.id}`} className="btn btn-secondary w-full text-center">
            Edit
          </Link>
          <button 
            onClick={handleDelete} 
            disabled={isDeleting}
            className="btn btn-danger w-full"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
