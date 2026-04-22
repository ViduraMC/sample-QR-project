import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="container flex justify-between items-center" style={{ padding: '0 1.5rem', height: '100%' }}>
        <Link href="/events" className="navbar-brand">
          EventQR Platform
        </Link>
        <div className="flex gap-4 items-center">
          <Link href="/events" className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem' }}>
            Browse Events
          </Link>
          <Link href="/events/create" className="btn btn-primary" style={{ padding: '0.4rem 0.8rem' }}>
            Create Event
          </Link>
        </div>
      </div>
    </nav>
  );
}
