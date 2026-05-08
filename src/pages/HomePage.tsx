import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import AnalysisModal from "../components/Modal/AnalysisModal";

type SectionIntroProps = {
  eyebrow: string;
  heading: string;
  description: string;
};

type FeatureCard = {
  id: string;
  title: string;
  content: string;
};

// Define feature cards data
//this data is used to populate the feature section on the homepage. Each card highlights a key aspect of the FuelWise platform, such as training load analysis, recovery monitoring, injury risk awareness, and connected activity insights. The content is crafted to communicate the value proposition of each feature in a clear and concise way, helping visitors understand how FuelWise can enhance their training experience.
const featureCards: FeatureCard[] = [
  {
    id: "training-load-analysis",
    title: "Training Load Analysis",
    content:
      "Monitor weekly workload trends and identify sudden spikes before fatigue builds.",
  },
  {
    id: "recovery-monitoring",
    title: "Recovery Monitoring",
    content:
      "Understand how recovery patterns impact training consistency and readiness.",
  },
  {
    id: "injury-risk-awareness",
    title: "Injury Risk Awareness",
    content:
      "Detect training imbalance early with smarter workload and recovery signals.",
  },
  {
    id: "connected-activity-insights",
    title: "Connected Activity Insights",
    content:
      "Sync activity data seamlessly to generate personalized performance analytics.",
  },
];

// this function is responsible for rendering the introductory section of each major content area on the homepage. It takes in an eyebrow (a small uppercase label), a heading (the main title), and a description (a brief paragraph) as props, and styles them to create a visually appealing and informative introduction for visitors. This component helps set the context for the content that follows, guiding users through the key features and benefits of the FuelWise platform.
// The SectionIntro component is a reusable UI component that renders a section header with an eyebrow, heading, and description. It is used to introduce different sections of the homepage, providing context and highlighting key messages about the features and benefits of the FuelWise platform.
function SectionIntro({ eyebrow, heading, description }: SectionIntroProps) {
  return (
    <header className="text-center lg:text-left">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-3xl font-semibold leading-tight text-stone-900 lg:text-5xl">
        {heading}
      </h2>
      <p className="mt-5 text-base leading-relaxed text-stone-700">
        {description}
      </p>
    </header>
  );
}

