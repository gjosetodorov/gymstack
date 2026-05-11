export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-red-900/60 bg-gradient-to-b from-gray-950 to-red-950 py-10 pb-24 md:pb-10">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 text-sm text-gray-300 md:grid-cols-3">
        <div className="space-y-3">
          <h3 className="text-lg font-russo text-gray-100">
            Gym<span className="text-red-700">Stack</span>
          </h3>
          <p className="text-sm text-gray-300">
            Train smarter with focused programs, expert guidance, and a community
            that keeps you accountable.
          </p>
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
            Visit
          </h4>
          <p>Str. Fitness 12, Skopje</p>
          <p>Mon - Sat: 07:00 - 22:00</p>
          <p>Sun: 09:00 - 18:00</p>
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
            Contact
          </h4>
          <p>hello@gymstack.com</p>
          <p>+389 70 123 456</p>
          <p>Follow us for updates and new programs.</p>
        </div>
      </div>
      <div className="mx-auto mt-8 w-full max-w-6xl border-t border-red-900/40 px-4 pt-4 text-center text-xs text-gray-400 md:flex md:justify-between">
        <span>© {year} GymStack. All rights reserved.</span>
        <span className="text-gray-500">Train smarter. Stay consistent.</span>
      </div>
    </footer>
  );
}
