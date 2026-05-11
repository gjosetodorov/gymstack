import { Link } from "react-router-dom";
import promoVideo from "../gymstack_promo.mp4";

export default function Banner() {
  return (
    <section id="top" className="w-full bg-gray-950">
      <div className="relative w-full overflow-hidden">
        <video
          className="h-[60vh] w-full object-cover md:h-[70vh]"
          src={promoVideo}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/70" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-6xl px-4 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-gray-300">
              Train smarter
            </p>
            <h1 className="mt-3 text-4xl font-russo font-bold text-white md:text-6xl">
              Gym<span className="text-red-700">Stack</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-gray-200 md:text-lg">
              A clean space to build strength, discipline, and consistency. Join
              the community and start your next session today.
            </p>
            <div className="mt-6 flex justify-center">
              <Link
                className="rounded-3xl bg-red-800 px-5 py-2 text-sm font-medium text-white hover:bg-red-700"
                to="/apply"
              >
                Become a member today
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
