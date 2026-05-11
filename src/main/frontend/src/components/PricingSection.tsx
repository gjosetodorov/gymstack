import Gym from "../gym.png";
import monthlyImage from "../monthly.png";
import annualImage from "../annual.png";
import studentImage from "../student.png";
import { Link } from "react-router-dom";

export default function PricingSection() {
  return (
    <section id="pricing" className="scroll-mt-24 bg-gray-950 py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Pricing</p>
          <h2 className="mt-3 text-3xl font-russo text-gray-100 md:text-4xl">Pick a plan</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-gray-300 md:text-base">
            Flexible plans built for students, professionals, and committed athletes. Every plan includes coach support
            and progress tracking.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Monthly",
              price: "29€",
              note: "Full gym access",
              image: monthlyImage,
              type: "MONTHLY",
              features: ["Open gym access", "2 group sessions/week", "Monthly goal check-in"],
            },
            {
              title: "Annual",
              price: "299€",
              note: "Best value",
              image: annualImage,
              type: "ANNUAL",
              features: ["Unlimited group sessions", "Priority coaching", "Quarterly body scan"],
            },
            {
              title: "Student",
              price: "19€",
              note: "Valid student ID required",
              image: studentImage,
              type: "STUDENT",
              features: ["Open gym access", "1 group session/week", "Student-only hours"],
            },
          ].map((plan) => (
            <div
              key={plan.title}
              className="flex h-full flex-col gap-4 rounded-2xl border border-gray-800 bg-gray-900/60 px-5 py-6"
            >
              <img
                alt={`${plan.title} plan`}
                className="h-44 w-full rounded-xl bg-gray-950 object-contain"
                src={plan.image}
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-100">{plan.title}</h3>
                <p className="mt-3 text-3xl font-semibold text-red-700">{plan.price}</p>
                <p className="mt-1 text-sm text-gray-300">{plan.note}</p>
              </div>
              <ul className="space-y-2 text-sm text-gray-300">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-700" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                className="mt-auto rounded bg-red-800 px-4 py-2 text-center text-sm font-medium text-white hover:bg-red-700"
                to={`/apply?type=${plan.type}`}
              >
                Choose plan
              </Link>
            </div>
          ))}
        </div>

        <div className="grid gap-4 rounded-2xl border border-gray-800 bg-gray-900/60 p-6 md:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-100">What you get</h3>
            <p className="text-sm text-gray-300">
              Every membership includes modern equipment, recovery zones, and a supportive coaching team.
            </p>
            <div className="grid gap-2 text-sm text-gray-300 sm:grid-cols-2">
              {["Smart strength equipment", "Cardio zone", "Stretch + recovery", "Nutrition guidance", "Progress tracking", "Community events"].map(
                (item) => (
                  <div key={item} className="rounded-lg border border-gray-800 bg-gray-950/60 px-3 py-2">
                    {item}
                  </div>
                )
              )}
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-950/60">
            <img alt="Gym amenities" className="h-full w-full object-cover" src={Gym} />
          </div>
        </div>
      </div>
    </section>
  );
}
