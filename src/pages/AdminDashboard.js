import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Database,
  LayoutDashboard,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { adminAPI, aiAPI, publicAPI, subscriptionAPI } from '../services/api';
import { useAuth } from '../utils/AuthContext';
import { useToast } from '../components/ToastProvider';
import Navbar from '../components/Navbar';
import './AdminDashboard.css';

const PAGE_SIZE = {
  users: 8,
  plans: 6,
  tenants: 8,
};

const DEFAULT_PLAN = {
  name: '',
  price: '',
  duration: '30',
  features: '',
};

const TAB_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'tenants', label: 'Tenants', icon: Building2 },
  { id: 'plans', label: 'Plans', icon: CreditCard },
  { id: 'users', label: 'Users', icon: Users },
];

const premiumEase = [0.22, 1, 0.36, 1];

const containerMotion = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.42,
      ease: premiumEase,
      when: 'beforeChildren',
      staggerChildren: 0.07,
    },
  },
  exit: { opacity: 0, y: -12, transition: { duration: 0.22 } },
};

const sectionMotion = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.36, ease: premiumEase },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const staggerSectionMotion = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.36,
      ease: premiumEase,
      when: 'beforeChildren',
      staggerChildren: 0.06,
      delayChildren: 0.02,
    },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const cardMotion = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: premiumEase },
  },
};

const subtleCardHover = {
  y: -4,
  scale: 1.012,
  transition: { duration: 0.2, ease: premiumEase },
};

const summaryCardHover = {
  y: -6,
  scale: 1.014,
  rotateX: -2,
  rotateY: 2,
  transformPerspective: 1200,
  transition: { duration: 0.2, ease: premiumEase },
};

const buttonTapMotion = { scale: 0.985 };

const compactNumber = new Intl.NumberFormat('en-IN', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

const formatCurrency = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return 'Rs 0';

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
};

const formatCompact = (value) => compactNumber.format(Number(value || 0));

const formatDate = (value) => {
  if (!value) return 'No date';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'No date';

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

const toTitleCase = (value) =>
  String(value || '')
    .trim()
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');

const humanizeKey = (key) =>
  toTitleCase(
    String(key || '')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\./g, ' ')
  );

const isActiveValue = (value) => ['ACTIVE', 'ENABLED', 'HEALTHY'].includes(String(value || '').toUpperCase());

const getStatusText = (value) => {
  if (!value) return 'Unknown';
  return humanizeKey(value);
};

const getStatusTone = (value) => {
  const status = String(value || '').toUpperCase();

  if (['ACTIVE', 'ENABLED', 'HEALTHY', 'SUCCESS', 'CONNECTED'].includes(status)) {
    return 'success';
  }

  if (['TRIAL', 'PENDING', 'DRAFT', 'PROCESSING', 'SYNCING'].includes(status)) {
    return 'warning';
  }

  if (['INACTIVE', 'DISABLED', 'BLOCKED', 'FAILED', 'ERROR', 'EXPIRED'].includes(status)) {
    return 'danger';
  }

  return 'neutral';
};

const getPlanDuration = (plan) => {
  const explicitDuration = Number(plan?.durationInDays ?? plan?.duration);
  if (Number.isFinite(explicitDuration) && explicitDuration > 0) {
    return explicitDuration;
  }

  return String(plan?.billingCycle || '').toUpperCase() === 'YEARLY' ? 365 : 30;
};

const getCadenceLabel = (days) => {
  if (days >= 365) return 'year';
  if (days >= 90) return `${days} days`;
  return 'month';
};

const getPlanStatus = (plan) => {
  if (typeof plan?.active === 'boolean') {
    return plan.active ? 'ACTIVE' : 'INACTIVE';
  }

  if (plan?.status) {
    return String(plan.status).toUpperCase();
  }

  return 'ACTIVE';
};

const getEntityName = (entity, fallback = 'Untitled record') =>
  entity?.tenantName ||
  entity?.companyName ||
  entity?.organizationName ||
  entity?.name ||
  entity?.userName ||
  entity?.fullName ||
  fallback;

const getEntityEmail = (entity) =>
  entity?.email || entity?.ownerEmail || entity?.adminEmail || entity?.contactEmail || 'No email';

const getCollectionState = (response) => {
  const candidates = [response?.data?.data, response?.data, response];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return {
        items: candidate,
        totalPages: candidate.length ? 1 : 0,
        totalElements: candidate.length,
      };
    }

    if (candidate && typeof candidate === 'object') {
      const collection =
        candidate.content ??
        candidate.items ??
        candidate.results ??
        candidate.plans ??
        candidate.data;

      if (Array.isArray(collection)) {
        return {
          items: collection,
          totalPages: Number(candidate.totalPages || candidate.pages || (collection.length ? 1 : 0)),
          totalElements: Number(candidate.totalElements || candidate.total || candidate.count || collection.length),
        };
      }
    }
  }

  return {
    items: [],
    totalPages: 0,
    totalElements: 0,
  };
};

const mergeUniqueStrings = (...values) =>
  [...new Set(values.flat().map((value) => String(value || '').trim()).filter(Boolean))];

const getDefaultPlanFeatureList = (planName) => {
  const key = String(planName || '').trim().toLowerCase();

  if (key === 'starter') {
    return ['Core API access', 'Workspace controls', 'Email support', 'Monthly usage insights'];
  }

  if (key === 'pro' || key === 'growth' || key === 'growth plus') {
    return ['Higher usage limits', 'Priority support', 'Advanced analytics', 'Automation workflows'];
  }

  if (key === 'enterprise' || key === 'enterprise guard') {
    return ['SSO and governance', 'Dedicated support', 'Custom onboarding', 'Executive reviews'];
  }

  return ['API access', 'Admin visibility', 'Plan controls', 'Billing coverage'];
};

