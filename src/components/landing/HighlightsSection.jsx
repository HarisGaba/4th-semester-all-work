import { Link } from 'react-router-dom';
import { Compass, CalendarDays, ShieldCheck } from 'lucide-react';
export default function HighlightsSection() {
  return (
    <section className="bg-white px-0 py-10 text-center sm:py-12">
      <div className="mx-auto w-[min(1240px,calc(100%_-_3rem))]">
        <h2 className="text-xl font-normal uppercase tracking-wide">Our services</h2>
        <div aria-hidden="true" className="my-4 text-[#b5ac9b]">
          — ✦ —
        </div>
        <div className="mt-10 grid gap-2 md:grid-cols-3">
          {[
            [
              Compass,
              'Discover your next expo',
              'Browse and search a growing catalog of exhibitions by theme and location.',
            ],
            [
              CalendarDays,
              'A home for your events',
              'Organizer accounts can create and manage expo details in one place.',
            ],
            [
              ShieldCheck,
              'An account that is yours',
              'Role-based access, secure sessions, and email account recovery.',
            ],
          ].map(([Icon, title, copy], index) => (
            <article
              className="relative isolate flex min-h-80 lg:min-h-96 flex-col justify-end overflow-hidden bg-[#35372f] p-8 text-center text-white"
              key={title}
            >
              <img
                src={
                  'https://images.unsplash.com/' +
                  [
                    'photo-1540575467063-178a50c2df87',
                    'photo-1511578314322-379afb476865',
                    'photo-1505373877841-8d25f7d46678',
                  ][index] +
                  '?auto=format&fit=crop&w=800&q=85'
                }
                alt=""
                loading="lazy"
                className="absolute inset-0 -z-20 h-full w-full object-cover"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/45 to-black/10" />
              <div className="mb-6 flex items-center justify-center text-white">
                <Icon size={30} />
              </div>
              <h3 className="text-sm uppercase tracking-wide">{title}</h3>
              <p className="mx-auto mt-3 max-w-64 text-sm leading-6 text-white">{copy}</p>
              <Link
                to="/signup"
                className="mt-5 text-xs uppercase tracking-widest underline-offset-4 hover:underline"
              >
                Learn more →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
