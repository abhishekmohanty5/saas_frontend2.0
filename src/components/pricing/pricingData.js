export const BILLING_INTERVALS = {
  MONTHLY: 'monthly',
  ANNUAL: 'annual',
};

export const titleCasePlanName = (name) => {
  const trimmed = String(name || '').trim();
  if (!trimmed) return '';
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
};

export const getDefaultFeaturesForPlan = (planName) => {
  const key = String(planName || '').trim().toLowerCase();

  if (key === 'free trial' || key === 'free') {
    return [
      { text: 'JWT authentication & multi-tenancy', included: true },
      { text: 'Developer Console (/api/dashboard)', included: true },
      { text: 'Auto Client ID & Secret generation', included: true },
      { text: 'API usage tracking (live)', included: true },
      { text: 'Email renewal reminders', included: false },
      { text: 'Priority support', included: false },
    ];
  }

  if (key === 'pro') {
    return [
      { text: 'JWT authentication & multi-tenancy', included: true },
      { text: 'Developer Console (/api/dashboard)', included: true },
      { text: 'Auto Client ID & Secret generation', included: true },
      { text: 'API usage tracking (live)', included: true },
      { text: 'Email renewal reminders (9 AM daily)', included: true },
      { text: 'Priority support', included: false },
    ];
  }

  if (key === 'enterprise') {
    return [
      { text: 'JWT authentication & multi-tenancy', included: true },
      { text: 'Developer Console (/api/dashboard)', included: true },
      { text: 'Auto Client ID & Secret generation', included: true },
      { text: 'API usage tracking (live)', included: true },
      { text: 'Email renewal reminders (9 AM daily)', included: true },
      { text: 'Priority support', included: true },
    ];
  }

  // Default
  return [
    { text: 'JWT authentication & multi-tenancy', included: true },
    { text: 'Developer Console (/api/dashboard)', included: true },
    { text: 'Auto Client ID & Secret generation', included: true },
    { text: 'API usage tracking (live)', included: true },
    { text: 'Email renewal reminders', included: true },
    { text: 'Priority support', included: false },
  ];
};

// Real SubSphere plans matching /api/public
export const DEFAULT_PLANS = [
  {
    id: 1,
    name: 'Free Trial',
    price: 0,
    durationInDays: 14,
    active: true,
    description: '14 days to explore the full SubSphere engine — no credit card required.',
    features: getDefaultFeaturesForPlan('free trial'),
  },
  {
    id: 2,
    name: 'Pro',
    price: 999,
    durationInDays: 30,
    active: true,
    description: '30 days of full access including email reminders and live usage stats.',
    features: getDefaultFeaturesForPlan('pro'),
    featured: true,
  },
  {
    id: 3,
    name: 'Enterprise',
    price: 4999,
    durationInDays: 30,
    active: true,
    description: '30 days with priority support, full admin access, and all engine services.',
    features: getDefaultFeaturesForPlan('enterprise'),
  },
];

export const normalizePlanFromBackend = (plan) => {
  const name = titleCasePlanName(plan?.name);
  const featuresArray = Array.isArray(plan?.features) ? plan.features : [];
  const formattedFeatures = featuresArray
    .map((f) => (typeof f === 'string' ? { text: f, included: true } : f))
    .filter(Boolean);

  return {
    id: plan?.id,
    name,
    price: Number.parseFloat(plan?.price),
    durationInDays: plan?.durationInDays,
    active: !!plan?.active,
    description: plan?.description || '30 days of full access to all features.',
    featured: !!plan?.featured || String(name).toUpperCase() === 'PRO',
    features: formattedFeatures.length > 0 ? formattedFeatures : getDefaultFeaturesForPlan(name),
  };
};
