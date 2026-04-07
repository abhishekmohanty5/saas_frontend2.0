import React, { useState, useEffect, useCallback } from 'react';
import { subscriptionAPI } from '../../services/api';
import { BILLING_INTERVALS } from './pricingData';

const STEPS = { FORM: 'FORM', PROCESSING: 'PROCESSING', SUCCESS: 'SUCCESS', FAILED: 'FAILED' };

const fmt = {
  card: v => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim(),
  expiry: v => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d; },
  cvv: v => v.replace(/\D/g, '').slice(0, 4),
};

/* ─── Shared input style ─────────────────────────────────────────────────── */
const inputStyle = {
  width: '100%',
  background: '#ffffff',
  border: '1px solid #cbd5e1',
  color: '#0f172a',
  borderRadius: '10px',
  padding: '13px 16px',
  fontSize: '14px',
  fontFamily: 'var(--ff-sans)',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

function Input({ style, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      {...props}
      style={{
        ...inputStyle,
        ...(focused ? { borderColor: 'rgba(99,102,241,0.5)', boxShadow: '0 0 0 3px rgba(99,102,241,0.08)' } : {}),
        ...style,
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

export default function CheckoutModal({ plan, billingInterval, onClose, onSuccess }) {
  const [tab, setTab] = useState('upi');
  const [step, setStep] = useState(STEPS.FORM);
  const [errorMsg, setErrorMsg] = useState('');
  const [txnId, setTxnId] = useState('');

  // UPI
  const [upiId, setUpiId] = useState('');

  // Card
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');

  const price = plan?.price ?? 0;
  const displayPrice = Math.round(price * (billingInterval === BILLING_INTERVALS.ANNUAL ? 0.8 : 1));

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const canPay = tab === 'upi'
    ? /^[a-zA-Z0-9.\-_+]+@[a-zA-Z]{3,}$/.test(upiId.trim())
    : cardNumber.replace(/\s/g, '').length === 16 && cardExpiry.length === 5 && cardCvv.length >= 3 && cardName.length > 1;

  const pay = useCallback(async () => {
    setErrorMsg('');
    setStep(STEPS.PROCESSING);

    const payload = {
      paymentMethod: tab.toUpperCase(),
      amount: displayPrice,
      planId: plan.id,
      ...(tab === 'upi'
        ? { upiId: upiId.trim() }
        : { cardNumber: cardNumber.replace(/\s/g, ''), cardExpiry, cardCvv, cardHolderName: cardName }),
    };

    await new Promise(r => setTimeout(r, 2500)); // realistic delay

    try {
      const res = await subscriptionAPI.processPayment(payload);
      const data = res.data?.data;
      if (data?.success && data?.transactionId) {
        await subscriptionAPI.subscribe(plan.id, billingInterval, data.transactionId);
        setTxnId(data.transactionId);
        setStep(STEPS.SUCCESS);
      } else {
        setErrorMsg(data?.message || 'Payment failed. Please try again.');
        setStep(STEPS.FAILED);
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.data?.message ||
        err.response?.data?.message ||
        'Payment failed. Please try again.'
      );
      setStep(STEPS.FAILED);
    }
  }, [tab, upiId, cardNumber, cardExpiry, cardCvv, cardName, plan, billingInterval, displayPrice]);

  /* ── Light Styles ─────────────────────────────────────────────────────────────── */
  const css = `
    @keyframes co-in { from { opacity:0; transform:translateY(28px) scale(0.96); } to { opacity:1; transform:none; } }
    @keyframes co-spin { to { transform:rotate(360deg); } }
    @keyframes co-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(99,102,241,0.4);}50%{box-shadow:0 0 0 16px rgba(99,102,241,0);} }
    @keyframes co-glow { 0%,100%{box-shadow:0 0 0 0 rgba(52,211,153,0.4);}50%{box-shadow:0 0 0 16px rgba(52,211,153,0);} }
    .co-overlay { position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px; background:rgba(15,23,42,0.4); backdrop-filter:blur(12px); }
    .co-card { background:#ffffff; border:1px solid #e2e8f0; border-radius:24px; width:100%;max-width:820px; overflow:hidden; box-shadow:0 25px 50px -12px rgba(0,0,0,0.25); animation:co-in 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards; display:flex; min-height:520px; }
    .co-left { width:280px;min-width:280px; background:linear-gradient(160deg,#f8fafc 0%,#f1f5f9 100%); border-right:1px solid #e2e8f0; padding:36px 28px; display:flex;flex-direction:column;gap:0; position:relative;overflow:hidden; }
    .co-left::before { content:''; position:absolute;top:-80px;left:-80px;width:300px;height:300px; background:radial-gradient(circle,rgba(99,102,241,0.06) 0%,transparent 70%); pointer-events:none; }
    .co-right { flex:1; padding:36px 32px; display:flex;flex-direction:column; background:#ffffff;}
    .co-tab { flex:1;padding:9px 0;border:1px solid transparent;cursor:pointer;border-radius:10px;font-size:13px;font-weight:600;font-family:var(--ff-sans);transition:all 0.2s;color:#64748b;background:transparent; }
    .co-tab.on { background:#f1f5f9;color:#0f172a;border-color:#cbd5e1;box-shadow:0 1px 2px rgba(0,0,0,0.05); }
    .co-tab:hover:not(.on) { color:#334155;background:#f8fafc; }
    .co-pay { width:100%;padding:15px;border:none;border-radius:12px;font-size:15px;font-weight:700;font-family:var(--ff-sans);letter-spacing:0.3px;cursor:pointer;transition:all 0.3s; }
    .co-pay.on { background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff; box-shadow:0 4px 14px rgba(99,102,241,0.3); }
    .co-pay.on:hover { transform:translateY(-2px);box-shadow:0 6px 20px rgba(99,102,241,0.4); }
    .co-pay.off { background:#f1f5f9;color:#94a3b8;cursor:not-allowed;border:1px solid #e2e8f0; }
    .co-bank { font-size:10px;font-weight:600;padding:4px 10px;border-radius:20px;border:1px solid #e2e8f0;color:#64748b;background:#f8fafc; }
    .co-input-wrap { display:flex;flex-direction:column;gap:10px;margin-bottom:20px; }
    .co-row { display:grid;grid-template-columns:1fr 1fr;gap:10px; }
    @media(max-width:640px){ .co-card{flex-direction:column;} .co-left{width:100%;min-width:0;border-right:none;border-bottom:1px solid #e2e8f0;padding:24px 20px;} .co-right{padding:24px 20px;} }
  `;

  return (
    <div className="co-overlay" onClick={step !== STEPS.PROCESSING ? onClose : undefined}>
      <style>{css}</style>
      <div className="co-card" onClick={e => e.stopPropagation()}>

        {/* ── Left Panel: Order Summary ── */}
        <div className="co-left">
          {/* Back button */}
          <button onClick={step !== STEPS.PROCESSING ? onClose : undefined}
            style={{ background:'none', border:'none', color:'#475569', cursor:'pointer', display:'flex', alignItems:'center', gap:'6px', fontSize:'12px', fontFamily:'var(--ff-sans)', fontWeight:600, marginBottom:'32px', padding:0, letterSpacing:'0.5px', textTransform:'uppercase' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Back
          </button>

          {/* Plan badge */}
          <div style={{ fontSize:'10px', fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:'#6366f1', marginBottom:'12px' }}>
            Checkout
          </div>
          <div style={{ fontSize:'26px', fontWeight:800, color:'#f1f5f9', letterSpacing:'-1px', lineHeight:1.1, marginBottom:'6px', fontFamily:'var(--ff-sans)' }}>
            {plan?.name} Plan
          </div>
          <div style={{ fontSize:'13px', color:'#475569', marginBottom:'28px' }}>
            {billingInterval === BILLING_INTERVALS.ANNUAL ? 'Billed annually' : 'Billed monthly'}
          </div>

          {/* Price block */}
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:'14px', padding:'18px', marginBottom:'20px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px' }}>
              <span style={{ fontSize:'13px', color:'#64748b' }}>{plan?.name} plan</span>
              <span style={{ fontSize:'13px', color:'#94a3b8' }}>₹{price}</span>
            </div>
            {billingInterval === BILLING_INTERVALS.ANNUAL && (
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px' }}>
                <span style={{ fontSize:'13px', color:'#34d399' }}>Annual discount (20%)</span>
                <span style={{ fontSize:'13px', color:'#34d399' }}>−₹{Math.round(price * 0.2)}</span>
              </div>
            )}
            <div style={{ height:'1px', background:'rgba(255,255,255,0.05)', margin:'10px 0' }} />
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:'14px', fontWeight:700, color:'#e2e8f0' }}>Total</span>
              <span style={{ fontSize:'18px', fontWeight:800, color:'#f1f5f9' }}>₹{displayPrice}</span>
            </div>
          </div>

          {/* Secure badges */}
          <div style={{ display:'flex', flexDirection:'column', gap:'8px', marginTop:'auto' }}>
            {[
              { icon:'🔒', text:'256-bit SSL encryption' },
              { icon:'🛡️', text:'Secured by AES' },
              { icon:'⚡', text:'Instant activation' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'11px', color:'#334155' }}>
                <span>{icon}</span><span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Panel: Payment Form ── */}
        <div className="co-right">

          {/* ── PROCESSING ── */}
          {step === STEPS.PROCESSING && (
            <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'20px' }}>
              <div style={{ width:'56px', height:'56px', border:'2.5px solid rgba(99,102,241,0.15)', borderTopColor:'#6366f1', borderRadius:'50%', animation:'co-spin 0.75s linear infinite' }} />
              <div>
                <div style={{ fontSize:'17px', fontWeight:700, color:'#e2e8f0', textAlign:'center', marginBottom:'4px' }}>Verifying Payment…</div>
                <div style={{ fontSize:'13px', color:'#334155', textAlign:'center' }}>Please do not close this window</div>
              </div>
            </div>
          )}

          {/* ── SUCCESS ── */}
          {step === STEPS.SUCCESS && (
            <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'20px' }}>
              <div style={{ width:'72px', height:'72px', borderRadius:'50%', background:'rgba(52,211,153,0.08)', border:'2px solid rgba(52,211,153,0.4)', display:'flex', alignItems:'center', justifyContent:'center', animation:'co-glow 2s infinite' }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:'20px', fontWeight:800, color:'#f1f5f9', marginBottom:'6px' }}>Payment Successful</div>
                <div style={{ fontSize:'11px', fontFamily:'var(--ff-mono)', color:'#334155', marginBottom:'4px' }}>{txnId}</div>
                <div style={{ fontSize:'13px', color:'#475569' }}>Your {plan?.name} plan is now active</div>
              </div>
              <button onClick={onSuccess} style={{ background:'linear-gradient(135deg,#34d399,#059669)', border:'none', color:'#fff', padding:'13px 32px', borderRadius:'12px', fontSize:'14px', fontWeight:700, fontFamily:'var(--ff-sans)', cursor:'pointer', boxShadow:'0 0 24px rgba(52,211,153,0.3)' }}>
                Go to Dashboard →
              </button>
            </div>
          )}

          {/* ── FAILED ── */}
          {step === STEPS.FAILED && (
            <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'20px' }}>
              <div style={{ width:'72px', height:'72px', borderRadius:'50%', background:'rgba(239,68,68,0.08)', border:'2px solid rgba(239,68,68,0.4)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </div>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:'20px', fontWeight:800, color:'#f1f5f9', marginBottom:'6px' }}>Payment Failed</div>
                <div style={{ fontSize:'13px', color:'#ef4444' }}>{errorMsg}</div>
              </div>
              <button onClick={() => setStep(STEPS.FORM)} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'#94a3b8', padding:'13px 32px', borderRadius:'12px', fontSize:'14px', fontWeight:700, fontFamily:'var(--ff-sans)', cursor:'pointer' }}>
                ← Try Again
              </button>
            </div>
          )}

          {/* ── FORM ── */}
          {step === STEPS.FORM && (
            <>
              <div style={{ fontSize:'17px', fontWeight:700, color:'#e2e8f0', marginBottom:'6px', fontFamily:'var(--ff-sans)' }}>
                Payment Method
              </div>
              <div style={{ fontSize:'12px', color:'#334155', marginBottom:'24px' }}>
                All transactions are encrypted and secure
              </div>

              {/* Tab switcher */}
              <div style={{ display:'flex', gap:'4px', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:'12px', padding:'4px', marginBottom:'28px' }}>
                <button className={`co-tab ${tab === 'upi' ? 'on' : ''}`} onClick={() => setTab('upi')}>
                  <span style={{ marginRight:'5px' }}>⚡</span>UPI
                </button>
                <button className={`co-tab ${tab === 'card' ? 'on' : ''}`} onClick={() => setTab('card')}>
                  <span style={{ marginRight:'5px' }}>💳</span>Debit / Credit Card
                </button>
              </div>

              {/* ── UPI ── */}
              {tab === 'upi' && (
                <div style={{ flex: 1 }}>
                  {/* QR + ID side by side */}
                  <div style={{ display:'flex', gap:'24px', alignItems:'flex-start', marginBottom:'24px' }}>
                    <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'16px', padding:'0', flexShrink:0, overflow:'hidden' }}>
                      <img src="/phonepe-qr.jpg" alt="UPI QR" width={140} height={180} style={{ display:'block', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:'12px', color:'#475569', marginBottom:'6px' }}>UPI ID</div>
                      <div style={{ fontSize:'13px', fontFamily:'var(--ff-mono)', color:'#6366f1', background:'rgba(99,102,241,0.06)', border:'1px solid rgba(99,102,241,0.15)', borderRadius:'8px', padding:'8px 12px', marginBottom:'10px' }}>
                        aegisinfra@icici
                      </div>
                      <div style={{ fontSize:'11px', color:'#334155', marginBottom:'12px' }}>₹{displayPrice} · Scan with any UPI app</div>

                      {/* Bank pills */}
                      <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                        {['GPay', 'PhonePe', 'Paytm', 'BHIM', 'Amazon Pay'].map(b => (
                          <span key={b} className="co-bank">{b}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px' }}>
                    <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,0.05)' }} />
                    <span style={{ fontSize:'11px', color:'#334155', whiteSpace:'nowrap' }}>or enter UPI ID manually</span>
                    <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,0.05)' }} />
                  </div>

                  <Input
                    placeholder="yourname@bank  (e.g. rahul@okaxis)"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    style={{ marginBottom:'8px' }}
                  />
                  <div style={{ fontSize:'11px', color:'#334155', marginBottom:'24px' }}>
                    Test: any valid UPI ID works ·&nbsp;
                    <span style={{ fontFamily:'var(--ff-mono)', color:'#ef4444', fontSize:'11px' }}>fail@upi</span>
                    &nbsp;= declined
                  </div>
                </div>
              )}

              {/* ── Card ── */}
              {tab === 'card' && (
                <div className="co-input-wrap">
                  <Input placeholder="Cardholder Name" value={cardName} onChange={e => setCardName(e.target.value)} />
                  <div style={{ position:'relative' }}>
                    <Input placeholder="Card Number" value={cardNumber} onChange={e => setCardNumber(fmt.card(e.target.value))} maxLength={19} style={{ paddingRight:'90px' }} />
                    <div style={{ position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', display:'flex', gap:'6px', alignItems:'center' }}>
                      {['VISA', 'MC', 'RuPay'].map(b => (
                        <span key={b} style={{ fontSize:'9px', fontWeight:700, color:'#334155', background:'rgba(255,255,255,0.04)', padding:'2px 6px', borderRadius:'4px', border:'1px solid rgba(255,255,255,0.06)' }}>{b}</span>
                      ))}
                    </div>
                  </div>
                  <div className="co-row">
                    <Input placeholder="MM / YY" value={cardExpiry} onChange={e => setCardExpiry(fmt.expiry(e.target.value))} maxLength={5} />
                    <Input placeholder="CVV" type="password" value={cardCvv} onChange={e => setCvv(fmt.cvv(e.target.value))} maxLength={4} />
                  </div>
                  <div style={{ fontSize:'11px', color:'#334155' }}>
                    Test: any 16-digit card succeeds ·&nbsp;
                    <span style={{ fontFamily:'var(--ff-mono)', color:'#ef4444' }}>•••• 9999</span> = declined ·&nbsp;
                    <span style={{ fontFamily:'var(--ff-mono)', color:'#f59e0b' }}>•••• 0002</span> = insufficient funds
                  </div>
                </div>
              )}

              {/* Pay CTA */}
              <div style={{ marginTop:'auto' }}>
                <button
                  className={`co-pay ${canPay ? 'on' : 'off'}`}
                  disabled={!canPay}
                  onClick={pay}
                >
                  {tab === 'upi' ? '⚡ Verify & Pay' : '🔒 Pay Now'} · ₹{displayPrice}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
