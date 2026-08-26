import { Benefits } from "./benefits";
import { CtaBand } from "./cta-band";
import { Faq } from "./faq";
import { Hero } from "./hero";
import { HowItWorks } from "./how-it-works";
import { Requirements } from "./requirements";
import { TrustStats } from "./trust-stats";

export function LandingView() {
  return (
    <div className="fade-in animate-in">
      <Hero />
      <TrustStats />
      <Benefits />
      <Requirements />
      <HowItWorks />
      <Faq />
      <CtaBand />
    </div>
  );
}