export default function HomePage() {
  const { login } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <section className="relative w-full min-h-screen overflow-hidden">
        <Navbar />
        <div className="absolute inset-0 z-0">
          <img
            src="/images/newHero.webp"
            alt="Runner training outdoors"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-black/45" />
        <div className="relative z-20 mx-auto flex min-h-screen w-full max-w-7xl items-center px-6">
          <div className="flex max-w-2xl flex-col items-center space-y-6 text-white md:items-start">
            <h1 className="text-center text-4xl font-semibold leading-tight md:text-left md:text-6xl">
              Train smarter.
              <br />
              Reduce injury risk.
            </h1>
            <p className="text-center text-base text-gray-200 md:text-left md:text-lg">
              Analyze your training load and recovery to get personalized
              insights and prevent injuries before they happen.
            </p>
            <div className="flex flex-col gap-4 md:flex-row">
              <button
                onClick={openModal}
                className="rounded-lg bg-[#BC6C25] px-6 py-3 font-medium text-stone-100 transition-all duration-300 hover:bg-[#A75F20] hover:-translate-y-px shadow-[0_10px_30px_-12px_rgba(188,108,37,0.45)]"
              >
                Get Analysis →
              </button>
              <button className="rounded-lg border border-white/50 bg-white/5 px-6 py-3 font-medium text-stone-100 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/30">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Insights Section */}
      <section className="bg-[#F8F6F1] py-20 lg:py-28">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionIntro
                eyebrow="Performance Insights"
                heading="Understand your training patterns before fatigue becomes injury."
                description="FuelWise combines connected activity syncing with workload and recovery analysis so endurance athletes can make clearer, data-informed training decisions."
              />

              <ul className="mt-8 flex flex-col gap-3 text-sm text-stone-700 items-center md:items-start">
                <li className="flex items-center gap-3">
                  <span className="text-sm text-gray-900">✓</span>
                  <span>Track load progression week over week</span>
                </li>

                <li className="flex items-center gap-3">
                  <span className="text-sm text-gray-900">✓</span>
                  <span>Catch recovery imbalance early</span>
                </li>

                <li className="flex items-center gap-3">
                  <span className="text-sm text-gray-900">✓</span>
                  <span>Train with actionable risk signals</span>
                </li>
              </ul>
            </div>

            <figure className="lg:col-span-7 rounded-2xl border border-stone-200/70 bg-[#FCFBF8] p-3 shadow-[0_10px_30px_-18px_rgba(28,25,23,0.12)]">
              <img
                src="/images/RealisticDataDashBoard.webp"
                alt="FuelWise dashboard preview"
                className="h-full w-full rounded-xl object-cover"
              />
            </figure>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="bg-[#FCFBF8] py-20 lg:py-28">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="flex flex-col items-center text-center mb-4">
            <SectionIntro
              eyebrow="Performance Features"
              heading="Built to help runners train with more clarity."
              description="FuelWise combines workload tracking, recovery analysis, and activity insights into a calmer, more intelligent training experience for endurance athletes."
            />
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-4">
            {featureCards.map((feature) => (
              <article
                key={feature.id}
                className="rounded-2xl border border-stone-200/70 bg-[#FCFBF8] p-7 shadow-[0_10px_30px_-18px_rgba(28,25,23,0.12)]"
              >
                <h3 className="text-xl font-semibold text-stone-900">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-stone-600">
                  {feature.content}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Recovery Intelligence Section */}
      <section className="bg-[#F8F6F1] py-20 lg:py-28">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <figure className="lg:col-span-7 rounded-2xl border border-stone-200/70 bg-[#FCFBF8] p-3 shadow-[0_10px_30px_-18px_rgba(28,25,23,0.12)]">
              <img
                src="/images/StretcedGoalsDataDashBoard.webp"
                alt="FuelWise recovery intelligence dashboard preview"
                className="h-full w-full rounded-xl object-cover"
              />
            </figure>
            <div className="lg:col-span-5">
              <SectionIntro
                eyebrow="Recovery Intelligence"
                heading="Train with better awareness of fatigue and recovery."
                description="FuelWise helps runners recognize workload imbalance early through recovery analysis, nutrition guidance, and personalized training recommendations."
              />

              <ul className="mt-8 flex flex-col gap-3 text-sm text-stone-700 items-center md:items-start">
                <li className="flex items-center gap-3">
                  <span className="text-sm text-gray-900">✓</span>
                  <span>Monitor recovery trends alongside training load</span>
                </li>

                <li className="flex items-center gap-3">
                  <span className="text-sm text-gray-900">✓</span>
                  <span>Receive personalized recovery recommendations</span>
                </li>

                <li className="flex items-center gap-3">
                  <span className="text-sm text-gray-900">✓</span>
                  <span>Build more sustainable training habits</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#0c1f12] py-24 lg:py-32">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-300/80">
            Train With More Awareness
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight text-stone-100 lg:text-5xl">
            Performance begins with understanding your recovery.
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-stone-200/85">
            FuelWise helps runners build smarter, more sustainable training
            habits through intelligent recovery, workload analysis, and
            personalized athlete insights.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={openModal}
              className="rounded-lg bg-[#BC6C25] px-6 py-3 font-medium text-stone-100 transition-all duration-300 hover:bg-[#A75F20] hover:-translate-y-px shadow-[0_10px_30px_-12px_rgba(188,108,37,0.45)]"
            >
              Start Your Analysis
            </button>
            <button
              type="button"
              className="rounded-lg border border-white/50 bg-white/5 px-6 py-3 font-medium text-stone-100 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/30"
            >
              Explore the Dashboard
            </button>
          </div>
        </div>
      </section>

      <Footer />

      {isModalOpen && (
        <AnalysisModal
          onClose={() => setIsModalOpen(false)}
          onConnect={login}
        />
      )}
    </>
  );
}
