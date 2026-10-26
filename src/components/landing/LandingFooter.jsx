import { Link } from 'react-router-dom';
import { ArrowUpRight, Layers3 } from 'lucide-react';
export default function LandingFooter() {
  return (
    <footer className="bg-[#51563e] py-12 text-[#f6f5ed]" id="contact">
      <div className="mx-auto w-[min(1240px,calc(100%_-_3rem))] grid gap-10 sm:grid-cols-2 lg:grid-cols-4 [&_h3]:mb-5 [&_h3]:text-sm [&_h3]:font-medium [&_h3]:uppercase [&_h3]:tracking-widest [&_p]:text-sm [&_p]:leading-7 [&_a]:mb-3 [&_a]:block [&_a]:text-sm [&_a]:leading-6 [&_a]:hover:underline">
        <div>
          <Link to="/" className="flex! items-center gap-3 font-serif text-xl!">
            <Layers3 />
            <span>EventSphere</span>
          </Link>
          <p>
            A place for remarkable ideas, meaningful connections, and your next great
            experience.
          </p>
        </div>
        <div>
          <h3>Discover</h3>
          <Link to="/#about">About EventSphere</Link>
          <Link to="/#expos">Explore expos</Link>
          <Link to="/#gallery">Event inspiration</Link>
          <Link to="/#faq">Your questions, answered</Link>
        </div>
        <div>
          <h3>Your EventSphere</h3>
          <Link to="/signup?role=attendee">Join as an attendee</Link>
          <Link to="/signup?role=exhibitor">Join as an exhibitor</Link>
          <Link to="/login">Organizer sign in</Link>
          <Link to="/dashboard">My dashboard</Link>
        </div>
        <div>
          <h3>Let's connect</h3>
          <p>
            Have an account? Find platform communication and feedback in your dashboard.
          </p>
          <Link to="/dashboard/feedback" className="mt-5 flex! items-center gap-2">
            Open feedback <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
      <div className="mx-auto w-[min(1240px,calc(100%_-_3rem))] mt-10 flex flex-wrap justify-between gap-4 border-t border-white/15 pt-6 text-xs">
        <span>© {new Date().getFullYear()} EventSphere. All rights reserved.</span>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
