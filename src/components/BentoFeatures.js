import React, { useState, useEffect } from 'react';

const codeSnippets = {
    auth: `// AuthController.java
@PostMapping("/login")
public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest req) {
    Authentication auth = authManager.authenticate(
        new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
    );
    
    SecurityContextHolder.getContext().setAuthentication(auth);
    String jwt = jwtUtils.generateJwtToken(auth);
    
    // JWT Payload includes tenantId for automatic data isolation
    return ResponseEntity.ok(new JwtResponse(jwt, user.getId(), user.getTenantId()));
}`,
    tenant: `// TenantInterceptor.java
@Component
public class TenantInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object handler) {
        String token = parseJwt(req);
        if (token != null && jwtUtils.validateJwtToken(token)) {
            // Extract and set tenant context globally per request
            String tenantId = jwtUtils.getTenantIdFromJwtToken(token);
            TenantContext.setCurrentTenant(tenantId);
        }
        return true;
    }
}`,
    schedule: `// SubscriptionScheduler.java
@Scheduled(cron = "0 0 2 * * ?") // Runs at 2:00 AM daily
public void expireSubscriptions() {
    log.info("Running daily subscription expiration check...");
    List<Subscription> expired = subRepo.findExpiredSubscriptions(LocalDate.now());
    
    for (Subscription sub : expired) {
        sub.setStatus(SubscriptionStatus.EXPIRED);
        subRepo.save(sub);
        // Revoke API access instantly
        apiGateway.revokeAccess(sub.getTenantId());
    }
}`,
    api: `// ApiUsageFilter.java
@Override
public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) {
    String tenantId = TenantContext.getCurrentTenant();
    
    // Increment real-time Redis counter per API call
    redisTemplate.opsForValue().increment("usage:" + tenantId + ":calls");
    
    // Check if tenant exceeded tier limits
    if (usageService.isLimitExceeded(tenantId)) {
        throw new RateLimitExceededException("Upgrade plan for more API calls");
    }
    
    chain.doFilter(req, res);
}`
};

