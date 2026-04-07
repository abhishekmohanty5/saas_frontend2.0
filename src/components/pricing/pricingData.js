export const BILLING_INTERVALS = {
  MONTHLY: 'monthly',
  ANNUAL: 'annual',
};

export const titleCasePlanName = (name) => {
  const trimmed = String(name || '').trim();
  if (!trimmed) return '';
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
};

/**
 * Correct canonical prices — source of truth for the frontend.
 * Even if backend DB still has old values, we override here.
 */
const CANONICAL_PRICES = {
  starter: 499,
  pro: 1499,
  enterprise: 3999,
};

/**
 * Only the KEY differentiating features shown on each card.
 * Base features (JWT, API Keys, Console) are common — only show them once at top,
 * then show the differentiators.
 */
export const getDefaultFeaturesForPlan = (planName) => {
  const key = String(planName || '').trim().toLowerCase();

  if (key === 'free trial' || key === 'free') {
    return [
      { text: '200 API calls / day', included: true },
      { text: '10 end-users per workspace', included: true },
      { text: '2 tenant plans', included: true },
      { text: 'Basic subscription management', included: true },
      { text: 'Email reminders', included: false },
      { text: 'AI analytics & churn prediction', included: false },
      { text: 'AI plan generator', included: false },
      { text: 'SLA guarantee', included: false },
    ];
  }

  if (key === 'starter') {
    return [
      { text: '1,000 API calls / day', included: true },
      { text: '100 end-users per workspace', included: true },
      { text: '3 tenant plans', included: true },
      { text: 'Email reminders', included: true },
      { text: 'AI plan generator (3 uses/month)', included: true },
      { text: 'AI analytics & churn prediction', included: false },
      { text: 'Email support', included: true },
      { text: 'SLA guarantee', included: false },
    ];
  }

  if (key === 'pro') {
    return [
      { text: '10,000 API calls / day', included: true },
      { text: '1,000 end-users per workspace', included: true },
      { text: 'Unlimited tenant plans', included: true },
      { text: 'Email reminders', included: true },
      { text: 'AI analytics & churn prediction', included: true },
      { text: 'AI plan generator (unlimited)', included: true },
      { text: 'Priority email support', included: true },
      { text: '99.5% SLA guarantee', included: true },
    ];
  }

  if (key === 'enterprise') {
    return [
      { text: 'Unlimited API calls / day', included: true },
      { text: 'Unlimited end-users per workspace', included: true },
      { text: 'Unlimited tenant plans', included: true },
      { text: 'Email reminders', included: true },
      { text: 'AI analytics & churn prediction', included: true },
      { text: 'AI plan generator (unlimited)', included: true },
      { text: 'Dedicated support', included: true },
      { text: '99.9% SLA guarantee', included: true },
    ];
  }

  // Default fallback
  return [
    { text: 'API calls / day', included: true },
    { text: 'Subscription management', included: true },
    { text: 'Email support', included: true },
  ];
};

/**
 * Fallback plans — used when backend is unavailable.
 * Always reflects the correct new pricing.
 */
export const DEFAULT_PLANS = [
  {
    id: 'starter-default',
    name: 'Starter',
    price: 499,
    durationInDays: 30,
    active: true,
    description: 'For indie developers & small projects needing professional API infrastructure.',
    features: getDefaultFeaturesForPlan('starter'),
  },
  {
    id: 'pro-default',
    name: 'Pro',
    price: 1499,
    durationInDays: 30,
    active: true,
    featured: true,
    description: 'For growing teams with AI analytics, churn prediction, and higher limits.',
    features: getDefaultFeaturesForPlan('pro'),
  },
  {
    id: 'enterprise-default',
    name: 'Enterprise',
    price: 3999,
    durationInDays: 30,
    active: true,
    description: 'Unlimited scale with dedicated support, 99.9% SLA and full AI suite.',
    features: getDefaultFeaturesForPlan('enterprise'),
  },
];

const getDefaultDescription = (name) => {
  const key = String(name || '').toLowerCase();
  if (key === 'starter') return 'For indie developers and small projects. Includes 5,000 API calls/month, developer dashboard, and essential dashboard CRUD controls.';
  if (key === 'pro') return 'For growing teams. Includes 20,000 API calls/month, full AI analytics, or advanced renewal analytics inside your workspace.';
  if (key === 'enterprise') return 'Unlimited scale with fully interactive dashboard, 100,000 API calls/month, with custom AI churn scoring models for governance.';
  return 'Full access to all modules and dashboards defined.';
};

export const normalizePlanFromBackend = (plan) => {
  const name = titleCasePlanName(plan?.name);
  const key = name.toLowerCase();
  const status = String(plan?.status || plan?.planStatus || '').toUpperCase();
  const active =
    typeof plan?.active === 'boolean'
      ? plan.active
      : !['INACTIVE', 'DISABLED', 'BLOCKED', 'ARCHIVED', 'DELETED'].includes(status);

  // Always use canonical prices — overrides stale DB values
  const canonicalPrice = CANONICAL_PRICES[key];
  const price = canonicalPrice !== undefined ? canonicalPrice : Number.parseFloat(plan?.price);

  return {
    id: plan?.id,
    name,
    price,
    durationInDays: plan?.durationInDays,
    active,
    description: plan?.description || getDefaultDescription(name),
    featured: !!plan?.featured || key === 'pro',
    // Always use our rich feature definitions — backend doesn't store features
    features: getDefaultFeaturesForPlan(name),
  };
};
