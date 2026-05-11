import GymStackLogo from "../GymStack.png";

export default function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-24 bg-gray-950 py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Contact</p>
          <h2 className="mt-3 text-3xl font-russo text-gray-100 md:text-4xl">Visit us</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-gray-300 md:text-base">
            Reach out for a tour, coaching questions, or membership help. We respond within 24 hours.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/60">
            <img alt="Gym location" className="h-full w-full object-cover" src={GymStackLogo} />
            <div className="space-y-2 px-5 py-4 text-sm text-gray-300">
              <p className="text-gray-100">GymStack HQ</p>
              <p>Str. Fitness 12, Skopje</p>
              <p>Mon - Sat: 07:00 - 22:00 · Sun: 09:00 - 18:00</p>
            </div>
          </div>
          <form className="flex flex-col gap-4 rounded-2xl border border-gray-800 bg-gray-900/60 p-6 text-left">
            <div>
              <h3 className="text-lg font-semibold text-gray-100">Send a message</h3>
              <p className="text-sm text-gray-300">Tell us what you need and we will help.</p>
            </div>
            <label className="text-xs text-gray-300">
              Name
              <input
                className="mt-2 w-full rounded border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-gray-100"
                placeholder="Your name"
                type="text"
              />
            </label>
            <label className="text-xs text-gray-300">
              Email
              <input
                className="mt-2 w-full rounded border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-gray-100"
                placeholder="you@email.com"
                type="email"
              />
            </label>
            <label className="text-xs text-gray-300">
              Message
              <textarea
                className="mt-2 min-h-[120px] w-full rounded border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-gray-100"
                placeholder="Let us know what you are looking for"
              />
            </label>
            <button
              className="rounded bg-red-800 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              type="button"
            >
              Send message
            </button>
          </form>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {["hello@gymstack.com", "+389 70 123 456", "Instagram: @gymstack"].map((item) => (
            <div key={item} className="rounded-2xl border border-gray-800 bg-gray-900/60 px-5 py-6 text-center">
              <p className="text-sm text-gray-200">{item}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6">
          <h3 className="text-lg font-semibold text-gray-100">Quick answers</h3>
          <div className="mt-4 grid gap-4 text-sm text-gray-300 md:grid-cols-2">
            <div className="rounded-xl border border-gray-800 bg-gray-950/60 p-4">
              <p className="text-gray-100">Do you offer a trial?</p>
              <p className="mt-2">Yes. Book a free intro session to meet the coaches and tour the gym.</p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-950/60 p-4">
              <p className="text-gray-100">Can I pause a membership?</p>
              <p className="mt-2">You can pause once per year for up to 30 days.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
