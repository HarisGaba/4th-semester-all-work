import { CalendarDays, Compass, Users, ShieldCheck } from 'lucide-react';

export default function ExperienceSection() {
  const features = [
    [Compass, 'Personalized discovery', 'Find expos that match your interests.'],
    [CalendarDays, 'Thoughtful planning', 'Manage your expo details in one place.'],
    [ShieldCheck, 'Secure access', 'Dedicated tools for every account role.'],
    [Users, 'Meaningful connections', 'Bring organizers and communities together.'],
  ];
  return (
    <section id="about" className="bg-[#fafaf9] px-6 py-12 text-center md:py-16">
      <h2 className="font-serif text-xl font-normal uppercase tracking-wide">
        You imagine. We connect.
      </h2>
      <div
        aria-hidden="true"
        className="mx-auto my-4 flex items-center justify-center gap-2 text-[#b5ac9b]"
      >
        <span className="h-px w-8 bg-[#dedbd2]" />✦
        <span className="h-px w-8 bg-[#dedbd2]" />
      </div>
      <p className="mx-auto max-w-xl text-sm leading-7 text-[#62655b]">
        From industry exhibitions to inspiring conferences, EventSphere brings your next
        event and your community together.
      </p>
      <div className="mx-auto mt-10 grid max-w-6xl grid-cols-2 gap-8 md:grid-cols-4 md:gap-14">
        {features.map(([Icon, title, description]) => (
          <article key={title}>
            <Icon
              className="mx-auto mb-5 size-11 text-[#9b907e]"
              strokeWidth={1}
              aria-hidden="true"
            />
            <h3 className="mx-auto max-w-40 text-sm font-medium uppercase leading-6">
              {title}
            </h3>
            <p className="mx-auto mt-3 max-w-44 text-sm leading-6 text-[#62655b]">
              {description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
