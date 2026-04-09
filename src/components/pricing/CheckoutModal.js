import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { subscriptionAPI } from '../../services/api';
import { BILLING_INTERVALS } from './pricingData';

const STEPS = {
  FORM: 'FORM',
  PROCESSING: 'PROCESSING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
};

const loadRazorpayScript = () => {
  if (window.Razorpay) {
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    const existingScript = document.getElementById('razorpay-checkout-js');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.id = 'razorpay-checkout-js';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const getApiErrorMessage = (error) => {
  const responseData = error?.response?.data;
  const responseMessage =
    typeof responseData?.data === 'string'
      ? responseData.data
      : responseData?.data?.message;

  return (
    responseMessage ||
    responseData?.message ||
    error?.message ||
    'Payment failed. Please try again.'
  );
};

const isLocalDevelopment = () =>
  ['localhost', '127.0.0.1'].includes(window.location.hostname);

const shouldUseMockGateway = (error) => {
  if (!isLocalDevelopment()) return false;

  const message = getApiErrorMessage(error).toLowerCase();
  return (
    message.includes('razorpay key id is not configured') ||
    message.includes('razorpay key secret is not configured') ||
    message.includes('razorpay payments are disabled') ||
    message.includes('unable to create razorpay order') ||
    message.includes('payment gateway not configured') ||
    (message.includes('razorpay') && message.includes('bad request'))
  );
};

export default function CheckoutModal({ plan, billingInterval, onClose, onSuccess }) {
  const [step, setStep] = useState(STEPS.FORM);
  const [errorMsg, setErrorMsg] = useState('');
  const [txnId, setTxnId] = useState('');

  const isLocalDev = isLocalDevelopment();
  const price = Number(plan?.price ?? 0);
  const displayPrice = Math.round(price * (billingInterval === BILLING_INTERVALS.ANNUAL ? 0.8 : 1));

  const resolvePlanId = useCallback(() => {
    const numericId = Number(plan?.id);
    if (Number.isFinite(numericId) && numericId > 0) {
      return numericId;
    }

    const fallbackMap = {
      starter: 2,
      pro: 3,
      enterprise: 4,
    };

    const normalizedName = String(plan?.name || '').trim().toLowerCase();
    return fallbackMap[normalizedName] || null;
  }, [plan?.id, plan?.name]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const paymentBrandChips = useMemo(
    () => [
      { label: 'UPI', accent: '#6b7280' },
      { label: 'VISA', accent: '#1d4ed8' },
      { label: 'MC', accent: '#ef4444' },
      { label: '+18', accent: '#0f172a' },
    ],
    []
  );

  const canPay = Boolean(resolvePlanId()) && step !== STEPS.PROCESSING;

  const completeWithMockGateway = useCallback(
    async (targetPlanId) => {
      const mockPayload = {
        paymentMethod: 'UPI',
        upiId: 'test@upi',
        amount: displayPrice,
        planId: targetPlanId,
      };

      const mockRes = await subscriptionAPI.processMockPayment(mockPayload);
      const mockData = mockRes.data?.data;

      if (!mockData?.success || !mockData?.transactionId) {
        throw new Error(mockData?.message || 'Mock payment failed.');
      }

      await subscriptionAPI.subscribe(targetPlanId, billingInterval, mockData.transactionId);
      setTxnId(mockData.transactionId);
      setStep(STEPS.SUCCESS);
    },
    [billingInterval, displayPrice]
  );

  const pay = useCallback(async () => {
    setErrorMsg('');
    setStep(STEPS.PROCESSING);

    try {
      const targetPlanId = resolvePlanId();
      if (!targetPlanId) {
        throw new Error('This plan cannot be purchased right now. Please refresh the pricing page.');
      }

      const billingPayload =
        billingInterval === BILLING_INTERVALS.ANNUAL
          ? { billingInterval: 'ANNUAL', billingCycle: 'YEARLY' }
          : { billingInterval: 'MONTHLY', billingCycle: 'MONTHLY' };

      try {
        const orderRes = await subscriptionAPI.createRazorpayOrder(targetPlanId, billingInterval);
        const order = orderRes.data?.data;

        if (!order?.keyId || !order?.orderId) {
          throw new Error('Razorpay order data is missing.');
        }

        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          throw new Error('Unable to load Razorpay checkout.');
        }

        const options = {
          key: order.keyId,
          amount: order.amountInPaise,
          currency: order.currency || 'INR',
          name: order.merchantName || 'Aegis Infra',
          description: order.description || `${plan?.name || 'Plan'} subscription`,
          order_id: order.orderId,
          prefill: {
            name: plan?.name || undefined,
            email: undefined,
            contact: undefined,
          },
          theme: { color: '#6366f1' },
          modal: {
            ondismiss: () => {
              setStep(STEPS.FORM);
              setErrorMsg('Payment was cancelled.');
            },
          },
          handler: async (response) => {
            try {
              const verifyRes = await subscriptionAPI.verifyRazorpayPayment({
                targetPlanId,
                ...billingPayload,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });

              const upgraded = verifyRes.data?.data?.upgradedSubscription;
              setTxnId(response.razorpay_payment_id);
              setStep(STEPS.SUCCESS);
              if (upgraded?.id) {
                setTxnId(response.razorpay_payment_id);
              }
            } catch (verifyError) {
              setErrorMsg(getApiErrorMessage(verifyError));
              setStep(STEPS.FAILED);
            }
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.on('payment.failed', (response) => {
          setErrorMsg(
            response?.error?.description ||
              response?.error?.reason ||
              'Payment failed. Please try again.'
          );
          setStep(STEPS.FAILED);
        });
        razorpay.open();
      } catch (gatewayError) {
        if (shouldUseMockGateway(gatewayError)) {
          await completeWithMockGateway(targetPlanId);
          return;
        }

        throw gatewayError;
      }
    } catch (err) {
      setErrorMsg(getApiErrorMessage(err));
      setStep(STEPS.FAILED);
    }
  }, [billingInterval, completeWithMockGateway, plan?.name, resolvePlanId]);

  const css = `
    @keyframes co-in { from { opacity:0; transform:translateY(28px) scale(0.96); } to { opacity:1; transform:none; } }
    @keyframes co-spin { to { transform:rotate(360deg); } }
    @keyframes co-glow { 0%,100%{box-shadow:0 0 0 0 rgba(52,211,153,0.4);}50%{box-shadow:0 0 0 16px rgba(52,211,153,0);} }
    .co-overlay {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      background: rgba(15, 23, 42, 0.28);
      backdrop-filter: blur(10px);
    }
    .co-card {
      width: 100%;
      max-width: 980px;
      min-height: 580px;
      display: flex;
      overflow: hidden;
      border-radius: 30px;
      background: linear-gradient(180deg, #ffffff 0%, #fbfbfc 100%);
      border: 1px solid rgba(15, 23, 42, 0.08);
      box-shadow: 0 32px 80px rgba(15, 23, 42, 0.16);
      animation: co-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }
    .co-left {
      width: 340px;
      min-width: 340px;
      padding: 36px 30px;
      display: flex;
      flex-direction: column;
      gap: 0;
      position: relative;
      overflow: hidden;
      border-right: 1px solid rgba(15, 23, 42, 0.06);
      background:
        radial-gradient(circle at 18% 14%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.0) 34%),
        linear-gradient(180deg, #ffffff 0%, #f8fafc 56%, #eef2f7 100%);
    }
    .co-left::before {
      content: '';
      position: absolute;
      top: -70px;
      left: -70px;
      width: 260px;
      height: 260px;
      background: radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%);
      pointer-events: none;
    }
    .co-right {
      flex: 1;
      padding: 42px 38px;
      display: flex;
      flex-direction: column;
      background: #ffffff;
    }
    .co-payment-panel {
      border: 1px solid rgba(15, 23, 42, 0.07);
      border-radius: 26px;
      padding: 26px;
      background: #ffffff;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
    }
    .co-payment-shell {
      margin-top: 18px;
      border-radius: 18px;
      overflow: hidden;
      border: 1px solid rgba(15, 23, 42, 0.1);
      background: #fff;
    }
    .co-payment-head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      padding: 22px 24px;
      border-bottom: 1px solid rgba(15,23,42,0.09);
    }
    .co-payment-title {
      font-size: 16px;
      line-height: 1.5;
      color: #111827;
      font-weight: 700;
      max-width: 360px;
    }
    .co-payment-icons {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
      flex-wrap: wrap;
      justify-content: flex-end;
    }
    .co-payment-chip {
      min-width: 42px;
      height: 30px;
      padding: 0 9px;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      border: 1px solid rgba(15,23,42,0.08);
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.03em;
      color: #111827;
      box-shadow: 0 1px 1px rgba(15,23,42,0.02);
    }
    .co-payment-body {
      padding: 22px 28px;
      background: linear-gradient(180deg, #fbfcfe 0%, #f6f8fb 100%);
      color: #1f2937;
      font-size: 15px;
      line-height: 1.7;
      text-align: center;
    }
    .co-payment-note {
      margin-top: 18px;
      padding: 14px 16px;
      border-radius: 14px;
      background: #f8fafc;
      border: 1px solid rgba(15, 23, 42, 0.07);
      color: #526074;
      font-size: 13px;
      line-height: 1.6;
    }
    .co-pay {
      width: 100%;
      padding: 15px 18px;
      border: none;
      border-radius: 14px;
      font-size: 15px;
      font-weight: 800;
      font-family: var(--ff-sans);
      letter-spacing: 0.2px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .co-pay.on {
      color: #fff;
      background: #111827;
      box-shadow: 0 12px 24px rgba(17, 24, 39, 0.18);
    }
    .co-pay.on:hover {
      transform: translateY(-2px);
      background: #0b1220;
      box-shadow: 0 16px 30px rgba(17, 24, 39, 0.24);
    }
    .co-pay.off {
      color: #94a3b8;
      background: #f8fafc;
      cursor: not-allowed;
      border: 1px solid rgba(15, 23, 42, 0.08);
    }
    @media (max-width: 760px) {
      .co-card { flex-direction: column; min-height: auto; }
      .co-left {
        width: 100%;
        min-width: 0;
        border-right: none;
        border-bottom: 1px solid rgba(15, 23, 42, 0.06);
        padding: 24px 20px;
      }
      .co-right { padding: 24px 20px; }
    }
  `;

  return (
    <div className="co-overlay" onClick={step !== STEPS.PROCESSING ? onClose : undefined}>
      <style>{css}</style>
      <div className="co-card" onClick={(e) => e.stopPropagation()}>
        <div className="co-left">
          <button
            onClick={step !== STEPS.PROCESSING ? onClose : undefined}
            style={{
              background: 'none',
              border: 'none',
              color: '#475569',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontFamily: 'var(--ff-sans)',
              fontWeight: 700,
              marginBottom: '32px',
              padding: 0,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back
          </button>

          <div style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.42em', textTransform: 'uppercase', color: '#6366f1', marginBottom: '12px' }}>
            Checkout
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#1f2937', letterSpacing: '-0.05em', lineHeight: 1.02, marginBottom: '8px', fontFamily: 'var(--ff-sans)' }}>
            {plan?.name} Plan
          </div>
          <div style={{ fontSize: '13px', color: '#55657a', marginBottom: '28px' }}>
            {billingInterval === BILLING_INTERVALS.ANNUAL ? 'Billed annually' : 'Billed monthly'}
          </div>

          <div style={{ background: 'rgba(255,255,255,0.76)', border: '1px solid rgba(15,23,42,0.06)', borderRadius: '18px', padding: '18px', marginBottom: '18px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', color: '#64748b' }}>{plan?.name} plan</span>
              <span style={{ fontSize: '13px', color: '#1f2937', fontWeight: 800 }}>{'₹'}{price}</span>
            </div>
            {billingInterval === BILLING_INTERVALS.ANNUAL && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', color: '#059669' }}>Annual discount (20%)</span>
                <span style={{ fontSize: '13px', color: '#059669', fontWeight: 700 }}>{'-'}{'₹'}{Math.round(price * 0.2)}</span>
              </div>
            )}
            <div style={{ height: '1px', background: 'rgba(15,23,42,0.08)', margin: '10px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#1f2937' }}>Total</span>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#1f2937' }}>{'₹'}{displayPrice}</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto' }}>
            {[
              'UPI is handled inside Razorpay',
              'Cards and netbanking are available too',
              'Subscription activates after verification',
            ].map((text) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#5b677a' }}>
                <span aria-hidden="true" style={{ color: '#6366f1', fontWeight: 900 }}>{'•'}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="co-right">
          {step === STEPS.PROCESSING && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
              <div style={{ width: '56px', height: '56px', border: '2.5px solid rgba(99,102,241,0.15)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'co-spin 0.75s linear infinite' }} />
              <div>
                <div style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', textAlign: 'center', marginBottom: '4px' }}>
                  Verifying payment...
                </div>
                <div style={{ fontSize: '13px', color: '#536175', textAlign: 'center' }}>Please do not close this window</div>
              </div>
            </div>
          )}

          {step === STEPS.SUCCESS && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(52,211,153,0.08)', border: '2px solid rgba(52,211,153,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'co-glow 2s infinite' }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', marginBottom: '6px' }}>Payment Successful</div>
                <div style={{ fontSize: '11px', fontFamily: 'var(--ff-mono)', color: '#536175', marginBottom: '4px' }}>{txnId}</div>
                <div style={{ fontSize: '13px', color: '#475569' }}>Your {plan?.name} plan is now active</div>
              </div>
              <button
                onClick={onSuccess}
                style={{
                  background: 'linear-gradient(135deg, #34d399, #059669)',
                  border: 'none',
                  color: '#fff',
                  padding: '13px 32px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 800,
                  fontFamily: 'var(--ff-sans)',
                  cursor: 'pointer',
                  boxShadow: '0 0 24px rgba(52,211,153,0.3)',
                }}
              >
                Go to Dashboard →
              </button>
            </div>
          )}

          {step === STEPS.FAILED && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(239,68,68,0.08)', border: '2px solid rgba(239,68,68,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', marginBottom: '6px' }}>Payment Failed</div>
                <div style={{ fontSize: '13px', color: '#ef4444', lineHeight: 1.5 }}>{errorMsg}</div>
              </div>
              <button
                onClick={() => setStep(STEPS.FORM)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(15,23,42,0.12)',
                  color: '#475569',
                  padding: '13px 32px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 800,
                  fontFamily: 'var(--ff-sans)',
                  cursor: 'pointer',
                }}
              >
                Try again
              </button>
            </div>
          )}

          {step === STEPS.FORM && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '22px' }}>
              <div>
                <div style={{ fontSize: '32px', lineHeight: 1.05, fontWeight: 800, color: '#1f2937', letterSpacing: '-0.055em', marginBottom: '10px' }}>
                  <span style={{
                    background: 'linear-gradient(135deg, #111827 0%, #6b7280 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}>
                    Payment
                  </span>
                </div>
                <div style={{ fontSize: '15px', color: '#566579', marginBottom: '18px' }}>
                  All transactions are secure and encrypted.
                </div>

                <div className="co-payment-panel">
                  <div className="co-payment-shell">
                    <div className="co-payment-head">
                      <div className="co-payment-title">
                        Razorpay Secure (UPI, Cards, Int&apos;l Cards, Wallets)
                      </div>
                      <div className="co-payment-icons" aria-label="Supported payment methods">
                        {paymentBrandChips.map((chip) => (
                          <span
                            key={chip.label}
                            className="co-payment-chip"
                            style={{ color: chip.accent }}
                          >
                            {chip.label}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="co-payment-body">
                      You&apos;ll be redirected to Razorpay Secure (UPI, Cards, Int&apos;l Cards, Wallets) to complete your purchase.
                    </div>
                  </div>

                  <div className="co-payment-note">
                    UPI is available inside Razorpay, so you do not enter UPI details in this modal.
                    If a card is not supported, switch to UPI or a domestic card in the Razorpay sheet.
                  </div>
                </div>

                {errorMsg && (
                  <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)', color: '#ef4444', padding: '12px 14px', borderRadius: '12px', fontSize: '13px', lineHeight: 1.5, marginTop: '16px' }}>
                    {errorMsg}
                  </div>
                )}
              </div>

              <div style={{ marginTop: 'auto' }}>
                <button
                  className={`co-pay ${canPay ? 'on' : 'off'}`}
                  disabled={!canPay}
                  onClick={pay}
                >
                  Proceed to Razorpay · {'₹'}{displayPrice}
                </button>
                <div style={{ marginTop: '10px', fontSize: '11px', color: '#5b677a', lineHeight: 1.5 }}>
                  Razorpay will show the payment methods enabled on your account. If UPI still does not appear, the Razorpay account itself likely does not have UPI enabled for this key.
                </div>
                {!isLocalDev && (
                  <div style={{ marginTop: '10px', fontSize: '11px', color: '#1f2937', lineHeight: 1.5, opacity: 0.68 }}>
                    If payment creation still fails in production, check the backend Razorpay environment variables.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
