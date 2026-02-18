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

  // These 5 features are the canonical list used in UI.
  if (key === 'premium') {
    return [
      { text: 'JWT authentication', included: true },
      { text: 'Automated renewals', included: true },
      { text: 'Email reminders', included: true },
      { text: 'Admin dashboard', included: true },
      { text: 'Priority support', included: false },
    ];
  }

  if (key === 'enterprise') {
    return [
      { text: 'JWT authentication', included: true },
      { text: 'Automated renewals', included: true },
      { text: 'Email reminders', included: true },
      { text: 'Admin dashboard', included: true },
      { text: 'Priority support', included: true },
    ];
  }

  if (key === 'free') {
    return [
      { text: 'JWT authentication', included: true },
      { text: 'Automated renewals', included: false },
      { text: 'Email reminders', included: true },
      { text: 'Admin dashboard', included: false },
      { text: 'Priority support', included: false },
    ];
  }

  // Default: Basic (and any unknown plan)
  return [
    { text: 'JWT authentication', included: true },
    { text: 'Automated renewals', included: true },
    { text: 'Email reminders', included: true },
    { text: 'Admin dashboard', included: false },
    { text: 'Priority support', included: false },
  ];
};

// Single place to adjust landing/pricing default prices.
export const DEFAULT_PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: 499,
    durationInDays: 30,
    active: true,
    description: '30 days of full access to all features.',
    features: getDefaultFeaturesForPlan('basic'),
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 999,
    durationInDays: 30,
    active: true,
    description: '30 days of full access to all features.',
    features: getDefaultFeaturesForPlan('premium'),
    featured: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 2499,
    durationInDays: 30,
    active: true,
    description: '30 days of full access to all features.',
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
    featured: !!plan?.featured || String(name).toUpperCase() === 'PREMIUM',
    // If backend doesn't provide features, we still show the canonical list.
    features: formattedFeatures.length > 0 ? formattedFeatures : getDefaultFeaturesForPlan(name),
  };
};

