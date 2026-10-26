import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const slides = [
  {
    photo: 'photo-1511578314322-379afb476865',
    alt: 'A modern conference hall prepared for an event',
    label: 'Spaces for possibility',
  },
  {
    photo: 'photo-1540575467063-178a50c2df87',
    alt: 'An audience gathered for an inspiring conference',
    label: 'People with purpose',
  },
];

export default function HeroSection() {
  const [active, setActive] = useState(0);

  function change(direction) {
    setActive((index) => (index + direction + slides.length) % slides.length);
  }

  return (
    <section
      id="home"
      className="relative flex min-h-[550px] items-center overflow-hidden bg-[#555b42] md:min-h-[600px] lg:min-h-[660px]"
      aria-label="Event inspiration"
      aria-roledescription="carousel"
    >
      {slides.map((slide, index) => (
        <img
          key={slide.photo}
          src={`https://images.unsplash.com/${slide.photo}?auto=format&fit=crop&w=2200&q=85`}
          alt={active === index ? slide.alt : ''}
          aria-hidden={active !== index}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            active === index ? 'opacity-100' : 'opacity-0'
          }`}
          fetchPriority={index === 0 ? 'high' : 'auto'}
          loading={index === 0 ? 'eager' : 'lazy'}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 md:px-12 lg:px-[10%]">
        <div className="max-w-xl">
          <h1 className="mb-6 font-serif text-4xl font-normal! leading-tight text-white sm:text-5xl md:text-6xl lg:text-6xl">
            Your next event,
            <br />
            beautifully
            <br />
            connected.
          </h1>

          <p className="mb-8 max-w-lg text-sm leading-7 text-white/90 md:text-base">
            Discover expos, bring your ideas to life, and connect with your community.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Button
              asChild
              className="h-12 rounded-none bg-[#555b42] px-7 text-xs font-medium uppercase tracking-wider text-white hover:bg-[#444a34]"
            >
              <Link to="/#events">
                Explore Events
                <ArrowUpRight size={17} />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-12 rounded-none border-white bg-white/95 px-7 text-xs font-medium uppercase tracking-wider text-[#555b42] hover:bg-white"
            >
              <Link to="/signup">
                Get Started
                <ArrowUpRight size={17} />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 z-20">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 md:px-12 lg:px-20">
          <span
            aria-live="polite"
            className="text-xs font-medium tracking-wider text-white"
          >
            0{active + 1} / 0{slides.length}
            <span className="ml-2 hidden text-white/80 sm:inline">
              — {slides[active].label}
            </span>
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Previous hero image"
              onClick={() => change(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/60 text-white transition-colors hover:bg-white hover:text-[#555b42]"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              aria-label="Next hero image"
              onClick={() => change(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/60 text-white transition-colors hover:bg-white hover:text-[#555b42]"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