const getPlanFeatureList = (plan) => {
  const featureSource = plan?.featureList ?? plan?.features ?? plan?.capabilities ?? plan?.highlights ?? '';

  if (Array.isArray(featureSource)) {
    const normalized = mergeUniqueStrings(
      featureSource.map((item) => (typeof item === 'string' ? item : item?.text || item?.name || item?.label))
    );
    return normalized.length ? normalized : getDefaultPlanFeatureList(plan?.name);
  }

  if (typeof featureSource === 'string') {
    const normalized = mergeUniqueStrings(featureSource.split(/[,\n]/));
    return normalized.length ? normalized : getDefaultPlanFeatureList(plan?.name);
  }

  return getDefaultPlanFeatureList(plan?.name);
};

const normalizePlatformPlan = (plan, fallbackIndex = 0) => {
  const id = plan?.id ?? plan?.planId ?? plan?.enginePlanId ?? `plan-${fallbackIndex}`;
  const name = toTitleCase(plan?.name || plan?.planName || plan?.title || `Plan ${fallbackIndex + 1}`);
  const active =
    typeof plan?.active === 'boolean'
      ? plan.active
      : isActiveValue(plan?.status || plan?.planStatus || plan?.state || 'ACTIVE');
  const status = active ? 'ACTIVE' : String(plan?.status || plan?.planStatus || 'INACTIVE').toUpperCase();
  const duration = getPlanDuration(plan);
  const features = getPlanFeatureList(plan);

  return {
    ...plan,
    id,
    name,
    active,
    status,
    durationInDays: duration,
    price: Number(plan?.price ?? plan?.amount ?? plan?.monthlyPrice ?? 0),
    description:
      plan?.description ||
      `Billed every ${duration} days with ${active ? 'active' : 'inactive'} visibility in the platform catalog.`,
    featureList: features,
    featuresText: features.join(', '),
  };
};

const getPlanCatalogKey = (plan) => {
  if (plan?.id !== undefined && plan?.id !== null) return `id:${plan.id}`;
  return `name:${String(plan?.name || '').trim().toLowerCase()}`;
};

const mergePlanCatalogs = (enginePlans, publicPlans) => {
  const merged = new Map();

  [...publicPlans, ...enginePlans].forEach((rawPlan, index) => {
    const plan = normalizePlatformPlan(rawPlan, index);
    const key = getPlanCatalogKey(plan);
    const current = merged.get(key);

    if (!current) {
      merged.set(key, plan);
      return;
    }

    const featureList = mergeUniqueStrings(current.featureList, plan.featureList);
    merged.set(key, {
      ...current,
      ...plan,
      active: typeof plan.active === 'boolean' ? plan.active : current.active,
      featureList,
      featuresText: featureList.join(', '),
      description: plan.description || current.description,
      price: Number.isFinite(Number(plan.price)) && Number(plan.price) > 0 ? Number(plan.price) : current.price,
    });
  });

  return Array.from(merged.values()).sort((left, right) => Number(right?.price || 0) - Number(left?.price || 0));
};

const matchesSearch = (query, values) => {
  const normalized = String(query || '').trim().toLowerCase();
  if (!normalized) return true;

  return values.some((value) => String(value || '').toLowerCase().includes(normalized));
};

const extractSuggestionList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];

  const collectionKeys = ['plans', 'recommendedPlans', 'recommendations', 'suggestions', 'tiers', 'data'];

  for (const key of collectionKeys) {
    if (Array.isArray(payload[key])) {
      return payload[key];
    }
  }

  return [payload];
};

const normalizeSuggestion = (item, index, description) => {
  const defaultPrices = [499, 1499, 3999];
  const name =
    item?.name ||
    item?.tierName ||
    item?.title ||
    `${description.toLowerCase().includes('enterprise') ? 'Enterprise' : 'Growth'} ${index + 1}`;

  const price = Number(item?.price ?? item?.amount ?? item?.monthlyPrice ?? defaultPrices[index] ?? 999);
  const duration = Number(
    item?.duration ??
      item?.durationInDays ??
      (String(item?.billingCycle || '').toUpperCase() === 'YEARLY' ? 365 : 30)
  );
  const featureSource = item?.features ?? item?.capabilities ?? item?.highlights ?? item?.featureList ?? '';

  return {
    name: toTitleCase(name),
    price: Number.isFinite(price) ? price : 999,
    duration: Number.isFinite(duration) && duration > 0 ? duration : 30,
    description:
      item?.description ||
      item?.summary ||
      item?.rationale ||
      'Generated to fit the business context provided in your prompt.',
    features: Array.isArray(featureSource) ? featureSource.join(', ') : String(featureSource || ''),
  };
};

const buildFallbackSuggestions = (description) => {
  const prompt = String(description || '').toLowerCase();
  const complianceHeavy = /health|finance|bank|security|compliance|hipaa|soc2|gdpr/.test(prompt);
  const largeScale = /enterprise|global|b2b|multi-tenant|saas|platform|marketplace/.test(prompt);

  return [
    {
      name: 'Starter Launch',
      price: complianceHeavy ? 999 : 499,
      duration: 30,
      description: 'A low-friction entry plan for onboarding early customers quickly.',
      features: complianceHeavy
        ? 'Secure onboarding, audit trail, email support'
        : 'Core access, email support, monthly insights',
    },
    {
      name: largeScale ? 'Growth Control' : 'Growth Plus',
      price: complianceHeavy ? 2499 : 1499,
      duration: 30,
      description: 'Balanced pricing for teams that need stronger automation and better support.',
      features: complianceHeavy
        ? 'Role-based access, logs, SLA support, advanced analytics'
        : 'Automation, role access, API reporting, priority support',
    },
    {
      name: 'Enterprise Guard',
      price: largeScale ? 6999 : 4999,
      duration: 365,
      description: 'High-trust annual tier for custom deployments and executive support.',
      features: complianceHeavy
        ? 'SSO, compliance reviews, dedicated manager, yearly governance review'
        : 'SSO, custom onboarding, premium support, strategic reviews',
    },
  ];
};

