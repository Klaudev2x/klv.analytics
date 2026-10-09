import { navigate } from "../lib/router";

interface Plan {
  name: string;
  tier: string;
  blurb: string;
  price: string;
  cadence: string;
  features: string[];
  cta: string;
  featured?: boolean;
}

const PLANS: Plan[] = [
  {
    name: "Starter",
    tier: "free",
    blurb: "For small projects",
    price: "Free",
    cadence: "",
    features: ["1 site", "10K events/month", "Real-time dashboard", "Traffic analytics"],
    cta: "Get Started",
  },
  {
    name: "Professional",
    tier: "pro",
    blurb: "For growing businesses",
    price: "$29",
    cadence: "/month",
    features: ["5 sites", "1M events/month", "Sales & audience tabs", "Custom events", "Email support"],
    cta: "Get Started",
    featured: true,
  },
  {
    name: "Business",
    tier: "business",
    blurb: "For large scale",
    price: "Custom",
    cadence: "",
    features: ["25 sites", "Unlimited events", "SEO & AI insights", "Dedicated support", "SLA guarantee"],
    cta: "Contact Sales",
  },
];

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <header className="bg-slate-900/70 border-b border-slate-800 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            KLV.AI Analytics
          </h1>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 rounded-lg transition"
          >
            ← Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Pricing Plans</h2>
          <p className="text-slate-400 mb-12">
            Choose the perfect plan for your analytics needs
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {PLANS.map((plan) => (
              <div
                key={plan.tier}
                className={`relative rounded-xl p-8 flex flex-col text-left transition hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10 ${
                  plan.featured
                    ? "bg-slate-900 border-2 border-cyan-500 shadow-lg shadow-cyan-500/10"
                    : "bg-slate-900 border border-slate-800 hover:border-slate-600"
                }`}
              >
                {plan.featured && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-cyan-500 text-slate-950 px-4 py-1 rounded-full text-xs font-bold tracking-wide">
                    POPULAR
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-slate-400 text-sm mb-6">{plan.blurb}</p>
                <p className="text-4xl font-bold text-cyan-400 mb-6">
                  {plan.price}
                  {plan.cadence && <span className="text-lg text-slate-400">{plan.cadence}</span>}
                </p>
                <ul className="space-y-3 text-slate-300 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <CheckIcon />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate("/admin/setup")}
                  className={`mt-auto w-full px-4 py-2.5 rounded-lg transition font-semibold ${
                    plan.featured
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                      : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
