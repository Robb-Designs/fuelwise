import { Link } from "react-router-dom";

// Footer navigation links
const footerNav = [
  { label: "Features", to: "/#features" },
  { label: "Insights", to: "/#insights" },
  { label: "Recovery", to: "/#recovery" },
  { label: "Dashboard", to: "/dashboard" },
];

// Legal links
const legalNav = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#313527]/85 backdrop-blur-md text-center text-sm text-stone-300 py-6 mt-14">
      <div className="mx-auto max-w-7xl px-6">
        {/* Top area */}
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          {/* Brand */}
          <div className="max-w-xs">
            <Link
              to="/"
              className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-100 transition-colors duration-300 hover:text-white"
            >
              FuelWise
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-stone-300">
              Smarter recovery insights for endurance athletes.
            </p>
          </div>

          {/* Nav links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {footerNav.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-stone-200 transition-colors duration-300 hover:text-stone-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Divider */}
        <div className="mt-12 border-t border-white/10" />

        {/* Bottom area */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-stone-300">
            &copy; {new Date().getFullYear()} FuelWise. All rights reserved.
          </p>

          <ul className="flex items-center gap-6">
            {legalNav.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  className="text-xs text-stone-300 transition-colors duration-300 hover:text-stone-300"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
