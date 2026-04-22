"use client";

import { useEffect, useState, useRef } from "react";
import QRCode from "qrcode";

interface QRCodeDisplayProps {
  qrHash: string;
  signature: string;
  title: string;
}

export default function QRCodeDisplay({ qrHash, signature, title }: QRCodeDisplayProps) {
  const [qrSrc, setQrSrc] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Generate the URL resolving to the frontend scan page
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const scanUrl = `${baseUrl}/scan/${qrHash}?sig=${signature}`;

    QRCode.toDataURL(scanUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: "#8b5cf6", // Violet 500
        light: "#ffffff",
      },
    })
      .then((url) => setQrSrc(url))
      .catch((err) => console.error(err));

    // Also draw to canvas for downloading if preferred
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, scanUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: "#8b5cf6",
          light: "#ffffff",
        },
      }).catch((err) => console.error(err));
    }
  }, [qrHash, signature]);

  const handleDownload = () => {
    if (!qrSrc) return;
    const link = document.createElement("a");
    link.href = qrSrc;
    link.download = `event-qr-${title.replace(/\s+/g, '-').toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 glass-card text-center">
      <h2 className="mb-2">Event QR Code</h2>
      <p className="text-muted mb-6 text-sm">
        Scan this QR code to view event details
      </p>

      <div className="bg-white p-4 rounded-xl mb-6 shadow-lg inline-block">
        {/* Render visible QR visually or use Canvas */}
        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
        {qrSrc ? (
          <img src={qrSrc} alt={`QR Code for ${title}`} width={300} height={300} />
        ) : (
          <div className="w-[300px] h-[300px] bg-gray-200 animate-pulse rounded-lg"></div>
        )}
      </div>

      <button onClick={handleDownload} className="btn btn-primary px-8 py-3 text-lg w-full max-w-xs">
        Download QR ↓
      </button>
    </div>
  );
}