const StatusBadge = ({ value }) => (
  <span className={`admin-status admin-status--${getStatusTone(value)}`}>{getStatusText(value)}</span>
);

const SummaryCard = ({ icon: Icon, label, value, helper, tone }) => (
  <motion.article
    variants={cardMotion}
    whileHover={summaryCardHover}
    whileTap={buttonTapMotion}
    className={`admin-summary-card admin-summary-card--${tone}`}
  >
    <div className="admin-summary-card__head">
      <span className="admin-summary-card__icon">
        <Icon size={18} />
      </span>
      <div className="admin-summary-card__head-copy">
        <span className="admin-summary-card__label">{label}</span>
        <span className="admin-summary-card__badge">Live</span>
      </div>
    </div>
    <div className="admin-summary-card__value">{value}</div>
    <p className="admin-summary-card__helper">{helper}</p>
  </motion.article>
);

const PaginationControls = ({ currentPage, totalPages, onChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className="admin-pagination">
      <button
        type="button"
        className="admin-pagination__button"
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage <= 0}
      >
        <ChevronLeft size={16} />
        Previous
      </button>
      <span className="admin-pagination__meta">
        Page {currentPage + 1} of {totalPages}
      </span>
      <button
        type="button"
        className="admin-pagination__button"
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

const SearchField = ({ value, onChange, placeholder }) => (
  <label className="admin-search">
    <Search size={16} />
    <input value={value} onChange={onChange} placeholder={placeholder} />
  </label>
);

const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="admin-empty-state">
    <span className="admin-empty-state__icon">
      <Icon size={22} />
    </span>
    <h3>{title}</h3>
    <p>{description}</p>
    {action}
  </div>
);

