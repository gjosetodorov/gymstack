import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import ProgramsSection from "../components/ProgramsSection";
import PricingSection from "../components/PricingSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar />
      <Banner />
      <ProgramsSection />
      <PricingSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