const BentoFeatures = () => {
    const [activeTab, setActiveTab] = useState('auth');
    const [displayedCode, setDisplayedCode] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // Typing effect logic
    useEffect(() => {
        setIsTyping(true);
        setDisplayedCode('');
        const targetCode = codeSnippets[activeTab];
        let currentIndex = 0;

        const typingInterval = setInterval(() => {
            if (currentIndex < targetCode.length) {
                setDisplayedCode(prev => prev + targetCode[currentIndex]);
                currentIndex++;
            } else {
                clearInterval(typingInterval);
                setIsTyping(false);
            }
        }, 8); // extremely fast typing speed

        return () => clearInterval(typingInterval);
    }, [activeTab]);

    const tabs = [
        {
            id: 'auth',
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>,
            title: 'Authentication Engine',
            desc: 'JWT-secured with HS256 signing.'
        },
        {
            id: 'tenant',
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 12 12 17 22 12"></polyline><polyline points="2 17 12 22 22 17"></polyline></svg>,
            title: 'Multi-Tenant Architecture',
            desc: 'Complete data isolation per startup.'
        },
        {
            id: 'schedule',
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
            title: 'Automated Lifecycle',
            desc: 'Auto-expire at 2 AM & daily reminders.'
        },
        {
            id: 'api',
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>,
            title: 'API Usage Tracking',
            desc: 'Every non-auth call counted in real-time.'
        }
    ];

    return (
        <div id="features" style={{ padding: '120px 48px', maxWidth: '1400px', margin: '0 auto', fontFamily: 'var(--ff-sans)' }}>

            {/* Header Section */}
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                <div style={{
                    display: 'inline-block',
                    fontSize: '13px',
                    fontWeight: 600,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: 'var(--gold)',
                    marginBottom: '20px',
                    padding: '8px 16px',
                    background: 'rgba(201, 168, 76, 0.1)',
                    borderRadius: '100px',
                    border: '1px solid rgba(201, 168, 76, 0.2)'
                }}>
                    Core Infrastructure
                </div>
                <h2 style={{
                    fontFamily: 'var(--ff-serif)',
                    fontSize: 'clamp(40px, 5vw, 64px)',
                    lineHeight: 1.1,
                    letterSpacing: '-1px',
                    color: 'var(--ink)',
                    fontWeight: 400,
                    maxWidth: '800px',
                    margin: '0 auto'
                }}>
                    Built for the full subscription <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>lifecycle</em>
                </h2>
                <p style={{ fontSize: '18px', color: 'var(--muted)', lineHeight: 1.6, maxWidth: '600px', margin: '24px auto 0' }}>
                    Real backend architecture. See how the engine handles auth, multi-tenancy, and automated billing schedules under the hood.
                </p>
            </div>

            {/* Split Layout Container */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1.5fr',
                gap: '40px',
                alignItems: 'start'
            }}>

                {/* Left Side: Interactive Navigation */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                textAlign: 'left',
                                padding: '24px',
                                borderRadius: '16px',
                                background: activeTab === tab.id ? 'var(--ink)' : 'transparent',
                                border: activeTab === tab.id ? '1px solid var(--ink2)' : '1px solid transparent',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: activeTab === tab.id ? '0 20px 40px rgba(0,0,0,0.1)' : 'none',
                                transform: activeTab === tab.id ? 'translateX(10px)' : 'translateX(0)',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '20px'
                            }}
                            onMouseEnter={(e) => {
                                if (activeTab !== tab.id) {
                                    e.currentTarget.style.background = 'rgba(0,0,0,0.02)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (activeTab !== tab.id) {
                                    e.currentTarget.style.background = 'transparent';
                                }
                            }}
                        >
                            <div style={{
                                fontSize: '24px',
                                background: activeTab === tab.id ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                                width: '48px', height: '48px',
                                borderRadius: '12px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0,
                                transition: 'all 0.3s ease'
                            }}>
                                <div style={{
                                    color: activeTab === tab.id ? 'var(--gold)' : 'var(--muted)',
                                    transition: 'color 0.3s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {tab.icon}
                                </div>
                            </div>
                            <div>
                                <div style={{
                                    fontSize: '18px',
                                    fontWeight: 600,
                                    color: activeTab === tab.id ? 'var(--white)' : 'var(--ink)',
                                    marginBottom: '8px',
                                    transition: 'color 0.3s ease'
                                }}>
                                    {tab.title}
                                </div>
                                <div style={{
                                    fontSize: '15px',
                                    color: activeTab === tab.id ? 'rgba(255,255,255,0.6)' : 'var(--muted)',
                                    lineHeight: 1.5,
                                    transition: 'color 0.3s ease'
                                }}>
                                    {tab.desc}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Right Side: IDE/Terminal Window */}
                <div style={{
                    background: '#0D0D0D',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '560px', // Fixed height so it doesn't jump
                    position: 'relative'
                }}>
                    {/* IDE Header (Mac style) */}
                    <div style={{
                        background: '#1A1A1A',
                        padding: '16px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid rgba(255,255,255,0.05)'
                    }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FF5F56' }} />
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FFBD2E' }} />
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27C93F' }} />
                        </div>
                        <div style={{
                            fontSize: '13px',
                            color: 'rgba(255,255,255,0.4)',
                            fontFamily: 'var(--ff-mono)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                            src/main/java/com/saas/engine
                        </div>
                    </div>

                    {/* IDE Content */}
                    <div style={{
                        padding: '32px',
                        fontFamily: 'var(--ff-mono)',
                        fontSize: '15px',
                        lineHeight: 1.7,
                        color: '#E6E6E6',
                        overflowY: 'auto',
                        flex: 1,
                        position: 'relative'
                    }}>
                        {/* Syntax Highlighting overrides via inline styles conceptually */}
                        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                            {displayedCode.split('\n').map((line, i) => {
                                // Super basic syntax coloring logic for the demo
                                let coloredLine = line;
                                if (line.startsWith('//')) {
                                    return <div key={i} style={{ color: '#6B7280' }}>{line}</div>;
                                }
                                if (line.includes('@PostMapping') || line.includes('@Component') || line.includes('@Scheduled') || line.includes('@Override')) {
                                    return <div key={i} style={{ color: '#F59E0B' }}>{line}</div>;
                                }
                                if (line.includes('public') || line.includes('class') || line.includes('return') || line.includes('if')) {
                                    coloredLine = coloredLine.replace(/(public|class|return|if|new)/g, '<span style="color: #EC4899">$1</span>');
                                }
                                if (line.includes('String') || line.includes('void') || line.includes('boolean') || line.includes('ResponseEntity')) {
                                    coloredLine = coloredLine.replace(/(String|void|boolean|ResponseEntity|Authentication|List)/g, '<span style="color: #60A5FA">$1</span>');
                                }

                                return <div key={i} dangerouslySetInnerHTML={{ __html: coloredLine }} />;
                            })}

                            {/* Blinking cursor */}
                            {isTyping && <span style={{
                                display: 'inline-block',
                                width: '8px',
                                height: '16px',
                                background: 'rgba(255,255,255,0.8)',
                                marginLeft: '4px',
                                verticalAlign: 'middle',
                                animation: 'blink 1s step-end infinite'
                            }} />}
                        </pre>
                    </div>

                    {/* Faint subtle glow inside the IDE */}
                    <div style={{
                        position: 'absolute',
                        bottom: '-50%',
                        right: '-50%',
                        width: '100%',
                        height: '100%',
                        background: 'radial-gradient(circle, rgba(201, 168, 76, 0.05) 0%, transparent 60%)',
                        pointerEvents: 'none'
                    }} />
                </div>
            </div>

            <style>{`
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default BentoFeatures;
