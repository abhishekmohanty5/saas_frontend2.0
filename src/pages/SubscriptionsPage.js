import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ConsoleSidebar from '../components/ConsoleSidebar';
import { userSubscriptionAPI } from '../services/api';

/* ─────────────────────────────────────────────────────────
   SUBSCRIPTION MANAGER  –  /subscriptions
   Tabs: All | Active | Upcoming | Stats
───────────────────────────────────────────────────────── */
const CATEGORY_ICONS = {
    entertainment: '🎬', streaming: '📺', music: '🎵', gaming: '🎮',
    fitness: '💪', health: '❤️', news: '📰', software: '💻',
    cloud: '☁️', education: '📚', food: '🍔', shopping: '🛍️',
    default: '📦',
};

const getCategoryIcon = (name) => {
    if (!name) return CATEGORY_ICONS.default;
    const lower = name.toLowerCase();
    return Object.entries(CATEGORY_ICONS).find(([k]) => lower.includes(k))?.[1] ?? CATEGORY_ICONS.default;
};

const SubscriptionsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const sp = new URLSearchParams(location.search);
    const initialTab = sp.get('tab') || 'all';

    const [activeTab, setActiveTab] = useState(initialTab);
    const [subscriptions, setSubscriptions] = useState([]);
    const [activeSubscriptions, setActiveSubscriptions] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [upcomingDays, setUpcomingDays] = useState(7);
    const [stats, setStats] = useState(null);
    const [insights, setInsights] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingSub, setEditingSub] = useState(null);
    const [cancelConfirm, setCancelConfirm] = useState(null);
    const [formError, setFormError] = useState('');
    const [formLoading, setFormLoading] = useState(false);
    const [notification, setNotification] = useState('');

    const emptyForm = {
        subscriptionName: '', amount: '', billingCycle: 'MONTHLY',
        startDate: new Date().toISOString().split('T')[0],
        nextBillingDate: '',
        categoryId: '', notes: '',
    };
    const [form, setForm] = useState(emptyForm);

    /* ── Fetch all data ── */
    const fetchAll = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        try {
            setLoading(true);
            const [allRes, activeRes, upcomingRes, statsRes, insightsRes, catRes] = await Promise.allSettled([
                userSubscriptionAPI.getAllSubscriptions(),
                userSubscriptionAPI.getActiveSubscriptions(),
                userSubscriptionAPI.getUpcomingRenewals(upcomingDays),
                userSubscriptionAPI.getStats(),
                userSubscriptionAPI.getInsights(),
                userSubscriptionAPI.getCategories(),
            ]);
            if (allRes.status === 'fulfilled') setSubscriptions(allRes.value.data?.data || []);
            if (activeRes.status === 'fulfilled') setActiveSubscriptions(activeRes.value.data?.data || []);
            if (upcomingRes.status === 'fulfilled') setUpcoming(upcomingRes.value.data?.data || []);
            if (statsRes.status === 'fulfilled') setStats(statsRes.value.data?.data || null);
            if (insightsRes.status === 'fulfilled') setInsights(insightsRes.value.data?.data || []);
            if (catRes.status === 'fulfilled') setCategories(catRes.value.data?.data || []);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [navigate, upcomingDays]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    /* ── Sync tab from URL ── */
    useEffect(() => {
        const t = new URLSearchParams(location.search).get('tab') || 'all';
        setActiveTab(t);
    }, [location.search]);

    const switchTab = (tab) => {
        setActiveTab(tab);
        navigate(`/subscriptions?tab=${tab}`, { replace: true });
    };

    /* ── Notifications ── */
    const notify = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(''), 3000);
    };

    /* ── Form handlers ── */
    const openAddModal = () => { setEditingSub(null); setForm(emptyForm); setFormError(''); setShowModal(true); };
    const openEditModal = (sub) => {
        setEditingSub(sub);
        setForm({
            subscriptionName: sub.subscriptionName || '',
            amount: sub.amount || '',
            billingCycle: sub.billingCycle || 'MONTHLY',
            startDate: sub.startDate || emptyForm.startDate,
            nextBillingDate: sub.nextBillingDate || '',
            categoryId: sub.subscriptionCategory?.id || '',
            notes: sub.notes || '',
        });
        setFormError('');
        setShowModal(true);
    };
    const closeModal = () => { setShowModal(false); setEditingSub(null); setForm(emptyForm); setFormError(''); };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.subscriptionName.trim() || !form.amount) { setFormError('Name and amount are required.'); return; }
        setFormLoading(true);
        setFormError('');
        try {
            const category = categories.find((c) => String(c.id) === String(form.categoryId));
            const dto = {
                subscriptionName: form.subscriptionName.trim(),
                amount: parseFloat(form.amount),
                billingCycle: form.billingCycle,
                startDate: form.startDate,
                nextBillingDate: form.nextBillingDate || undefined,
                category: category || undefined,
                notes: form.notes || undefined,
            };
            if (editingSub) {
                await userSubscriptionAPI.updateSubscription(editingSub.id, dto);
                notify('✅ Subscription updated successfully!');
            } else {
                await userSubscriptionAPI.createSubscription(dto);
                notify('✅ Subscription added successfully!');
            }
            closeModal();
            fetchAll();
        } catch (err) {
            setFormError(err.response?.data?.message || 'Failed to save. Please try again.');
        } finally {
            setFormLoading(false);
        }
    };

    const confirmCancel = async () => {
        if (!cancelConfirm) return;
        try {
            await userSubscriptionAPI.cancelSubscription(cancelConfirm.id);
            notify('Subscription cancelled.');
            setCancelConfirm(null);
            fetchAll();
        } catch (err) {
            notify('❌ Failed to cancel: ' + (err.response?.data?.message || 'Unknown error'));
            setCancelConfirm(null);
        }
    };

    /* ── Render ── */
    const TABS = [
        { key: 'all', label: 'All', count: subscriptions.length },
        { key: 'active', label: 'Active', count: activeSubscriptions.length },
        { key: 'upcoming', label: 'Upcoming' },
        { key: 'stats', label: 'Stats' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'var(--ff-sans)' }}>
            <ConsoleSidebar />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--cream)', overflow: 'auto' }}>

                {/* Header */}
                <header style={styles.header}>
                    <div>
                        <div style={styles.headerTitle}>My Subscriptions</div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '1px' }}>
                            Manage and track all your recurring subscriptions
                        </div>
                    </div>
                    <button
                        onClick={openAddModal}
                        style={styles.addBtn}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#B8962C'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--gold)'; }}
                    >
                        + Add Subscription
                    </button>
                </header>

                {/* Notification toast */}
                {notification && (
                    <div style={styles.toast}>{notification}</div>
                )}

                <div style={styles.content}>

                    {/* ── Tabs ── */}
                    <div style={styles.tabBar}>
                        {TABS.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => switchTab(tab.key)}
                                style={{
                                    ...styles.tab,
                                    color: activeTab === tab.key ? 'var(--ink)' : 'var(--muted)',
                                    borderBottom: activeTab === tab.key ? '2px solid var(--ink)' : '2px solid transparent',
                                    fontWeight: activeTab === tab.key ? 700 : 500,
                                }}
                            >
                                {tab.label}
                                {tab.count != null && (
                                    <span style={{
                                        ...styles.tabCount,
                                        background: activeTab === tab.key ? 'var(--ink)' : 'var(--sand)',
                                        color: activeTab === tab.key ? '#fff' : 'var(--muted)',
                                    }}>
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* ── Tab content ── */}
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '60px' }}>
                            <div style={spinnerStyle} />
                            <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '16px' }}>Loading subscriptions…</p>
                        </div>
                    ) : (
                        <>
                            {/* ALL tab */}
                            {activeTab === 'all' && (
                                <SubList
                                    subs={subscriptions}
                                    label="No subscriptions yet — add one to get started!"
                                    onEdit={openEditModal}
                                    onCancel={(sub) => setCancelConfirm(sub)}
                                />
                            )}

                            {/* ACTIVE tab */}
                            {activeTab === 'active' && (
                                <SubList
                                    subs={activeSubscriptions}
                                    label="No active subscriptions found."
                                    onEdit={openEditModal}
                                    onCancel={(sub) => setCancelConfirm(sub)}
                                />
                            )}

                            {/* UPCOMING tab */}
                            {activeTab === 'upcoming' && (
                                <div>
                                    {upcoming.length > 0 && (
                                        <div style={styles.warningBanner}>
                                            <span style={{ fontSize: '18px' }}>⚠️</span>
                                            <span>{upcoming.length} subscription{upcoming.length !== 1 ? 's' : ''} renewing in the next {upcomingDays} days</span>
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                        <span style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 500 }}>Show upcoming in</span>
                                        {[7, 14, 30].map((d) => (
                                            <button
                                                key={d}
                                                onClick={() => setUpcomingDays(d)}
                                                style={{
                                                    padding: '5px 14px',
                                                    borderRadius: '20px',
                                                    border: '1px solid var(--sand)',
                                                    background: upcomingDays === d ? 'var(--ink)' : 'transparent',
                                                    color: upcomingDays === d ? '#fff' : 'var(--muted)',
                                                    cursor: 'pointer',
                                                    fontSize: '12px',
                                                    fontWeight: 600,
                                                    fontFamily: 'var(--ff-sans)',
                                                    transition: 'all 0.15s',
                                                }}
                                            >
                                                {d} days
                                            </button>
                                        ))}
                                    </div>
                                    <SubList
                                        subs={upcoming}
                                        label={`No subscriptions renewing in the next ${upcomingDays} days.`}
                                        onEdit={openEditModal}
                                        onCancel={(sub) => setCancelConfirm(sub)}
                                        showRenewal
                                    />
                                </div>
                            )}

                            {/* STATS tab */}
                            {activeTab === 'stats' && (
                                <div>
                                    <div style={styles.statsGrid}>
                                        <StatCard icon="💰" label="Monthly Spend" value={stats?.totalMonthlyCost != null ? `₹${Number(stats.totalMonthlyCost).toLocaleString('en-IN')}` : '₹0'} color="var(--gold)" />
                                        <StatCard icon="✅" label="Active Subscriptions" value={stats?.activeCount ?? 0} color="var(--emerald2)" />
                                        <StatCard icon="📅" label="Upcoming Renewals (7d)" value={upcoming.length} color="var(--sky)" />
                                        <StatCard icon="📦" label="Total Subscriptions" value={subscriptions.length} color="var(--muted)" />
                                    </div>

                                    {insights.length > 0 && (
                                        <div style={styles.section}>
                                            <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span>💡</span> Smart Insights
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                {insights.map((insight, i) => (
                                                    <div key={i} style={styles.insightRow}>
                                                        <span style={{ fontSize: '15px' }}>•</span>
                                                        <span style={{ fontSize: '14px', color: 'var(--ink2)' }}>{insight}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* ── Add / Edit Modal ── */}
            {showModal && (
                <div style={styles.modalBackdrop} onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
                    <div style={styles.modal}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontFamily: 'var(--ff-serif)', fontSize: '22px', fontWeight: 400, color: 'var(--ink)', letterSpacing: '-0.5px' }}>
                                {editingSub ? 'Edit Subscription' : 'Add Subscription'}
                            </h2>
                            <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: 'var(--muted)' }}>✕</button>
                        </div>

                        {formError && <div style={styles.formError}>{formError}</div>}

                        <form onSubmit={handleSubmit}>
                            <div style={styles.formGrid}>
                                <ModalField label="Subscription Name *" name="subscriptionName" placeholder="e.g. Netflix" value={form.subscriptionName} onChange={handleFormChange} />
                                <ModalField label="Amount (₹) *" name="amount" type="number" step="0.01" placeholder="649" value={form.amount} onChange={handleFormChange} />
                                <div>
                                    <label style={modalLabel}>Billing Cycle</label>
                                    <select name="billingCycle" value={form.billingCycle} onChange={handleFormChange} style={selectStyle}>
                                        <option value="WEEKLY">Weekly</option>
                                        <option value="MONTHLY">Monthly</option>
                                        <option value="YEARLY">Yearly</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={modalLabel}>Category</label>
                                    <select name="categoryId" value={form.categoryId} onChange={handleFormChange} style={selectStyle}>
                                        <option value="">Select category</option>
                                        {categories.map((c) => <option key={c.id} value={c.id}>{getCategoryIcon(c.name)} {c.name}</option>)}
                                    </select>
                                </div>
                                <ModalField label="Start Date" name="startDate" type="date" value={form.startDate} onChange={handleFormChange} />
                                <ModalField label="Next Billing Date" name="nextBillingDate" type="date" value={form.nextBillingDate} onChange={handleFormChange} />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={modalLabel}>Notes (optional)</label>
                                <textarea
                                    name="notes"
                                    value={form.notes}
                                    onChange={handleFormChange}
                                    placeholder="Any additional notes…"
                                    rows={3}
                                    style={{ ...selectStyle, resize: 'vertical', fontFamily: 'var(--ff-sans)' }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={closeModal} style={cancelBtnStyle}>Cancel</button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    style={{ ...saveBtnStyle, opacity: formLoading ? 0.7 : 1, cursor: formLoading ? 'wait' : 'pointer' }}
                                >
                                    {formLoading ? 'Saving…' : editingSub ? 'Update Subscription' : 'Add Subscription'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Cancel Confirm Dialog ── */}
            {cancelConfirm && (
                <div style={styles.modalBackdrop}>
                    <div style={{ ...styles.modal, maxWidth: '400px' }}>
                        <div style={{ fontSize: '32px', textAlign: 'center', marginBottom: '16px' }}>⚠️</div>
                        <h3 style={{ textAlign: 'center', fontFamily: 'var(--ff-sans)', fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>
                            Cancel Subscription?
                        </h3>
                        <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '14px', marginBottom: '24px' }}>
                            Are you sure you want to cancel <strong>{cancelConfirm.subscriptionName}</strong>? This action cannot be undone.
                        </p>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <button onClick={() => setCancelConfirm(null)} style={cancelBtnStyle}>Keep it</button>
                            <button
                                onClick={confirmCancel}
                                style={{ ...saveBtnStyle, background: 'var(--rose)' }}
                            >
                                Yes, cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`@keyframes subSpin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

/* ── Sub-components ── */
const SubList = ({ subs, label, onEdit, onCancel, showRenewal }) => {
    if (subs.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)', fontSize: '14px' }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>📭</div>
                {label}
            </div>
        );
    }
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {subs.map((sub) => (
                <SubCard key={sub.id} sub={sub} onEdit={onEdit} onCancel={onCancel} showRenewal={showRenewal} />
            ))}
        </div>
    );
};

const SubCard = ({ sub, onEdit, onCancel, showRenewal }) => {
    const [hover, setHover] = useState(false);
    const isActive = sub.status === 'ACTIVE';
    const icon = getCategoryIcon(sub.subscriptionCategory?.name);

    return (
        <div
            style={{
                ...styles.subCard,
                boxShadow: hover ? '0 4px 16px rgba(0,0,0,0.06)' : '0 1px 4px rgba(0,0,0,0.03)',
                transform: hover ? 'translateY(-1px)' : 'none',
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {/* Left: icon + info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                <div style={styles.subIcon}>{icon}</div>
                <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink)', marginBottom: '2px' }}>
                        {sub.subscriptionName}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                        {sub.subscriptionCategory?.name || 'Other'} · {billingLabel(sub.billingCycle)}
                        {showRenewal && sub.nextBillingDate && (
                            <span style={{ color: 'var(--rose)', fontWeight: 600, marginLeft: '8px' }}>
                                Renews {fmtDate(sub.nextBillingDate)}
                            </span>
                        )}
                        {!showRenewal && sub.nextBillingDate && (
                            <span style={{ marginLeft: '8px' }}>· Next: {fmtDate(sub.nextBillingDate)}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Right: amount + status + actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--ff-serif)', fontSize: '18px', color: 'var(--ink)', letterSpacing: '-0.5px' }}>
                        ₹{Number(sub.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                </div>
                <span style={{
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 700,
                    background: isActive ? 'rgba(45,106,79,0.1)' : 'rgba(0,0,0,0.05)',
                    color: isActive ? 'var(--emerald)' : 'var(--muted)',
                    letterSpacing: '0.3px',
                }}>
                    {sub.status}
                </span>
                <button onClick={() => onEdit(sub)} style={styles.subAction}>Edit</button>
                {isActive && (
                    <button onClick={() => onCancel(sub)} style={{ ...styles.subAction, color: 'var(--rose)', borderColor: 'rgba(181,70,58,0.3)' }}>
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, color }) => (
    <div style={styles.statCard}>
        <span style={{ fontSize: '28px' }}>{icon}</span>
        <span style={{ fontFamily: 'var(--ff-serif)', fontSize: '28px', color, letterSpacing: '-1px', marginTop: '4px' }}>{value}</span>
        <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 500 }}>{label}</span>
    </div>
);

const ModalField = ({ label, name, type = 'text', placeholder, value, onChange, step }) => (
    <div>
        <label style={modalLabel}>{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            step={step}
            style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = 'rgba(201,168,76,0.5)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--sand)'; }}
        />
    </div>
);

/* ── utils ── */
const fmtDate = (str) => {
    if (!str) return '';
    try { return new Date(str).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }); } catch { return str; }
};
const billingLabel = (c) => ({ WEEKLY: 'Weekly', MONTHLY: 'Monthly', YEARLY: 'Yearly' }[c] || c);

/* ── Styles ── */
const modalLabel = { display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px', fontFamily: 'var(--ff-sans)' };
const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--sand)', background: 'var(--white)', fontSize: '14px', fontFamily: 'var(--ff-sans)', color: 'var(--ink)', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' };
const selectStyle = { ...inputStyle, cursor: 'pointer' };
const cancelBtnStyle = { padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--sand)', background: 'transparent', cursor: 'pointer', fontSize: '13px', fontWeight: 600, fontFamily: 'var(--ff-sans)', color: 'var(--ink)', transition: 'background 0.15s' };
const saveBtnStyle = { padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--ink)', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 700, fontFamily: 'var(--ff-sans)', transition: 'background 0.15s' };

const spinnerStyle = {
    width: '36px', height: '36px',
    border: '3px solid var(--sand)', borderTopColor: 'var(--gold)',
    borderRadius: '50%', margin: '0 auto',
    animation: 'subSpin 0.8s linear infinite',
};

const styles = {
    header: {
        height: '64px', background: 'var(--ink)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', flexShrink: 0,
    },
    headerTitle: { fontFamily: 'var(--ff-sans)', fontSize: '15px', fontWeight: 700, color: 'rgba(255,255,255,0.9)' },
    addBtn: {
        padding: '9px 18px', borderRadius: '8px', border: 'none',
        background: 'var(--gold)', color: 'var(--ink)',
        fontSize: '13px', fontWeight: 700, fontFamily: 'var(--ff-sans)',
        cursor: 'pointer', transition: 'background 0.15s',
    },
    toast: {
        position: 'fixed', top: '20px', right: '20px',
        background: 'var(--ink)', color: '#fff',
        padding: '12px 20px', borderRadius: '10px',
        fontSize: '13px', fontWeight: 600, fontFamily: 'var(--ff-sans)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)', zIndex: 9999,
    },
    content: { padding: '28px 32px', flex: 1 },
    tabBar: {
        display: 'flex', gap: '0', marginBottom: '24px',
        borderBottom: '1px solid var(--sand)',
    },
    tab: {
        padding: '10px 20px', background: 'none', border: 'none',
        cursor: 'pointer', fontSize: '13px', fontFamily: 'var(--ff-sans)',
        display: 'flex', alignItems: 'center', gap: '6px',
        transition: 'all 0.15s', marginBottom: '-1px',
    },
    tabCount: {
        fontSize: '11px', fontWeight: 700, padding: '2px 7px',
        borderRadius: '12px', transition: 'all 0.15s',
    },
    warningBanner: {
        display: 'flex', alignItems: 'center', gap: '10px',
        background: 'rgba(232,154,60,0.1)', border: '1px solid rgba(232,154,60,0.3)',
        borderRadius: '10px', padding: '12px 16px', marginBottom: '16px',
        fontSize: '14px', fontWeight: 600, color: '#E89A3C',
    },
    subCard: {
        background: 'var(--white)', border: '1px solid var(--sand)', borderRadius: '12px',
        padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'all 0.15s',
    },
    subIcon: {
        width: '42px', height: '42px', borderRadius: '10px',
        background: 'var(--cream)', border: '1px solid var(--sand)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '20px', flexShrink: 0,
    },
    subAction: {
        padding: '6px 14px', borderRadius: '7px',
        border: '1px solid var(--sand)', background: 'transparent',
        cursor: 'pointer', fontSize: '12px', fontWeight: 600,
        fontFamily: 'var(--ff-sans)', color: 'var(--ink)', transition: 'all 0.15s',
    },
    statsGrid: {
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px', marginBottom: '24px',
    },
    statCard: {
        background: 'var(--white)', border: '1px solid var(--sand)', borderRadius: '14px',
        padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '4px',
    },
    section: {
        background: 'var(--white)', border: '1px solid var(--sand)',
        borderRadius: '14px', padding: '24px',
    },
    insightRow: {
        display: 'flex', gap: '10px', alignItems: 'flex-start',
        padding: '8px 0', borderBottom: '1px solid var(--cream)',
    },
    formError: {
        background: 'rgba(181,70,58,0.08)', border: '1px solid rgba(181,70,58,0.2)',
        borderRadius: '8px', padding: '10px 14px', color: 'var(--rose)',
        fontSize: '13px', fontWeight: 500, marginBottom: '16px',
    },
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' },
    modalBackdrop: {
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: '24px',
    },
    modal: {
        background: 'var(--white)', borderRadius: '20px',
        padding: '32px', width: '100%', maxWidth: '600px',
        boxShadow: '0 32px 64px rgba(0,0,0,0.2)',
        maxHeight: '90vh', overflowY: 'auto',
    },
};

export default SubscriptionsPage;
