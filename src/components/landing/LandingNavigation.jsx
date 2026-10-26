import { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { clearAuth } from '@/api/api';
import { Menu, X, ArrowUpRight, Layers3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingNavigation() {
  const menuButton = useRef(null);
  const [signingOut, setSigningOut] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const user = useAuth();

  const location = useLocation();

  const links = ['Home', 'About', 'Expos', 'Events', 'Gallery', 'FAQ', 'Contact'];

  async function signOut() {
    setSigningOut(true);
    try {
      clearAuth();
      setOpen(false);
      setError('');
    } catch {
      setError('Unable to sign out. Please try again.');
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-[#e9e9e2] bg-white text-[#35372f] [&_a]:focus-visible:outline-[#555b42] [&_button]:focus-visible:outline-[#555b42]"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          setOpen(false);
          menuButton.current?.focus();
        }
      }}
    >
      <div className="mx-auto flex h-20 max-w-[1536px] items-center justify-between gap-4 px-5 sm:px-8 xl:grid xl:grid-cols-[1fr_auto_1fr] xl:gap-6 xl:px-10">
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="flex shrink-0 items-center gap-3 text-[#555b42]"
          aria-label="EventSphere home"
        >
          <Layers3 size={30} strokeWidth={1.5} />

          <span className="font-serif text-xl tracking-wider">
            EventSphere
            <small className="block font-sans text-[10px] uppercase tracking-[0.2em]">
              Experiences That Connect
            </small>
          </span>
        </Link>

        <nav
          aria-label="Desktop navigation"
          className="hidden items-center gap-5 xl:flex 2xl:gap-7"
        >
          {links.map((label) => (
            <Link
              key={label}
              to={label === 'Home' ? '/' : `/#${label.toLowerCase()}`}
              aria-current={
                label === 'Home' && location.pathname === '/' && !location.hash
                  ? 'page'
                  : undefined
              }
              className="py-3 text-sm font-medium uppercase tracking-wider text-[#35372f] transition-colors hover:text-[#555b42] hover:underline underline-offset-8"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center justify-self-end gap-2 xl:flex">
          {user ? (
            <>
              <Button
                asChild
                className="h-11 rounded-none bg-[#555b42] px-5 text-sm text-white uppercase tracking-wider hover:bg-[#444a34]"
              >
                <Link to="/dashboard">Dashboard</Link>
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={signOut}
                disabled={signingOut}
                className="h-11 rounded-none text-sm uppercase tracking-wider text-[#35372f]"
              >
                {signingOut ? 'Signing out…' : 'Logout'}
              </Button>
            </>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                className="h-11 rounded-none text-sm uppercase tracking-wider text-[#35372f]"
              >
                <Link to="/login">Log in</Link>
              </Button>

              <Button
                asChild
                className="h-11 rounded-none bg-[#555b42] px-5 text-sm text-white uppercase tracking-wider hover:bg-[#444a34]"
              >
                <Link to="/signup">
                  Sign up
                  <ArrowUpRight size={15} />
                </Link>
              </Button>
            </>
          )}
        </div>

        <Button
          ref={menuButton}
          variant="ghost"
          size="icon"
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="main-navigation"
          onClick={() => setOpen(!open)}
          className="size-11 rounded-none text-[#555b42] xl:hidden"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </Button>
      </div>

      {open && (
        <nav
          id="main-navigation"
          aria-label="Mobile navigation"
          className="absolute left-0 right-0 top-full flex max-h-[calc(100dvh-5rem)] flex-col gap-4 overflow-y-auto border-t bg-white px-6 py-6 shadow-lg xl:hidden"
        >
          {links.map((label) => (
            <Link
              key={label}
              to={label === 'Home' ? '/' : `/#${label.toLowerCase()}`}
              onClick={() => setOpen(false)}
              className="py-3 text-sm font-medium uppercase tracking-wider text-[#35372f] hover:bg-[#f7f6f0]"
            >
              {label}
            </Link>
          ))}

          {user ? (
            <>
              <Button
                asChild
                className="h-11 rounded-none bg-[#555b42] text-white hover:bg-[#444a34]"
              >
                <Link to="/dashboard" onClick={() => setOpen(false)}>
                  Dashboard
                </Link>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={signOut}
                disabled={signingOut}
              >
                {signingOut ? 'Signing out…' : 'Logout'}
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="outline">
                <Link to="/login" onClick={() => setOpen(false)}>
                  Log in
                </Link>
              </Button>

              <Button
                asChild
                className="h-11 rounded-none bg-[#555b42] text-white hover:bg-[#444a34]"
              >
                <Link to="/signup" onClick={() => setOpen(false)}>
                  Sign up
                  <ArrowUpRight size={16} />
                </Link>
              </Button>
            </>
          )}
        </nav>
      )}

      {error && (
        <p className="bg-red-50 px-5 py-2 text-center text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </header>
  );
}
