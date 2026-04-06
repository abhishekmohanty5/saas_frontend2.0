import React from 'react';
import './Testimonials.css';

const STAR = String.fromCharCode(9733);

const testimonials = [
    {
        quote: 'The automated billing cycles and tenant isolation felt production-ready on day one. We moved from prototype to launch mode without rewriting the basics.',
        name: 'Biswaranjan',
        role: 'Software Architect',
        company: 'TechNova',
        avatar: 'B',
        gradient: 'linear-gradient(135deg, #7c6cf4 0%, #38bdf8 100%)'
    },
    {
        quote: 'SubSphere stayed calm under peak traffic and gave our team the confidence to scale faster. The analytics layer helped us catch churn signals earlier than expected.',
        name: 'Sasi Kumar',
        role: 'CTO',
        company: 'CloudScale',
        avatar: 'S',
        gradient: 'linear-gradient(135deg, #2d6a4f 0%, #40916c 100%)'
    },
    {
        quote: 'The API contract was predictable, the auth flow was clean, and the entire developer experience felt unusually polished for a fast-moving SaaS stack.',
        name: 'Gaurav Kumar',
        role: 'Engineering Manager',
        company: 'FinFlow',
        avatar: 'G',
        gradient: 'linear-gradient(135deg, #c9a84c 0%, #e2be6a 100%)'
    },
    {
        quote: 'We wanted enterprise structure without enterprise drag. The platform gave us governance, billing, and observability in a way that still felt lightweight.',
        name: 'Ananya Rao',
        role: 'VP Product',
        company: 'Northstar Labs',
        avatar: 'A',
        gradient: 'linear-gradient(135deg, #fb7185 0%, #f97316 100%)'
    },
    {
        quote: 'The dashboard interactions are quick, the data model is thoughtful, and the system leaves room for teams to grow instead of boxing them into rigid workflows.',
        name: 'Raghav Menon',
        role: 'Platform Lead',
        company: 'OrbitOps',
        avatar: 'R',
        gradient: 'linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)'
    },
    {
        quote: 'From onboarding to subscription controls, every surface feels intentional. It has the same kind of restraint and clarity we look for in premium developer tools.',
        name: 'Meera Sharma',
        role: 'Founder',
        company: 'Lattice Cloud',
        avatar: 'M',
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)'
    }
];

const splitIndex = Math.ceil(testimonials.length / 2);
const testimonialRows = [testimonials.slice(0, splitIndex), testimonials.slice(splitIndex)];

const Testimonials = () => {
    return (
        <section className="testimonials-premium-section">
            <div className="testimonials-premium-shell reveal">
                <div className="testimonials-premium-eyebrow">TESTIMONIALS</div>

                <h2 className="testimonials-premium-title">
                    Trusted by engineers <br />
                    <em>scaling the future.</em>
                </h2>

                <div className="testimonials-marquee-stack">
                    <MarqueeRow testimonials={testimonialRows[0]} direction="left" duration="34s" />
                    <MarqueeRow testimonials={testimonialRows[1]} direction="right" duration="38s" secondary />
                </div>
            </div>
        </section>
    );
};

const MarqueeRow = ({ testimonials: rowTestimonials, direction, duration, secondary = false }) => {
    const items = [...rowTestimonials, ...rowTestimonials];

    return (
        <div className={`testimonials-marquee ${secondary ? 'testimonials-marquee-secondary' : ''}`}>
            <div
                className={`testimonials-track testimonials-track-${direction}`}
                style={{ '--testimonial-duration': duration }}
            >
                {items.map((testimonial, index) => (
                    <TestimonialCard
                        key={`${testimonial.name}-${testimonial.company}-${index}`}
                        {...testimonial}
                    />
                ))}
            </div>
        </div>
    );
};

const TestimonialCard = ({ quote, name, role, company, avatar, gradient }) => {
    return (
        <article className="testimonial-premium-card">
            <div className="testimonial-card-topline">
                <div className="testimonial-rating" aria-hidden="true">
                    {STAR.repeat(5)}
                </div>
                <span className="testimonial-chip">Verified Team</span>
            </div>

            <p className="testimonial-premium-quote">"{quote}"</p>

            <div className="testimonial-premium-author">
                <div className="testimonial-premium-avatar" style={{ backgroundImage: gradient }}>
                    {avatar}
                </div>

                <div>
                    <div className="testimonial-premium-name">{name}</div>
                    <div className="testimonial-premium-role">{role} - {company}</div>
                </div>
            </div>
        </article>
    );
};

export default Testimonials;
