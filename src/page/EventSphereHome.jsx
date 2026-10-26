import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus, Sprout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LandingNavigation from '@/components/landing/LandingNavigation';
import LandingFooter from '@/components/landing/LandingFooter';
import HeroSection from '@/components/landing/HeroSection';
import ExperienceSection from '@/components/landing/ExperienceSection';
import HighlightsSection from '@/components/landing/HighlightsSection';
import ExpoCollection from '@/components/landing/ExpoCollection';
import useExpos from '@/hooks/useExpos';
const questions = [
  [
    'How do I join EventSphere?',
    'Create an attendee or exhibitor account using Sign up. Organizer accounts are provisioned by an administrator.',
  ],
  [
    'Where can I discover upcoming expos?',
    'Browse Our Expos for the current catalog. Search by title, location, or theme and expand a card to read its details.',
  ],
  [
    'How do I recover my account?',
    'Select Forgot password on the login page. Request a recovery email and follow its time-limited link to choose a new password. Email delivery requires the platform mail service to be configured.',
  ],
  [
    'Can I access my account on mobile?',
    'Yes. Your account and dashboard adapt to mobile, tablet, and desktop screens.',
  ],
];

const photographs = [
  ['photo-1492684223066-81342ee5ff30', 'An audience celebrating at a live event'],
  ['photo-1517245386807-bb43f82c33c4', 'Professionals sharing ideas at a workshop'],
  ['photo-1505373877841-8d25f7d46678', 'A speaker presenting at a conference'],
];
export default function EventSphereHome() {
  const { hash } = useLocation();
  const expos = useExpos();
  const [active, setActive] = useState(0);
  useEffect(() => {
    document.title = 'EventSphere — Events, Expos & Connections';
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash]);
  return (
    <div
      id="top"
      className="template-home bg-white font-sans text-base leading-7 text-[#35372f] [overflow-wrap:anywhere] [&_h1]:font-serif! [&_h1]:font-normal! [&_h2]:font-serif! [&_h2]:font-normal! [&_h2]:tracking-normal! [&_section[id]]:scroll-mt-24 [&_footer[id]]:scroll-mt-24 [&_a]:focus-visible:outline-[#555b42] [&_button]:focus-visible:outline-[#555b42]"
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:p-4"
      >
        Skip to content
      </a>
      <LandingNavigation />
      <main id="main-content" tabIndex={-1}>
        <HeroSection />
        <ExperienceSection />
        <HighlightsSection />
        <section
          id="gallery"
          className="bg-[#faf2f0] px-6 py-14 md:px-12 lg:px-[5%] lg:py-16"
        >
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_2fr]">
            <div className="py-2">
              <p className="mb-4 text-xs uppercase tracking-[0.16em] text-[#77705f]">
                Event inspiration
              </p>
              <h2 className="text-3xl leading-tight md:text-4xl">
                Remarkable moments,
                <br />
                beautifully connected.
              </h2>
              <p className="mt-5 max-w-xs text-sm leading-7 text-[#62655b]">
                Explore the possibilities for your next event. Curated event photography.
              </p>
              <Button
                asChild
                className="mt-6 h-11 rounded-none bg-[#555b42] px-6 text-xs uppercase tracking-widest text-white hover:bg-[#444a34]"
              >
                <Link to="/#expos">Explore expos</Link>
              </Button>
            </div>
            <div>
              <div className="grid grid-cols-3 gap-3">
                {photographs.map((_, index) => {
                  const photo = photographs[(index + active) % photographs.length];
                  return (
                    <img
                      key={index}
                      src={
                        'https://images.unsplash.com/' +
                        photo[0] +
                        '?auto=format&fit=crop&w=700&q=85'
                      }
                      alt={photo[1]}
                      loading="lazy"
                      className="aspect-[0.92] h-full w-full object-cover"
                    />
                  );
                })}
              </div>
              <div className="mt-5 flex justify-end gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-10 rounded-full border-[#dedbd5] bg-white text-[#555b42]"
                  aria-label="Previous event photos"
                  onClick={() => setActive((active + 2) % 3)}
                >
                  <ChevronLeft />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-10 rounded-full border-[#dedbd5] bg-white text-[#555b42]"
                  aria-label="Next event photos"
                  onClick={() => setActive((active + 1) % 3)}
                >
                  <ChevronRight />
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section
          id="testimonials"
          className="relative overflow-hidden bg-[#fafaf9] px-8 py-12 text-center md:py-16"
        >
          <Sprout
            aria-hidden="true"
            strokeWidth={0.5}
            className="pointer-events-none absolute -left-10 bottom-0 size-40 -rotate-45 text-[#d2d3c7]"
          />
          <h2 className="text-xl uppercase tracking-wide">Community voices</h2>
          <div aria-hidden="true" className="my-3 text-[#b5ac9b]">
            — ✦ —
          </div>
          <p className="relative mx-auto max-w-lg font-serif text-lg leading-8 text-[#62655b]">
            Every event has a story. Published community reviews will appear here when
            available.
          </p>
          <Link
            to="/dashboard/feedback"
            className="relative mt-5 inline-block text-xs uppercase tracking-widest text-[#555b42] underline underline-offset-4"
          >
            Share your experience
          </Link>
          <Sprout
            aria-hidden="true"
            strokeWidth={0.5}
            className="pointer-events-none absolute -right-10 bottom-0 size-40 rotate-45 text-[#d2d3c7]"
          />
        </section>
        <ExpoCollection data={expos} />
        <section className="py-16 sm:py-20" id="faq">
          <div className="mx-auto w-[min(1240px,calc(100%_-_3rem))] grid gap-10 md:grid-cols-2">
            <div>
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-[#686d51]">
                A FEW HELPFUL ANSWERS
              </p>
              <h2>
                Good questions.
                <br />
                <em>Clear answers.</em>
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-[#62655b]">
                A little clarity before your next big experience.
              </p>
            </div>
            <div className="space-y-3 [&_details]:border-b [&_details]:border-[#dedfd5] [&_summary]:flex [&_summary]:cursor-pointer [&_summary]:items-center [&_summary]:justify-between [&_summary]:gap-4 [&_summary]:py-5 [&_p]:pb-5 [&_p]:leading-7 [&_p]:text-[#62655b]">
              {questions.map(([question, answer]) => (
                <details key={question}>
                  <summary>
                    {question}
                    <Plus size={18} />
                  </summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <section
          className="border-t border-[#e2e3d9] bg-[#fafaf8] py-12"
          aria-label="Platform statistics"
        >
          <div className="mx-auto w-[min(1240px,calc(100%_-_3rem))] grid gap-8 text-center sm:grid-cols-3 [&_strong]:block [&_strong]:font-serif [&_strong]:text-4xl [&_strong]:font-normal [&_strong]:text-[#555b42] [&_span]:text-sm [&>p]:text-sm [&>p]:leading-6">
            <div>
              <strong>
                {expos.loading || expos.error
                  ? '—'
                  : expos.items.length + (expos.items.length === 100 ? '+' : '')}
              </strong>
              <span>Expos in the current catalog</span>
            </div>
            <div>
              <strong>
                {expos.loading || expos.error
                  ? '—'
                  : expos.items.filter((item) => new Date(item.date) >= new Date())
                      .length + (expos.items.length === 100 ? '+' : '')}
              </strong>
              <span>Upcoming catalog expos</span>
            </div>
            <p>
              Connected to the live expo catalog.
              <br />
              Community and attendance metrics are not yet available.
            </p>
          </div>
        </section>

        <section
          id="events"
          className="relative isolate overflow-hidden bg-[#f2eeeb] px-6 py-14 md:px-[10%] md:py-16"
        >
          <img
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=85"
            alt="Conference attendees gathered for an event"
            loading="lazy"
            className="absolute inset-y-0 right-0 -z-20 h-full w-full object-cover md:w-3/5"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#f2eeeb] via-[#f2eeeb]/95 to-[#f2eeeb]/30 md:via-[#f2eeeb]/75 md:to-transparent" />
          <h2 className="text-3xl leading-tight md:text-4xl">
            Let’s start planning
            <br />
            your next event.
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-7 text-[#62655b]">
            Bring your ideas, your community, and your next great experience together.
          </p>
          <Button
            asChild
            className="mt-5 h-11 rounded-none bg-[#555b42] px-6 text-xs uppercase tracking-widest text-white hover:bg-[#444a34]"
          >
            <Link to="/signup">Get started</Link>
          </Button>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
