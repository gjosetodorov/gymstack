export default function ProgramsSection() {
  return (
    <section id="programs" className="scroll-mt-24 bg-gray-950 py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Programs</p>
          <h2 className="mt-3 text-3xl font-russo text-gray-100 md:text-4xl">Train with structure</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-gray-300 md:text-base">
            Clear programming, measured progress, and coaching feedback so you always know what to train and why.
            Each plan adapts to your experience level and schedule.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Strength Foundation",
              tagline: "Build your base",
              description:
                "Compound lifts, progressive loading, and mobility resets to grow strength safely and consistently.",
              details: ["3-4 sessions/week", "Technique coaching", "Measured PR milestones"],
            },
            {
              title: "Performance Conditioning",
              tagline: "Build your engine",
              description:
                "Intervals, sled work, and metabolic circuits to boost endurance without sacrificing strength.",
              details: ["2-3 sessions/week", "Heart-rate zones", "Recovery guidance"],
            },
            {
              title: "Mobility + Recovery",
              tagline: "Move better",
              description:
                "Guided mobility, joint prep, and recovery protocols to keep you training pain-free.",
              details: ["Daily 20-min resets", "Hip + shoulder focus", "Breathing drills"],
            },
          ].map((program) => (
            <div
              key={program.title}
              className="flex h-full flex-col gap-4 rounded-2xl border border-gray-800 bg-gray-900/60 px-5 py-6 text-left"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400">{program.tagline}</p>
                <h3 className="mt-2 text-lg font-semibold text-gray-100">{program.title}</h3>
                <p className="mt-3 text-sm text-gray-300">{program.description}</p>
              </div>
              <ul className="mt-auto space-y-2 text-sm text-gray-300">
                {program.details.map((detail) => (
                  <li key={detail} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-700" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="grid gap-4 rounded-2xl border border-gray-800 bg-gray-900/60 p-6 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-100">Weekly structure</h3>
            <p className="text-sm text-gray-300">
              Every member gets a weekly cadence that balances lifting, conditioning, and recovery. You will know what
              to focus on each day and how to scale intensity.
            </p>
            <div className="grid gap-3 text-sm text-gray-300 sm:grid-cols-2">
              {[
                "Mon: Heavy strength",
                "Tue: Conditioning",
                "Wed: Mobility + core",
                "Thu: Volume strength",
                "Fri: Power + speed",
                "Sat: Team session",
              ].map((item) => (
                <div key={item} className="rounded-lg border border-gray-800 bg-gray-950/60 px-3 py-2">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-100">What you will master</h3>
            <p className="text-sm text-gray-300">
              Expect coaching feedback, movement cues, and progress check-ins so your training stays on track.
            </p>
            <div className="grid gap-3 text-sm text-gray-300">
              {[
                "Consistent technique across major lifts",
                "Energy system training with recovery blocks",
                "Goal reviews every 4 weeks",
                "Personalized load adjustments",
              ].map((item) => (
                <div key={item} className="rounded-lg border border-gray-800 bg-gray-950/60 px-3 py-2">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
