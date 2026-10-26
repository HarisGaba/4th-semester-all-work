import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, MapPin, ArrowUpRight, Search } from 'lucide-react';
export default function ExpoCollection({ data }) {
  const [query, setQuery] = useState('');
  const items = data.items.filter((item) =>
    [item.title, item.location, item.theme]
      .join(' ')
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <section className="py-16 sm:py-20" id="expos">
      <div className="mx-auto w-[min(1240px,calc(100%_-_3rem))]">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end [&>p]:max-w-md [&>p]:text-[#62655b] [&>p]:leading-7">
          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-[#686d51]">
              DISCOVER YOUR NEXT CONNECTION
            </p>
            <h2>
              Discover
              <br />
              <em>extraordinary expos.</em>
            </h2>
          </div>
          <p>
            Explore the latest exhibitions, discover new perspectives, and find your
            community.
          </p>
        </div>
        <label className="mb-8 flex items-center gap-3 border border-[#dfe1d6] bg-white px-4 py-3 text-[#555b42] [&_input]:min-w-0 [&_input]:w-full [&_input]:bg-transparent [&_input]:p-1">
          <Search size={20} />
          <span className="sr-only">Search expos</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, theme, or location"
          />
        </label>
        {data.loading ? (
          <div
            className="flex min-h-48 flex-col items-center justify-center gap-4 border border-[#e2e3d9] bg-[#fafaf8] p-8 text-center"
            role="status"
          >
            Finding your next experience…
          </div>
        ) : data.error ? (
          <div
            className="flex min-h-48 flex-col items-center justify-center gap-4 border border-[#e2e3d9] bg-[#fafaf8] p-8 text-center"
            role="alert"
          >
            <CalendarDays />
            <h3>We'll be right back.</h3>
            <p>{data.error}</p>
            <button
              className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#555b42] px-6 py-3 text-sm text-white hover:bg-[#414731] focus-visible:outline-[#555b42]"
              onClick={data.retry}
            >
              Try again
            </button>
          </div>
        ) : items.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article
                className="overflow-hidden border border-[#e2e3d9] bg-white"
                key={item._id}
              >
                <div className="flex h-44 flex-col items-center justify-center gap-4 bg-[#e8eadf] text-[#555b42]">
                  <CalendarDays size={42} />
                  <span>{item.theme || 'EventSphere expo'}</span>
                </div>
                <div className="space-y-5 p-6 [&_p]:leading-7 [&_details]:border-t [&_details]:border-[#e2e3d9] [&_details]:pt-4 [&_summary]:cursor-pointer [&_summary]:text-[#555b42]">
                  <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-[#686d51]">
                    {item.theme || 'EXHIBITION'}
                  </p>
                  <h3>{item.title}</h3>
                  <p>
                    {item.description ||
                      'Discover this expo and connect with your community.'}
                  </p>
                  <div className="flex flex-col gap-3 text-sm text-[#62655b] [&_span]:flex [&_span]:items-center [&_span]:gap-2">
                    <span>
                      <CalendarDays size={16} />
                      {new Date(item.date).toLocaleDateString(undefined, {
                        dateStyle: 'long',
                      })}
                    </span>
                    <span>
                      <MapPin size={16} />
                      {item.location}
                    </span>
                  </div>
                  <details>
                    <summary>View expo details</summary>
                    <p>
                      {item.description ||
                        'More details will be shared by the organizer.'}
                    </p>
                    <Link
                      className="inline-flex items-center gap-2 py-2 text-sm font-medium text-[#555b42] underline underline-offset-4"
                      to="/dashboard/expos"
                    >
                      Open expo dashboard <ArrowUpRight size={16} />
                    </Link>
                  </details>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex min-h-48 flex-col items-center justify-center gap-4 border border-[#e2e3d9] bg-[#fafaf8] p-8 text-center">
            <CalendarDays />
            <h3>
              {query ? 'No matching expos.' : 'Something worth looking forward to.'}
            </h3>
            <p>
              {query
                ? 'Try another name, theme, or location.'
                : 'New expos will appear here as organizers publish them.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
