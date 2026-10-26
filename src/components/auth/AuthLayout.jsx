import { useEffect, useLayoutEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import LandingNavigation from '@/components/landing/LandingNavigation';

export default function AuthLayout({ title, description, children }) {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  useEffect(() => {
    document.title = title + ' — EventSphere';
  }, [title]);
  return (
    <div className="min-h-dvh bg-[#f7f5ef] text-[#35372f]" id="top">
      <LandingNavigation />
      <main className="flex min-h-[calc(100dvh-5rem)] flex-col items-center justify-start px-4 py-4 sm:px-6 sm:py-5">
        <div className="w-full max-w-2xl border border-[#e0e2d6] bg-white px-5 py-5 shadow-sm sm:px-8 sm:py-6 [&_input]:h-11 [&_input]:w-full [&_input]:min-w-0 [&_input]:border [&_input]:border-[#d8ddcf] [&_input]:bg-[#fafaf7] [&_input]:px-3 [&_input]:text-base [&_input]:text-[#35372f] [&_select]:h-11 [&_select]:w-full [&_select]:min-w-0 [&_select]:border [&_select]:border-[#d8ddcf] [&_select]:bg-[#fafaf7] [&_select]:px-3 [&_select]:text-base [&_select]:text-[#35372f] [&_label]:text-sm [&_label]:font-medium [&_label]:text-[#555b42] [&_input]:focus-visible:outline-[#555b42] [&_select]:focus-visible:outline-[#555b42] [&_button]:focus-visible:outline-[#555b42] [&_a]:focus-visible:outline-[#555b42]">
          <h1 className="mb-2 text-center font-serif text-2xl font-normal leading-tight text-[#555b42] sm:text-3xl">
            {title}
          </h1>
          <p className="mb-4 text-center text-sm leading-6 text-[#62655b]">
            {description}
          </p>
          {children}
        </div>
        <Link
          to="/"
          className="mt-2 inline-flex min-h-9 items-center gap-2 text-sm text-[#555b42] underline-offset-4 hover:underline"
        >
          <ArrowLeft size={16} /> Back to EventSphere
        </Link>
      </main>
    </div>
  );
}