const AdminFooter = ({ syncedAt }) => (
  <footer className="admin-footer">
    <span>Admin workspace</span>
    <span>{syncedAt ? `Updated ${syncedAt}` : 'Waiting for data'}</span>
  </footer>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [booting, setBooting] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);

  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  const [metrics, setMetrics] = useState({
    usersTotal: 0,
    plansTotal: 0,
    tenantsTotal: 0,
    catalogValue: 0,
  });

  const [pages, setPages] = useState({
    users: 0,
    plans: 0,
    tenants: 0,
  });

  const [totalPages, setTotalPages] = useState({
    users: 0,
    plans: 0,
    tenants: 0,
  });

  const [search, setSearch] = useState({
    users: '',
    plans: '',
    tenants: '',
  });

  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [submittingPlan, setSubmittingPlan] = useState(false);
  const [planActionId, setPlanActionId] = useState(null);

  const [newPlan, setNewPlan] = useState(DEFAULT_PLAN);
  const [aiDescription, setAiDescription] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      if (!booting) {
        setRefreshing(true);
      }

      const [usersRes, plansRes, publicPlansRes, tenantsRes, analyticsRes] = await Promise.all([
        adminAPI.getAllUsers(pages.users, PAGE_SIZE.users),
        subscriptionAPI.getAllPlans(pages.plans, PAGE_SIZE.plans).catch(() => ({ data: { data: [] } })),
        publicAPI.getAllPlans(0, PAGE_SIZE.plans * 4).catch(() => ({ data: { data: [] } })),
        adminAPI.getTenants(pages.tenants, PAGE_SIZE.tenants),
        aiAPI.getAnalytics().catch(() => ({ data: { data: null } })),
      ]);

      const usersData = getCollectionState(usersRes);
      const plansData = getCollectionState(plansRes);
      const publicPlansData = getCollectionState(publicPlansRes);
      const tenantsData = getCollectionState(tenantsRes);

      const nextUsers = Array.isArray(usersData.items) ? usersData.items : [];
      const nextPlans = mergePlanCatalogs(plansData.items, publicPlansData.items);
      const nextTenants = Array.isArray(tenantsData.items) ? tenantsData.items : [];
      const nextAnalytics = analyticsRes.data?.data || null;

      setUsers(nextUsers);
      setPlans(nextPlans);
      setTenants(nextTenants);
      setAnalytics(nextAnalytics);

      setTotalPages({
        users: Number(usersData.totalPages || 0),
        plans: Number(plansData.totalPages || (nextPlans.length ? 1 : 0)),
        tenants: Number(tenantsData.totalPages || 0),
      });

      setMetrics({
        usersTotal: Number(usersData.totalElements || nextUsers.length || 0),
        plansTotal: Number(Math.max(plansData.totalElements || 0, publicPlansData.totalElements || 0, nextPlans.length)),
        tenantsTotal: Number(tenantsData.totalElements || nextTenants.length || 0),
        catalogValue: nextPlans.reduce((sum, plan) => sum + Number(plan?.price || 0), 0),
      });

      setLastSyncedAt(new Date());
    } catch (error) {
      toast.error('Dashboard sync failed', 'We could not load the latest admin data.');
    } finally {
      setBooting(false);
      setRefreshing(false);
    }
  }, [booting, pages, toast]);

  useEffect(() => {
    if (!user) return;

    if (user.role !== 'ROLE_SUPER_ADMIN') {
      navigate('/dashboard', { replace: true });
      return;
    }

    fetchData();
  }, [fetchData, navigate, user]);

  const handleRefresh = async () => {
    await fetchData();
    toast.success('Dashboard refreshed', 'The control plane is showing the latest available data.');
  };

  const handleCreatePlan = async (event) => {
    event.preventDefault();

    const price = Number(newPlan.price);
    const duration = Number(newPlan.duration);

    if (!newPlan.name.trim()) {
      toast.error('Missing plan name', 'Give the plan a clear name before saving it.');
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      toast.error('Invalid price', 'Plan price must be zero or a positive number.');
      return;
    }

    if (!Number.isFinite(duration) || duration <= 0) {
      toast.error('Invalid duration', 'Duration needs to be a positive number of days.');
      return;
    }

    try {
      setSubmittingPlan(true);
      await adminAPI.createPlan({
        name: newPlan.name.trim(),
        price,
        duration,
      });

      toast.success('Plan created', `${newPlan.name.trim()} is now available in your catalog.`);
      setShowCreatePlan(false);
      setNewPlan(DEFAULT_PLAN);
      setAiSuggestions([]);
      setAiDescription('');
      await fetchData();
      setActiveTab('plans');
    } catch (error) {
      toast.error('Plan creation failed', 'The server rejected that plan configuration.');
    } finally {
      setSubmittingPlan(false);
    }
  };

  const handleTogglePlan = async (plan) => {
    const nextAction = isActiveValue(getPlanStatus(plan)) ? 'deactivate' : 'activate';

    try {
      setPlanActionId(plan.id);
      if (nextAction === 'activate') {
        await adminAPI.activatePlan(plan.id);
      } else {
        await adminAPI.deactivatePlan(plan.id);
      }

      toast.success(
        `Plan ${nextAction}d`,
        `${getEntityName(plan, 'Selected plan')} was ${nextAction}d successfully.`
      );
      await fetchData();
    } catch (error) {
      toast.error('Plan update failed', `We could not ${nextAction} that plan right now.`);
    } finally {
      setPlanActionId(null);
    }
  };

  const handleDeletePlan = async (plan) => {
    if (!plan?.id) return;

    const confirmed = window.confirm(`Delete ${getEntityName(plan, 'this plan')}? This cannot be undone.`);
    if (!confirmed) return;

    try {
      setPlanActionId(plan.id);
      await adminAPI.deletePlan(plan.id);
      toast.success('Plan deleted', `${getEntityName(plan, 'The plan')} was removed from the catalog.`);
      await fetchData();
    } catch (error) {
      toast.error('Delete failed', 'The plan could not be removed.');
    } finally {
      setPlanActionId(null);
    }
  };

  const runAiAnalysis = async () => {
    if (!aiDescription.trim()) {
      toast.info('Add some context', 'Describe the business or market before generating plans.');
      return;
    }

    setAiLoading(true);

    try {
      const response = await aiAPI.generatePlans(aiDescription.trim());
      const payload = response.data?.data ?? response.data;
      const suggestions = extractSuggestionList(payload)
        .map((item, index) => normalizeSuggestion(item, index, aiDescription))
        .filter((item) => item.name);

      if (!suggestions.length) {
        throw new Error('No suggestions returned');
      }

      setAiSuggestions(suggestions.slice(0, 3));
      toast.success('Drafts ready', 'Select a suggestion to prefill the plan form.');
    } catch (error) {
      setAiSuggestions(buildFallbackSuggestions(aiDescription));
      toast.warning(
        'Using a smart fallback',
        'The AI endpoint was unavailable, so local plan drafts were prepared instead.'
      );
    } finally {
      setAiLoading(false);
    }
  };

  const applySuggestion = (suggestion) => {
    setNewPlan({
      name: suggestion.name,
      price: String(suggestion.price),
      duration: String(suggestion.duration),
      features: suggestion.features,
    });
    setShowAiModal(false);
    setShowCreatePlan(true);
    setActiveTab('plans');
  };

  const handlePageChange = (tab, nextPage) => {
    setPages((previous) => ({
      ...previous,
      [tab]: Math.max(0, nextPage),
    }));
  };

  const filteredUsers = users.filter((item) =>
    matchesSearch(search.users, [getEntityName(item, 'User'), getEntityEmail(item), item?.role, item?.status])
  );

  const filteredPlans = plans.filter((item) =>
    matchesSearch(search.plans, [
      getEntityName(item, 'Plan'),
      item?.description,
      item?.price,
      getPlanStatus(item),
      item?.featuresText,
    ])
  );

  const filteredTenants = tenants.filter((item) =>
    matchesSearch(search.tenants, [
      getEntityName(item, 'Tenant'),
      getEntityEmail(item),
      item?.status,
      item?.currentPlan,
    ])
  );

  const activePlansCount = plans.filter((plan) => isActiveValue(getPlanStatus(plan))).length;
  const flaggedUsersCount = users.filter((item) => !isActiveValue(item?.status)).length;
  const attentionCount = flaggedUsersCount + Math.max(plans.length - activePlansCount, 0);

  const analyticsPairs =
    analytics && typeof analytics === 'object'
      ? Object.entries(analytics).filter(([, value]) => ['string', 'number'].includes(typeof value)).slice(0, 4)
      : [];

  const sortedPlans = [...plans].sort((left, right) => Number(right?.price || 0) - Number(left?.price || 0));
  const topPlanValue = Number(sortedPlans[0]?.price || 0) || 1;

  const activityFeed = [
    ...tenants.slice(0, 2).map((tenant) => ({
      title: `${getEntityName(tenant, 'Tenant')} synced`,
      detail: `${getEntityEmail(tenant)} is visible in the tenant registry.`,
      time: formatDate(tenant?.createdAt),
      tone: getStatusTone(tenant?.status || 'ACTIVE'),
    })),
    ...users.slice(0, 2).map((account) => ({
      title: `${getEntityName(account, 'User')} checked`,
      detail: `${getEntityEmail(account)} is ${getStatusText(account?.status)}.`,
      time: getStatusText(account?.role || 'member'),
      tone: getStatusTone(account?.status),
    })),
    ...plans.slice(0, 2).map((plan) => ({
      title: `${getEntityName(plan, 'Plan')} catalog entry`,
      detail: `${formatCurrency(plan?.price)} / ${getCadenceLabel(getPlanDuration(plan))}`,
      time: getStatusText(getPlanStatus(plan)),
      tone: getStatusTone(getPlanStatus(plan)),
    })),
  ].slice(0, 6);

  const lastSyncedLabel = lastSyncedAt
    ? lastSyncedAt.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })
    : 'Not synced yet';

  const attentionTitle =
    attentionCount === 0 ? 'Everything looks healthy' : `${attentionCount} item${attentionCount === 1 ? '' : 's'} need review`;
  const attentionMessage =
    attentionCount === 0
      ? 'No urgent issues are visible in the current data window.'
      : 'Inactive plans and account issues are visible in the current page window.';

  const renderOverview = () => (
    <motion.div
      key="overview"
      variants={containerMotion}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="admin-tab-content"
    >
      <motion.section className="admin-hero" variants={sectionMotion} whileHover={{ y: -2, transition: { duration: 0.2 } }}>
        <div className="admin-hero__ambient" aria-hidden="true">
          <span className="admin-hero__glow admin-hero__glow--primary" />
          <span className="admin-hero__glow admin-hero__glow--secondary" />
          <span className="admin-hero__grid" />
        </div>

        <div className="admin-hero__copy">
          <span className="admin-eyebrow">Admin Overview</span>
          <h1>Platform control, without the clutter.</h1>
          <p>Track tenants, users, pricing, and live platform signals from one calmer admin surface.</p>

          <div className="admin-hero__chips">
            <span className="admin-chip">
              <ShieldCheck size={14} />
              Signed in: {user?.email || 'super admin'}
            </span>
            <span className="admin-chip">
              <Database size={14} />
              Last sync {lastSyncedLabel}
            </span>
            <span className={`admin-chip admin-chip--${analytics ? 'success' : 'warning'}`}>
              <BrainCircuit size={14} />
              {analytics ? 'AI insights live' : 'AI insights fallback'}
            </span>
          </div>
        </div>

        <div className="admin-hero__aside">
          <div className="admin-hero__actions">
            <button type="button" className="admin-button admin-button--primary" onClick={() => setShowCreatePlan(true)}>
              <Plus size={16} />
              New plan
            </button>
            <button type="button" className="admin-button admin-button--secondary" onClick={() => setShowAiModal(true)}>
              <Sparkles size={16} />
              Plan ideas
            </button>
            <button
              type="button"
              className="admin-button admin-button--ghost"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? <Loader2 size={16} className="admin-spin" /> : <RefreshCw size={16} />}
              Refresh data
            </button>
          </div>

          <div className="admin-hero__meta">
            <div className="admin-hero__meta-card">
              <span>Attention</span>
              <strong>{attentionCount}</strong>
              <small>items in the current view</small>
            </div>
            <div className="admin-hero__meta-card">
              <span>Active plans</span>
              <strong>{activePlansCount}</strong>
              <small>live catalog entries</small>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.div className="admin-summary-grid" variants={staggerSectionMotion}>
        <SummaryCard
          icon={Users}
          label="Platform users"
          value={formatCompact(metrics.usersTotal)}
          helper="Registered accounts across the current dataset."
          tone="blue"
        />
        <SummaryCard
          icon={Building2}
          label="Live tenants"
          value={formatCompact(metrics.tenantsTotal)}
          helper="Organizations visible from the tenant registry."
          tone="emerald"
        />
        <SummaryCard
          icon={CreditCard}
          label="Published plans"
          value={formatCompact(metrics.plansTotal)}
          helper="Catalog entries available to admins right now."
          tone="amber"
        />
        <SummaryCard
          icon={Zap}
          label="Catalog value"
          value={formatCurrency(metrics.catalogValue)}
          helper="Visible plan value from the current data page."
          tone="violet"
        />
      </motion.div>

      <div className="admin-overview-grid">
        <motion.section className="admin-panel admin-panel--interactive" variants={sectionMotion} whileHover={subtleCardHover}>
          <div className="admin-panel__header">
            <div>
              <span className="admin-panel__eyebrow">Pricing</span>
              <h2>Plan snapshot</h2>
            </div>
            <button type="button" className="admin-inline-link" onClick={() => setActiveTab('plans')}>
              Manage plans
              <ArrowRight size={14} />
            </button>
          </div>

          {sortedPlans.length ? (
            <div className="admin-spectrum">
              {sortedPlans.slice(0, 4).map((plan) => {
                const price = Number(plan?.price || 0);
                const barWidth = `${Math.max((price / topPlanValue) * 100, 12)}%`;

                return (
                  <div key={plan.id || plan.name} className="admin-spectrum__row">
                    <div className="admin-spectrum__info">
                      <strong>{getEntityName(plan, 'Plan')}</strong>
                      <span>{getPlanDuration(plan)} day billing window</span>
                    </div>
                    <div className="admin-spectrum__bar">
                      <span style={{ width: barWidth }} />
                    </div>
                    <div className="admin-spectrum__value">{formatCurrency(price)}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={CreditCard}
              title="No plans loaded"
              description="Create your first plan to start building out the catalog."
              action={
                <button type="button" className="admin-button admin-button--primary" onClick={() => setShowCreatePlan(true)}>
                  <Plus size={16} />
                  Create first plan
                </button>
              }
            />
          )}
        </motion.section>

        <motion.section className="admin-panel admin-panel--interactive" variants={sectionMotion} whileHover={subtleCardHover}>
          <div className="admin-panel__header">
            <div>
              <span className="admin-panel__eyebrow">Health</span>
              <h2>Platform status</h2>
            </div>
          </div>

          <div className="admin-signal-grid">
            <div className="admin-signal-card">
              <span>Attention queue</span>
              <strong>{attentionCount}</strong>
              <p>Inactive plans and flagged user statuses in the current window.</p>
            </div>
            <div className="admin-signal-card">
              <span>Plan health</span>
              <strong>
                {activePlansCount}/{plans.length || 0}
              </strong>
              <p>Plans currently marked active inside the visible page.</p>
            </div>
            <div className="admin-signal-card">
              <span>AI telemetry</span>
              <strong>{analytics ? 'Online' : 'Fallback'}</strong>
              <p>Analytics endpoint connection state for admin-side insights.</p>
            </div>
          </div>

          {analyticsPairs.length ? (
            <div className="admin-metric-list">
              {analyticsPairs.map(([key, value]) => (
                <div key={key} className="admin-metric-list__item">
                  <span>{humanizeKey(key)}</span>
                  <strong>{typeof value === 'number' ? formatCompact(value) : String(value)}</strong>
                </div>
              ))}
            </div>
          ) : (
            <div className="admin-panel__hint">
              Live AI metrics are not available right now. The dashboard is falling back to the core platform data.
            </div>
          )}
        </motion.section>

        <motion.section className="admin-panel admin-panel--tall admin-panel--interactive" variants={sectionMotion} whileHover={subtleCardHover}>
          <div className="admin-panel__header">
            <div>
              <span className="admin-panel__eyebrow">Recent Changes</span>
              <h2>Latest updates</h2>
            </div>
            <button type="button" className="admin-inline-link" onClick={() => setActiveTab('tenants')}>
              Open tenant list
              <ArrowRight size={14} />
            </button>
          </div>

          {activityFeed.length ? (
            <div className="admin-feed">
              {activityFeed.map((item, index) => (
                <div key={`${item.title}-${index}`} className="admin-feed__item">
                  <span className={`admin-feed__dot admin-feed__dot--${item.tone}`} />
                  <div className="admin-feed__body">
                    <strong>{item.title}</strong>
                    <p>{item.detail}</p>
                  </div>
                  <span className="admin-feed__time">{item.time}</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Database}
              title="Waiting for activity"
              description="Once tenants, users, or plans load in, this feed will start showing recent signals."
            />
          )}
        </motion.section>
      </div>
    </motion.div>
  );

  const renderTenants = () => (
    <motion.div
      key="tenants"
      variants={containerMotion}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="admin-tab-content"
    >
      <motion.section className="admin-panel" variants={sectionMotion}>
        <div className="admin-panel__header admin-panel__header--stack">
          <div>
            <span className="admin-panel__eyebrow">Tenants</span>
            <h2>Organizations</h2>
            <p>Review tenant status, owner information, and plan coverage in one table.</p>
          </div>

          <div className="admin-panel__actions">
            <SearchField
              value={search.tenants}
              onChange={(event) => setSearch((previous) => ({ ...previous, tenants: event.target.value }))}
              placeholder="Search organization, email, or plan"
            />
          </div>
        </div>

        {filteredTenants.length ? (
          <div className="admin-table-shell">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tenant</th>
                  <th>Owner</th>
                  <th>Status</th>
                  <th>Plan</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredTenants.map((tenant) => (
                  <tr key={tenant.id || `${tenant.email}-${tenant.name}`}>
                    <td>
                      <div className="admin-table__primary">{getEntityName(tenant, 'Tenant')}</div>
                      <div className="admin-table__secondary">ID #{tenant.id || 'N/A'}</div>
                    </td>
                    <td>
                      <div className="admin-table__primary">{getEntityEmail(tenant)}</div>
                      <div className="admin-table__secondary">{tenant?.contactName || tenant?.adminName || 'Primary admin'}</div>
                    </td>
                    <td>
                      <StatusBadge value={tenant?.status || 'ACTIVE'} />
                    </td>
                    <td>
                      <div className="admin-table__primary">{tenant?.currentPlan || tenant?.planName || 'Not assigned'}</div>
                      <div className="admin-table__secondary">{tenant?.region || 'Default region'}</div>
                    </td>
                    <td>{formatDate(tenant?.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={Building2}
            title="No tenants found"
            description={
              search.tenants
                ? 'Nothing on this page matches your search. Clear the search or try another page.'
                : 'No tenant records were returned by the API.'
            }
            action={
              search.tenants ? (
                <button
                  type="button"
                  className="admin-button admin-button--secondary"
                  onClick={() => setSearch((previous) => ({ ...previous, tenants: '' }))}
                >
                  Clear search
                </button>
              ) : null
            }
          />
        )}

        <PaginationControls
          currentPage={pages.tenants}
          totalPages={totalPages.tenants}
          onChange={(page) => handlePageChange('tenants', page)}
        />
      </motion.section>
    </motion.div>
  );

  const renderPlans = () => (
    <motion.div
      key="plans"
      variants={containerMotion}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="admin-tab-content"
    >
      <motion.section className="admin-panel" variants={sectionMotion}>
        <div className="admin-panel__header admin-panel__header--stack">
          <div>
            <span className="admin-panel__eyebrow">Plans</span>
            <h2>Pricing</h2>
            <p>Create, review, and maintain plans without extra clutter.</p>
          </div>

          <div className="admin-panel__actions">
            <SearchField
              value={search.plans}
              onChange={(event) => setSearch((previous) => ({ ...previous, plans: event.target.value }))}
              placeholder="Search plan name or price"
            />
            <button type="button" className="admin-button admin-button--secondary" onClick={() => setShowAiModal(true)}>
              <Sparkles size={16} />
              Plan ideas
            </button>
            <button type="button" className="admin-button admin-button--primary" onClick={() => setShowCreatePlan(true)}>
              <Plus size={16} />
              New plan
            </button>
          </div>
        </div>

        {filteredPlans.length ? (
          <motion.div className="admin-plan-grid" variants={staggerSectionMotion}>
            {filteredPlans.map((plan) => {
              const status = getPlanStatus(plan);
              const planDuration = getPlanDuration(plan);
              const busy = planActionId === plan.id;
              const featureList = Array.isArray(plan?.featureList) ? plan.featureList.slice(0, 4) : [];
              const isPlanActive = isActiveValue(status);

              return (
                <motion.article
                  key={plan.id || plan.name}
                  className={`admin-plan-card ${isPlanActive ? 'admin-plan-card--active' : 'admin-plan-card--inactive'}`}
                  variants={cardMotion}
                  whileHover={subtleCardHover}
                >
                  <span className="admin-plan-card__beam" aria-hidden="true" />

                  <div className="admin-plan-card__top">
                    <div>
                      <div className="admin-plan-card__title">{getEntityName(plan, 'Plan')}</div>
                      <StatusBadge value={status} />
                    </div>
                    <span className="admin-plan-card__price">
                      {formatCurrency(plan?.price)}
                      <small>/ {getCadenceLabel(planDuration)}</small>
                    </span>
                  </div>

                  <p className="admin-plan-card__description">
                    {plan?.description ||
                      `Billed every ${planDuration} days. Use this tier to serve ${isActiveValue(status) ? 'live' : 'draft'} accounts.`}
                  </p>

                  <div className="admin-plan-card__meta">
                    <span>{planDuration} days</span>
                    <span>ID #{plan.id || 'N/A'}</span>
                    <span>{isPlanActive ? 'Visible in infra catalog' : 'Inactive in infra catalog'}</span>
                  </div>

                  <div className="admin-plan-card__statusline">
                    <div className="admin-plan-card__statusmetric">
                      <span>Lifecycle</span>
                      <strong>{isPlanActive ? 'Active' : 'Inactive'}</strong>
                    </div>
                    <div className="admin-plan-card__statusmetric">
                      <span>Catalog state</span>
                      <strong>{isPlanActive ? 'Available for new upgrades' : 'Not available for new upgrades'}</strong>
                    </div>
                  </div>

                  <div className="admin-plan-card__notes">
                    <strong>Infra plan features</strong>
                    {featureList.length ? (
                      <div className="admin-plan-card__featurelist">
                        {featureList.map((feature) => (
                          <div key={`${plan.id}-${feature}`} className="admin-plan-card__feature">
                            <span className="admin-plan-card__feature-dot" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>Feature notes are not currently provided by the backend for this plan.</p>
                    )}
                  </div>

                  <div className="admin-plan-card__actions">
                    <button
                      type="button"
                      className="admin-button admin-button--secondary"
                      onClick={() => handleTogglePlan(plan)}
                      disabled={busy}
                    >
                      {busy ? <Loader2 size={16} className="admin-spin" /> : <CheckCircle2 size={16} />}
                      {isActiveValue(status) ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      type="button"
                      className="admin-button admin-button--danger"
                      onClick={() => handleDeletePlan(plan)}
                      disabled={busy}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        ) : (
          <EmptyState
            icon={CreditCard}
            title="No plans found"
            description={
              search.plans
                ? 'Nothing on this page matches your search. Clear the filter or try another page.'
                : 'No plans were returned by the platform plan APIs.'
            }
            action={
              search.plans ? (
                <button
                  type="button"
                  className="admin-button admin-button--secondary"
                  onClick={() => setSearch((previous) => ({ ...previous, plans: '' }))}
                >
                  Clear search
                </button>
              ) : null
            }
          />
        )}

        <PaginationControls
          currentPage={pages.plans}
          totalPages={totalPages.plans}
          onChange={(page) => handlePageChange('plans', page)}
        />
      </motion.section>
    </motion.div>
  );

  const renderUsers = () => (
    <motion.div
      key="users"
      variants={containerMotion}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="admin-tab-content"
    >
      <motion.section className="admin-panel" variants={sectionMotion}>
        <div className="admin-panel__header admin-panel__header--stack">
          <div>
            <span className="admin-panel__eyebrow">Users</span>
            <h2>Accounts</h2>
            <p>Check access, status, and recent user records with a clearer view.</p>
          </div>

          <div className="admin-panel__actions">
            <SearchField
              value={search.users}
              onChange={(event) => setSearch((previous) => ({ ...previous, users: event.target.value }))}
              placeholder="Search user, email, or role"
            />
          </div>
        </div>

        {filteredUsers.length ? (
          <div className="admin-table-shell">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((account) => (
                  <tr key={account.id || account.email}>
                    <td>
                      <div className="admin-table__primary">{getEntityName(account, 'User')}</div>
                      <div className="admin-table__secondary">ID #{account.id || 'N/A'}</div>
                    </td>
                    <td>{getEntityEmail(account)}</td>
                    <td>{getStatusText(account?.role || 'member')}</td>
                    <td>
                      <StatusBadge value={account?.status || 'ACTIVE'} />
                    </td>
                    <td>{formatDate(account?.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={Users}
            title="No users found"
            description={
              search.users
                ? 'Nothing on this page matches your search. Clear the filter or change pages.'
                : 'No user accounts were returned by the API.'
            }
            action={
              search.users ? (
                <button
                  type="button"
                  className="admin-button admin-button--secondary"
                  onClick={() => setSearch((previous) => ({ ...previous, users: '' }))}
                >
                  Clear search
                </button>
              ) : null
            }
          />
        )}

        <PaginationControls
          currentPage={pages.users}
          totalPages={totalPages.users}
          onChange={(page) => handlePageChange('users', page)}
        />
      </motion.section>
    </motion.div>
  );

  const renderActiveTab = () => {
    if (activeTab === 'tenants') return renderTenants();
    if (activeTab === 'plans') return renderPlans();
    if (activeTab === 'users') return renderUsers();
    return renderOverview();
  };

  if (booting) {
    return (
      <div className="admin-loading-screen">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="admin-loading-card">
          <div className="admin-loading-card__icon">
            <LayoutDashboard size={26} />
            <span className="admin-loading-card__pulse" />
          </div>
          <h2>Loading admin dashboard</h2>
          <p>Preparing the control plane for {user?.email || 'your account'}.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="admin-dashboard">
        <aside className="admin-sidebar">
          <div className="admin-sidebar__section">
            <span className="admin-sidebar__eyebrow">Workspace</span>
            {TAB_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  className={`admin-sidebar__tab ${isActive ? 'is-active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="admin-sidebar__section admin-sidebar__section--callout">
            <span className="admin-sidebar__eyebrow">Status</span>
            <div className={`admin-sidebar__callout ${attentionCount === 0 ? 'admin-sidebar__callout--calm' : ''}`}>
              <AlertTriangle size={18} />
              <div>
                <strong>{attentionTitle}</strong>
                <p>{attentionMessage}</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="admin-main">
          <div className="admin-main__inner">
            <div className="admin-toolbar">
              <div>
                <span className="admin-eyebrow">Platform</span>
                <h1>{TAB_ITEMS.find((item) => item.id === activeTab)?.label || 'Overview'}</h1>
              </div>
              <div className="admin-toolbar__status">
                {refreshing ? <Loader2 size={16} className="admin-spin" /> : <CheckCircle2 size={16} />}
                <span>{refreshing ? 'Refreshing data...' : `Updated ${lastSyncedLabel}`}</span>
              </div>
            </div>

            <AnimatePresence mode="wait">{renderActiveTab()}</AnimatePresence>
          </div>

          <AdminFooter syncedAt={lastSyncedLabel} />
        </main>
      </div>

      <AnimatePresence>
        {showCreatePlan && (
          <div className="admin-modal-backdrop" onClick={() => !submittingPlan && setShowCreatePlan(false)}>
            <motion.div
              className="admin-modal"
              onClick={(event) => event.stopPropagation()}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
            >
              <div className="admin-modal__header">
                <div>
                  <span className="admin-panel__eyebrow">Create Plan</span>
                  <h2>Create a plan</h2>
                </div>
                <button type="button" className="admin-modal__close" onClick={() => setShowCreatePlan(false)}>
                  <X size={18} />
                </button>
              </div>

              <form className="admin-form" onSubmit={handleCreatePlan}>
                <label>
                  <span>Plan name</span>
                  <input
                    value={newPlan.name}
                    onChange={(event) => setNewPlan((previous) => ({ ...previous, name: event.target.value }))}
                    placeholder="Growth Plus"
                  />
                </label>

                <div className="admin-form__row">
                  <label>
                    <span>Price (INR)</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newPlan.price}
                      onChange={(event) => setNewPlan((previous) => ({ ...previous, price: event.target.value }))}
                      placeholder="1499"
                    />
                  </label>

                  <label>
                    <span>Duration (days)</span>
                    <input
                      type="number"
                      min="1"
                      value={newPlan.duration}
                      onChange={(event) => setNewPlan((previous) => ({ ...previous, duration: event.target.value }))}
                      placeholder="30"
                    />
                  </label>
                </div>

                <label>
                  <span>Feature notes</span>
                  <textarea
                    value={newPlan.features}
                    onChange={(event) => setNewPlan((previous) => ({ ...previous, features: event.target.value }))}
                    placeholder="Priority support, role-based access, analytics exports"
                  />
                </label>

                <p className="admin-form__hint">
                  Feature notes are used here for drafting and internal review. The current backend still saves
                  only the plan name, price, and duration.
                </p>

                <div className="admin-modal__footer">
                  <button
                    type="button"
                    className="admin-button admin-button--secondary"
                    onClick={() => setShowCreatePlan(false)}
                    disabled={submittingPlan}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="admin-button admin-button--primary" disabled={submittingPlan}>
                    {submittingPlan ? <Loader2 size={16} className="admin-spin" /> : <Plus size={16} />}
                    Save plan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAiModal && (
          <div className="admin-modal-backdrop" onClick={() => !aiLoading && setShowAiModal(false)}>
            <motion.div
              className="admin-modal admin-modal--wide"
              onClick={(event) => event.stopPropagation()}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
            >
              <div className="admin-modal__header">
                <div>
                  <span className="admin-panel__eyebrow">AI Plan Assistant</span>
                  <h2>Generate plan ideas</h2>
                </div>
                <button type="button" className="admin-modal__close" onClick={() => setShowAiModal(false)}>
                  <X size={18} />
                </button>
              </div>

              <div className="admin-form">
                <label>
                  <span>Business context</span>
                  <textarea
                    value={aiDescription}
                    onChange={(event) => setAiDescription(event.target.value)}
                    placeholder="Example: We are building a multi-tenant compliance platform and need simple, growth, and enterprise pricing."
                    className="admin-form__textarea--tall"
                  />
                </label>

                <div className="admin-modal__footer">
                  <button type="button" className="admin-button admin-button--primary" onClick={runAiAnalysis} disabled={aiLoading}>
                    {aiLoading ? <Loader2 size={16} className="admin-spin" /> : <Sparkles size={16} />}
                    Generate ideas
                  </button>
                </div>

                {aiSuggestions.length > 0 && (
                  <motion.div className="admin-ai-grid" variants={staggerSectionMotion} initial="hidden" animate="visible">
                    {aiSuggestions.map((suggestion) => (
                      <motion.button
                        key={`${suggestion.name}-${suggestion.price}`}
                        type="button"
                        className="admin-ai-card"
                        onClick={() => applySuggestion(suggestion)}
                        variants={cardMotion}
                        whileHover={subtleCardHover}
                        whileTap={buttonTapMotion}
                      >
                        <div className="admin-ai-card__top">
                          <div>
                            <strong>{suggestion.name}</strong>
                            <span>{formatCurrency(suggestion.price)} / {getCadenceLabel(suggestion.duration)}</span>
                          </div>
                          <Sparkles size={18} />
                        </div>
                        <p>{suggestion.description}</p>
                        <div className="admin-ai-card__meta">
                          <span>{suggestion.duration} days</span>
                          <span>{suggestion.features || 'Feature bundle available after selection'}</span>
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminDashboard;
